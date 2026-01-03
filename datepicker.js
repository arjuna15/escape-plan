(function () {
  const ID_MONTHS = ["Januari","Februari","Maret","April","Mei","Juni",
    "Juli","Agustus","September","Oktober","November","Desember"];
  const ID_DAYS_MIN = ["Min","Sen","Sel","Rab","Kam","Jum","Sab"];

  let bookedDates = new Set();
  if (typeof window.bookedDates !== "undefined" && Array.isArray(window.bookedDates)) {
    bookedDates = new Set(window.bookedDates);
  }

  let checkinDate = null;
  let checkoutDate = null;
  let selectingCheckin = true; // true = sedang pilih checkin, false = sedang pilih checkout

  function formatDDMMYYYY(date) {
    if (!date) return '';
    const d = String(date.getDate()).padStart(2, "0");
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const y = date.getFullYear();
    return `${d}/${m}/${y}`;
  }

  function parseDDMMYYYY(str) {
    if (!str) return null;
    const m = str.match(/^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{4})$/);
    if (!m) return null;
    let [_, d, mo, y] = m;
    d = +d; mo = +mo; y = +y;
    const dt = new Date(y, mo - 1, d);
    if (dt.getFullYear() === y && dt.getMonth() === mo - 1 && dt.getDate() === d) return dt;
    return null;
  }

  class Datepicker {
    constructor(input) {
      this.input = input;
      this.viewDate = new Date();
      this.isOpen = false;
      this.build();
      this.bind();
    }

    build() {
      const el = document.createElement("div");
      el.className = "datepicker";
      el.innerHTML = `
        <div class="dp-header">
          <div class="dp-nav-container">
            <button class="dp-nav-btn" data-nav="prev">◀</button>
            <div class="dp-title-container">
                      <div class="dp-mode-toggle">
            <button class="mode-btn active" data-mode="checkin">Check-in</button>
            <button class="mode-btn" data-mode="checkout">Check-out</button>
          </div>
              <!-- Main title can be simplified or removed, individual titles are now in calendars -->
            </div>
            <button class="dp-nav-btn" data-nav="next">▶</button>
          </div>

        </div>
        <div class="dp-calendars">
          <div class="dp-calendar">
            <div class="dp-title dp-title-1"></div>
            <div class="dp-week"></div>
            <div class="dp-days dp-days-1"></div>
          </div>
          <div class="dp-calendar">
            <div class="dp-title dp-title-2"></div>
            <div class="dp-week"></div>
            <div class="dp-days dp-days-2"></div>
          </div>
        </div>
        <div class="dp-footer">
          <button class="dp-btn clear-btn">Clear</button>
          <button class="dp-btn apply-btn">Apply</button>
        </div>
      `;
      document.body.appendChild(el);

      this.el = el;
      this.title1 = el.querySelector(".dp-title-1");
      this.title2 = el.querySelector(".dp-title-2");
      this.weeks = el.querySelectorAll(".dp-week");
      this.days1 = el.querySelector(".dp-days-1");
      this.days2 = el.querySelector(".dp-days-2");
      this.modeBtns = el.querySelectorAll(".mode-btn");

      // Setup weeks
      this.weeks.forEach(weekEl => {
        weekEl.innerHTML = "";
        ID_DAYS_MIN.forEach((d) => {
          const w = document.createElement("div");
          w.className = "dp-weekday";
          w.textContent = d;
          weekEl.appendChild(w);
        });
      });

      this.render();
    }

    bind() {
      this.input.addEventListener("click", () => this.open());
      
      this.el.querySelector('[data-nav="prev"]').addEventListener("click", () => this.addMonths(-1));
      this.el.querySelector('[data-nav="next"]').addEventListener("click", () => this.addMonths(1));
      
      this.modeBtns.forEach(btn => {
        btn.addEventListener("click", (e) => {
          const mode = e.target.getAttribute("data-mode");
          this.setMode(mode);
        });
      });
      
      this.el.querySelector(".clear-btn").addEventListener("click", () => this.clearDates());
      this.el.querySelector(".apply-btn").addEventListener("click", () => this.applyDates());
      
      document.addEventListener("mousedown", (e) => {
        if (this.isOpen && !this.el.contains(e.target) && e.target !== this.input) {
          this.close();
        }
      });
    }

    position() {
      const r = this.input.getBoundingClientRect();
      const top = r.bottom + window.scrollY + 6;
      const left = Math.min(
        r.left + window.scrollX,
        window.scrollX + window.innerWidth - this.el.offsetWidth - 8
      );
      this.el.style.top = top + "px";
      this.el.style.left = left + "px";
    }

    open() {
      if (this.isOpen) return;
      
      // Parse current input value
      const dates = this.input.value.split(" - ");
      if (dates[0]) {
        const checkin = parseDDMMYYYY(dates[0]);
        if (checkin) {
          checkinDate = checkin;
          this.viewDate = new Date(checkin.getFullYear(), checkin.getMonth(), 1);
        }
      }
      if (dates[1]) {
        const checkout = parseDDMMYYYY(dates[1]);
        if (checkout) {
          checkoutDate = checkout;
          selectingCheckin = false;
          this.setMode("checkout");
        }
      }
      
      this.render();
      this.el.classList.add("open");
      this.isOpen = true;
      this.position();
    }

    close() {
      this.el.classList.remove("open");
      this.isOpen = false;
    }

    setMode(mode) {
      this.modeBtns.forEach(btn => {
        btn.classList.remove("active");
        if (btn.getAttribute("data-mode") === mode) {
          btn.classList.add("active");
        }
      });
      selectingCheckin = mode === "checkin";
    }

    addMonths(n) {
      const y = this.viewDate.getFullYear();
      const m = this.viewDate.getMonth();
      this.viewDate = new Date(y, m + n, 1);
      this.render();
    }

    render() {
      const y = this.viewDate.getFullYear();
      const m = this.viewDate.getMonth();
      
      // Set titles
      this.title1.textContent = `${ID_MONTHS[m]} ${y}`;
      const nextMonth = new Date(y, m + 1, 1);
      this.title2.textContent = `${ID_MONTHS[nextMonth.getMonth()]} ${nextMonth.getFullYear()}`;
      
      // Render first calendar
      this.renderCalendar(this.days1, y, m);
      
      // Render second calendar
      this.renderCalendar(this.days2, y, m + 1);
    }

    renderCalendar(daysEl, year, month) {
      daysEl.innerHTML = "";
      
      const firstOfMonth = new Date(year, month, 1);
      let startIdx = firstOfMonth.getDay();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const daysPrevMonth = new Date(year, month, 0).getDate();
      
      const today = new Date();
      const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());

      // Previous month days
      for (let i = startIdx; i > 0; i--) {
        const date = new Date(year, month - 1, daysPrevMonth - i + 1);
        daysEl.appendChild(this.makeDay(date, true, year, month));
      }
      
      // Current month days
      for (let d = 1; d <= daysInMonth; d++) {
        const date = new Date(year, month, d);
        daysEl.appendChild(this.makeDay(date, false, year, month));
      }
      
      // Next month days
      const totalCells = 42; // 6 weeks * 7 days
      const currentCells = daysEl.children.length;
      for (let i = 1; i <= totalCells - currentCells; i++) {
        const date = new Date(year, month + 1, i);
        daysEl.appendChild(this.makeDay(date, true, year, month));
      }
    }

    makeDay(date, isOut, calendarYear, calendarMonth) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "dp-day" + (isOut ? " out" : "");
      btn.textContent = date.getDate();
      btn.setAttribute("data-date", date.toISOString().split('T')[0]);

      const today = new Date();
      const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

      let isDisabled = false;

      // Disable past dates
      if (date < todayDate) {
        isDisabled = true;
        btn.classList.add("disabled");
      }

      // Check if booked
      const isBooked = bookedDates.has(dateString);
      if (isBooked) {
        isDisabled = true;
        btn.classList.add("booked");
      }

      // Today's date
      if (date.getTime() === todayDate.getTime()) {
        btn.classList.add("today");
      }

      // Check if selected as check-in
      if (checkinDate && date.getTime() === checkinDate.getTime()) {
        btn.classList.add("selected", "checkin");
      }

      // Check if selected as check-out
      if (checkoutDate && date.getTime() === checkoutDate.getTime()) {
        btn.classList.add("selected", "checkout");
      }

      // Check if in range between check-in and check-out
      if (checkinDate && checkoutDate && date > checkinDate && date < checkoutDate) {
        btn.classList.add("in-range");
      }

      // Check if valid for check-out (only if checkin is selected and this date is after checkin)
      if (checkinDate && !checkoutDate && date > checkinDate && !isBooked) {
        btn.classList.add("checkout-valid");
      }

      // Check high season
      const isHighSeason = typeof highSeasons !== 'undefined' && highSeasons.find(season => {
        const seasonDate = new Date(season.tanggal);
        return seasonDate.getFullYear() === date.getFullYear() &&
               seasonDate.getMonth() === date.getMonth() &&
               seasonDate.getDate() === date.getDate();
      });
      if (isHighSeason) {
        btn.classList.add("high-season");
      }

      // Weekend styling
      if (date.getDay() === 0 || date.getDay() === 6) {
        btn.classList.add("weekend");
      }

      btn.disabled = isDisabled;

      btn.addEventListener("click", () => {
        if (!btn.disabled) {
          this.selectDate(date);
        }
      });

      return btn;
    }

    selectDate(date) {
      if (selectingCheckin) {
        // If selecting check-in and date is after current check-out, clear check-out
        if (checkoutDate && date >= checkoutDate) {
          checkoutDate = null;
        }
        checkinDate = date;
        selectingCheckin = false;
        this.setMode("checkout");
      } else {
        // Selecting check-out
        if (!checkinDate) {
          checkinDate = date;
          selectingCheckin = true;
          this.setMode("checkin");
        } else if (date > checkinDate) {
          checkoutDate = date;
        } else {
          // If selected date is before check-in, swap them
          checkoutDate = checkinDate;
          checkinDate = date;
        }
      }
      
      this.render();
    }

    clearDates() {
      checkinDate = null;
      checkoutDate = null;
      selectingCheckin = true;
      this.setMode("checkin");
      this.input.value = "";
      this.render();
    }

    applyDates() {
      if (checkinDate) {
        let dateString = formatDDMMYYYY(checkinDate);
        if (checkoutDate) {
          dateString += " - " + formatDDMMYYYY(checkoutDate);
        }
        this.input.value = dateString;
      }
      this.close();
    }
  }

  document.querySelectorAll('.datepicker-input').forEach(input => {
    new Datepicker(input);
  });
})();