// =================================================================================
// MAIN SCRIPT FILE
// =================================================================================

// ---------------------------------------------------------------------------------
// A. EVENT LISTENERS THAT RUN ONCE THE DOM IS FULLY LOADED
// ---------------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function() {

    // 1. Animasi Masuk Halaman (Page Load Animation)
    document.body.style.opacity = "0";
    document.body.style.transition = "opacity 0.6s ease-in-out";
    setTimeout(() => { document.body.style.opacity = "1"; }, 100);

    // 2. Observer untuk Animasi Scroll (Fade In Up)
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in-up').forEach(el => {
        el.style.opacity = "0";
        el.style.transform = "translateY(30px)";
        el.style.transition = "all 0.8s cubic-bezier(0.165, 0.84, 0.44, 1)";
        observer.observe(el);
    });
    
    // 3. Simple Capacity Control JavaScript (for index.html search)
    const capacityControl = document.querySelector('.capacity-control');
    if (capacityControl) {
        const minusBtn = capacityControl.querySelector('.capacity-btn.minus');
        const plusBtn = capacityControl.querySelector('.capacity-btn.plus');
        const capacityInput = capacityControl.querySelector('.capacity-input');
        const searchBtn = document.querySelector('.search-btn');
        
        const MIN_CAPACITY = 1;
        const MAX_CAPACITY = 20;
        
        const updateCapacity = () => {
            const value = parseInt(capacityInput.value);
            minusBtn.disabled = value <= MIN_CAPACITY;
            plusBtn.disabled = value >= MAX_CAPACITY;
            if (value >= MIN_CAPACITY && value <= MAX_CAPACITY) {
                capacityControl.classList.remove('invalid');
                capacityControl.classList.add('valid');
            } else {
                capacityControl.classList.add('invalid');
                capacityControl.classList.remove('valid');
            }
        };

        const animateChange = () => {
            capacityInput.classList.add('changed');
            setTimeout(() => capacityInput.classList.remove('changed'), 300);
        };

        minusBtn.addEventListener('click', () => {
            let currentValue = parseInt(capacityInput.value);
            if (currentValue > MIN_CAPACITY) {
                capacityInput.value = currentValue - 1;
                updateCapacity();
                animateChange();
            }
        });
        
        plusBtn.addEventListener('click', () => {
            let currentValue = parseInt(capacityInput.value);
            if (currentValue < MAX_CAPACITY) {
                capacityInput.value = currentValue + 1;
                updateCapacity();
                animateChange();
            }
        });
        
        capacityInput.addEventListener('change', () => {
            let value = parseInt(capacityInput.value);
            if (value < MIN_CAPACITY) capacityInput.value = MIN_CAPACITY;
            else if (value > MAX_CAPACITY) capacityInput.value = MAX_CAPACITY;
            updateCapacity();
            animateChange();
        });
        
        capacityInput.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowUp') { e.preventDefault(); plusBtn.click(); } 
            else if (e.key === 'ArrowDown') { e.preventDefault(); minusBtn.click(); }
        });
        
        const validateSearch = () => {
            const location = document.getElementById('locationSelect').value.trim();
            const checkin = document.getElementById('checkin').value.trim();
            const capacity = parseInt(capacityInput.value);
            const customSelect = document.querySelector('.custom-select');
    
            let isValid = true;
            
            if (customSelect) customSelect.classList.remove('invalid');
            if (document.getElementById('checkin')) document.getElementById('checkin').classList.remove('invalid');
            capacityControl.classList.remove('invalid');
            
            if (!location || location === "") { 
                if (customSelect) customSelect.classList.add('invalid');
                isValid = false;
            }
            if (!checkin) {
                if (document.getElementById('checkin')) document.getElementById('checkin').classList.add('invalid');
                isValid = false;
            }
            if (isNaN(capacity) || capacity < MIN_CAPACITY || capacity > MAX_CAPACITY) {
                capacityControl.classList.add('invalid');
                isValid = false;
            }
            return isValid;
        };

        if (searchBtn) {
            searchBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (validateSearch()) {
                    const originalHTML = searchBtn.innerHTML;
                    searchBtn.innerHTML = '<div class="loading-spinner"></div>';
                    searchBtn.disabled = true;
                    
                    const searchData = {
                        location: document.getElementById('locationSelect').value.trim(),
                        checkin: document.getElementById('checkin').value.trim(),
                        capacity: parseInt(capacityInput.value)
                    };
                    
                    setTimeout(() => {
                        const params = new URLSearchParams();
                        if (searchData.location) params.append('location', searchData.location);
                        if (searchData.checkin) params.append('checkin', searchData.checkin);
                        if (searchData.capacity) params.append('capacity', searchData.capacity);
                        
                        searchBtn.innerHTML = originalHTML;
                        searchBtn.disabled = false;
                        window.location.href = `explore.html?${params.toString()}`;
                    }, 800);
                }
            });
        }
        updateCapacity();
    }

    // 4. Newsletter form submission
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        const emailInput = newsletterForm.querySelector('input[type="email"]');
        const submitBtn = newsletterForm.querySelector('.btn-primary');

        const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

        const showToast = (message, type = 'success') => {
            const toast = document.createElement('div');
            toast.className = `toast ${type}`;
            toast.textContent = message;
            document.body.appendChild(toast);
            
            setTimeout(() => toast.classList.add('show'), 10);
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => document.body.removeChild(toast), 300);
            }, 4000);
        };

        const toastStyles = document.createElement('style');
        toastStyles.textContent = `
            .toast {
                position: fixed; bottom: 30px; right: 30px;
                background: var(--primary); color: white;
                padding: 15px 25px; border-radius: 12px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                transform: translateY(100px); opacity: 0;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                z-index: 10000; max-width: 350px;
                font-family: 'Outfit', sans-serif;
                border-left: 4px solid var(--accent);
            }
            .toast.show { transform: translateY(0); opacity: 1; }
            .toast.error { background: #ef4444; border-left-color: #dc2626; }
            .toast.success { background: #10b981; border-left-color: #059669; }
            @media (max-width: 768px) {
                .toast { bottom: 20px; right: 20px; left: 20px; max-width: none; }
            }
        `;
        document.head.appendChild(toastStyles);

        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const originalText = submitBtn.textContent;
            
            if (!validateEmail(emailInput.value)) {
                showToast('Please enter a valid email address', 'error');
                return;
            }
            
            submitBtn.textContent = 'Subscribing...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                showToast('Successfully subscribed to newsletter!', 'success');
                emailInput.value = '';
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1500);
        });
    }

    // 5. Custom Select Dropdown Logic
    const selectWrapper = document.querySelector('.custom-select-wrapper');
    if (selectWrapper) {
        const trigger = selectWrapper.querySelector('.custom-select-trigger');
        const customSelect = selectWrapper.querySelector('.custom-select');
        const options = selectWrapper.querySelectorAll('.custom-option');
        const nativeSelect = selectWrapper.querySelector('#locationSelect');
        const triggerSpan = trigger.querySelector('span');

        trigger.addEventListener('click', () => customSelect.classList.toggle('open'));

        options.forEach(option => {
            option.addEventListener('click', function() {
                if (!customSelect.classList.contains('open')) return;
                nativeSelect.value = this.dataset.value;
                triggerSpan.textContent = this.textContent;
                options.forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');
                customSelect.classList.remove('open');
                nativeSelect.dispatchEvent(new Event('change'));
            });
        });

        window.addEventListener('click', (e) => {
            if (!customSelect.contains(e.target)) {
                customSelect.classList.remove('open');
            }
        });
    }

    // 6. Guest Selector Logic (for detail.html)
    const bookingCard = document.querySelector('.booking-card');
    if (bookingCard) {
        const minusBtn = bookingCard.querySelector('.guest-btn.minus');
        const plusBtn = bookingCard.querySelector('.guest-btn.plus');
        const guestCountSpan = bookingCard.querySelector('.guest-count');
        
        if (minusBtn && plusBtn && guestCountSpan) {
            const MIN_GUESTS = 1;
            const MAX_GUESTS = 10;

            const updateButtons = (count) => {
                minusBtn.disabled = count <= MIN_GUESTS;
                plusBtn.disabled = count >= MAX_GUESTS;
            };

            minusBtn.addEventListener('click', () => {
                let currentCount = parseInt(guestCountSpan.textContent);
                if (currentCount > MIN_GUESTS) {
                    currentCount--;
                    guestCountSpan.textContent = currentCount;
                    updateButtons(currentCount);
                }
            });

            plusBtn.addEventListener('click', () => {
                let currentCount = parseInt(guestCountSpan.textContent);
                if (currentCount < MAX_GUESTS) {
                    currentCount++;
                    guestCountSpan.textContent = currentCount;
                    updateButtons(currentCount);
                }
            });

            updateButtons(parseInt(guestCountSpan.textContent));
        }
    }

    // 7. Galeri Foto Interaktif (Untuk detail.html)
    const galleryImages = document.querySelectorAll('.hero-gallery img');
    if (galleryImages.length > 0) {
        galleryImages.forEach(img => {
            img.addEventListener('click', () => {
                const mainImg = document.querySelector('.main-img');
                if (!mainImg || mainImg === img) return; // Jangan lakukan apa-apa jika main-img diklik

                const clickedSrc = img.src;
                // Simpan src main-img sebelum ditukar
                const mainImgSrc = mainImg.src;

                // Tukar src
                mainImg.src = clickedSrc;
                img.src = mainImgSrc;

                // Efek flash
                mainImg.style.opacity = "0.5";
                setTimeout(() => mainImg.style.opacity = "1", 200);
            });
        });
    }

    // --- Carousel Logic (for detail.html) ---
    const carousel = document.querySelector('.carousel-container');
    if (carousel) {
        const track = carousel.querySelector('.carousel-track');
        const slides = Array.from(track.children);
        const nextButton = carousel.querySelector('.carousel-button--right');
        const prevButton = carousel.querySelector('.carousel-button--left');
        const dotsNav = carousel.querySelector('.carousel-nav');
        const dots = Array.from(dotsNav.children);

        const moveToSlide = (currentSlide, targetSlide) => {
            currentSlide.classList.remove('current-slide');
            targetSlide.classList.add('current-slide');
        };

        const updateDots = (currentDot, targetDot) => {
            currentDot.classList.remove('current-slide');
            targetDot.classList.add('current-slide');
        }

        const updateArrows = (targetIndex) => {
            if (targetIndex === 0) {
                prevButton.classList.add('is-hidden');
                nextButton.classList.remove('is-hidden');
            } else if (targetIndex === slides.length - 1) {
                prevButton.classList.remove('is-hidden');
                nextButton.classList.add('is-hidden');
            } else {
                prevButton.classList.remove('is-hidden');
                nextButton.classList.remove('is-hidden');
            }
        }

        // When I click left, move slides to the left
        prevButton.addEventListener('click', e => {
            const currentSlide = track.querySelector('.current-slide');
            const prevSlide = currentSlide.previousElementSibling;
            const currentDot = dotsNav.querySelector('.current-slide');
            const prevDot = currentDot.previousElementSibling;
            const prevIndex = slides.findIndex(slide => slide === prevSlide);

            moveToSlide(currentSlide, prevSlide);
            updateDots(currentDot, prevDot);
            updateArrows(prevIndex);
        });

        // When I click right, move slides to the right
        nextButton.addEventListener('click', e => {
            const currentSlide = track.querySelector('.current-slide');
            const nextSlide = currentSlide.nextElementSibling;
            const currentDot = dotsNav.querySelector('.current-slide');
            const nextDot = currentDot.nextElementSibling;
            const nextIndex = slides.findIndex(slide => slide === nextSlide);

            moveToSlide(currentSlide, nextSlide);
            updateDots(currentDot, nextDot);
            updateArrows(nextIndex);
        });

        // When I click the nav indicators, move to that slide
        dotsNav.addEventListener('click', e => {
            const targetDot = e.target.closest('button');
            if (!targetDot) return;

            const currentSlide = track.querySelector('.current-slide');
            const currentDot = dotsNav.querySelector('.current-slide');
            const targetIndex = dots.findIndex(dot => dot === targetDot);
            const targetSlide = slides[targetIndex];

            moveToSlide(currentSlide, targetSlide);
            updateDots(currentDot, targetDot);
            updateArrows(targetIndex);
        });
    }

    // --- Mobile Menu Toggle ---
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('nav');
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('menu-open');
        });
    }

    // --- Category Tabs Toggle ---
    const categoryTabs = document.querySelectorAll('.category-tab');
    if (categoryTabs.length > 0) {
        categoryTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                categoryTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
            });
        });
    }

    // --- Wishlist Button Toggle ---
    const wishlistButtons = document.querySelectorAll('.card-wishlist');
    if (wishlistButtons.length > 0) {
        wishlistButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                btn.classList.toggle('active');
                const icon = btn.querySelector('i');
                if (btn.classList.contains('active')) {
                    icon.classList.remove('far');
                    icon.classList.add('fas');
                } else {
                    icon.classList.remove('fas');
                    icon.classList.add('far');
                }
            });
        });
    }

    // --- Filters Toggle Logic (for explore.html) ---
    const filtersToggleBtn = document.querySelector('.filters-toggle-btn');
    const filtersAside = document.querySelector('.filters');
    if (filtersToggleBtn && filtersAside) {
        filtersToggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('filters-open');
        });

        // Close filters when clicking outside
        document.addEventListener('click', (e) => {
            if (!filtersAside.contains(e.target) && !filtersToggleBtn.contains(e.target) && document.body.classList.contains('filters-open')) {
                document.body.classList.remove('filters-open');
            }
        });
    }

    // --- Detail Page Map Logic ---
    const detailMapContainer = document.getElementById('detail-map');
    if (detailMapContainer) {
        // Placeholder coordinates, you can replace these with actual data
        const lat = -6.6425;
        const lon = 106.834;

        const map = L.map('detail-map').setView([lat, lon], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        L.marker([lat, lon]).addTo(map)
            .bindPopup('The approximate location of The Forest Haven.')
            .openPopup();
    }
});


// ---------------------------------------------------------------------------------
// B. EVENT LISTENERS THAT CAN RUN IMMEDIATELY
// ---------------------------------------------------------------------------------

// Efek Navbar Saat Scroll
window.addEventListener('scroll', () => {
    const nav = document.getElementById('mainNav');
    if (!nav) return;

    if (window.scrollY > 30) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});
