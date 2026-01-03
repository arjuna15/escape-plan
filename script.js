// 1. Animasi Masuk Halaman (Page Load Animation)
document.addEventListener("DOMContentLoaded", () => {
    document.body.style.opacity = "0";
    document.body.style.transition = "opacity 0.6s ease-in-out";
    
    setTimeout(() => {
        document.body.style.opacity = "1";
    }, 100);
});

// 2. Efek Navbar Saat Scroll
window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    if (window.scrollY > 50) {
        nav.classList.add('solid-nav');
        nav.classList.remove('glass-nav');
        nav.style.padding = "10px 5%";
    } else {
        if(document.title.includes("Nature First")) { // Hanya untuk Home
            nav.classList.add('glass-nav');
            nav.classList.remove('solid-nav');
            nav.style.padding = "15px 5%";
        }
    }
});

// 3. Galeri Foto Interaktif (Untuk detail.html)
const galleryImages = document.querySelectorAll('.hero-gallery img');
if (galleryImages.length > 0) {
    galleryImages.forEach(img => {
        img.addEventListener('click', () => {
            // Sederhananya kita tukar foto kecil ke foto utama
            const mainImg = document.querySelector('.main-img');
            const clickedSrc = img.src;
            img.src = mainImg.src;
            mainImg.src = clickedSrc;
            
            // Tambahkan efek flash sedikit
            mainImg.style.opacity = "0.5";
            setTimeout(() => mainImg.style.opacity = "1", 100);
        });
    });
}

// 4. Kalkulator Harga Sederhana (Untuk booking.html)
const nameInput = document.querySelector('input[placeholder="Your name"]');
if (nameInput) {
    nameInput.addEventListener('input', (e) => {
        // Efek interaktif saat mengetik nama
        console.log("Typing name: ", e.target.value);
    });
}

// 5. Observer untuk Animasi Scroll (Fade In Up)
const observerOptions = {
    threshold: 0.1
};

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

// Simple Capacity Control JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const minusBtn = document.querySelector('.capacity-btn.minus');
    const plusBtn = document.querySelector('.capacity-btn.plus');
    const capacityInput = document.querySelector('.capacity-input');
    const capacityControl = document.querySelector('.capacity-control');
    const searchBtn = document.querySelector('.search-btn');
    
    // Minimum and maximum values
    const MIN_CAPACITY = 1;
    const MAX_CAPACITY = 20;
    
    // Decrease capacity
    minusBtn.addEventListener('click', function() {
        let currentValue = parseInt(capacityInput.value);
        if (currentValue > MIN_CAPACITY) {
            capacityInput.value = currentValue - 1;
            updateCapacity();
            animateChange();
        }
    });
    
    // Increase capacity
    plusBtn.addEventListener('click', function() {
        let currentValue = parseInt(capacityInput.value);
        if (currentValue < MAX_CAPACITY) {
            capacityInput.value = currentValue + 1;
            updateCapacity();
            animateChange();
        }
    });
    
    // Direct input
    capacityInput.addEventListener('change', function() {
        let value = parseInt(this.value);
        
        // Validate range
        if (value < MIN_CAPACITY) {
            this.value = MIN_CAPACITY;
        } else if (value > MAX_CAPACITY) {
            this.value = MAX_CAPACITY;
        }
        
        updateCapacity();
        animateChange();
    });
    
    // Keyboard shortcuts
    capacityInput.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            plusBtn.click();
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            minusBtn.click();
        }
    });
    
    // Update button states and validation
    function updateCapacity() {
        const value = parseInt(capacityInput.value);
        
        // Update button states
        minusBtn.disabled = value <= MIN_CAPACITY;
        plusBtn.disabled = value >= MAX_CAPACITY;
        
        // Update validation
        if (value >= MIN_CAPACITY && value <= MAX_CAPACITY) {
            capacityControl.classList.remove('invalid');
            capacityControl.classList.add('valid');
        } else {
            capacityControl.classList.add('invalid');
            capacityControl.classList.remove('valid');
        }
    }
    
    // Animate value change
    function animateChange() {
        capacityInput.classList.add('changed');
        setTimeout(() => {
            capacityInput.classList.remove('changed');
        }, 300);
    }
    
    // Search button functionality with capacity
    searchBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        if (validateSearch()) {
            // Show loading state
            const originalHTML = this.innerHTML;
            this.innerHTML = '<div class="loading-spinner"></div>';
            this.disabled = true;
            
            // Get capacity value
            const capacity = parseInt(capacityInput.value);
            
            // Prepare search data
            const searchData = {
                location: document.getElementById('locationInput').value.trim(),
                checkin: document.getElementById('checkin').value.trim(),
                capacity: capacity
            };
            
            // Simulate API call
            setTimeout(() => {
                // Navigate to explore page with parameters
                const params = new URLSearchParams();
                if (searchData.location) params.append('location', searchData.location);
                if (searchData.checkin) params.append('checkin', searchData.checkin);
                if (searchData.capacity) params.append('capacity', searchData.capacity);
                
                // Reset button state
                this.innerHTML = originalHTML;
                this.disabled = false;
                
                // Navigate
                window.location.href = `explore.html?${params.toString()}`;
            }, 800);
        }
    });
    
    // Validate all search inputs
    function validateSearch() {
        const location = document.getElementById('locationInput').value.trim();
        const checkin = document.getElementById('checkin').value.trim();
        const capacity = parseInt(capacityInput.value);
        
        let isValid = true;
        
        // Reset all validations
        document.getElementById('locationInput').classList.remove('invalid');
        document.getElementById('checkin').classList.remove('invalid');
        capacityControl.classList.remove('invalid');
        
        // Validate location
        if (!location) {
            document.getElementById('locationInput').classList.add('invalid');
            isValid = false;
        }
        
        // Validate date
        if (!checkin) {
            document.getElementById('checkin').classList.add('invalid');
            isValid = false;
        }
        
        // Validate capacity
        if (capacity < MIN_CAPACITY || capacity > MAX_CAPACITY) {
            capacityControl.classList.add('invalid');
            isValid = false;
        }
        
        return isValid;
    }
    
    // Initialize
    updateCapacity();
    
    // Add touch events for mobile
    let touchStartY = 0;
    
    capacityInput.addEventListener('touchstart', function(e) {
        touchStartY = e.touches[0].clientY;
    });
    
    capacityInput.addEventListener('touchmove', function(e) {
        if (!this.disabled) {
            const touchEndY = e.touches[0].clientY;
            const deltaY = touchStartY - touchEndY;
            
            // Swipe up to increase, down to decrease
            if (Math.abs(deltaY) > 30) { // Threshold for swipe
                if (deltaY > 0) {
                    // Swipe up - increase
                    plusBtn.click();
                } else {
                    // Swipe down - decrease
                    minusBtn.click();
                }
                touchStartY = touchEndY;
            }
        }
    });
    
    // Prevent keyboard from zooming on mobile
    capacityInput.addEventListener('focus', function() {
        if (window.innerWidth <= 768) {
            setTimeout(() => {
                this.blur();
            }, 100);
        }
    });
});

// Newsletter form submission
document.addEventListener('DOMContentLoaded', function() {
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const submitBtn = this.querySelector('.btn-primary');
            const originalText = submitBtn.textContent;
            
            if (!validateEmail(emailInput.value)) {
                showToast('Please enter a valid email address', 'error');
                return;
            }
            
            // Show loading state
            submitBtn.textContent = 'Subscribing...';
            submitBtn.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                showToast('Successfully subscribed to newsletter!', 'success');
                emailInput.value = '';
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1500);
        });
    }
    
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    function showToast(message, type = 'success') {
        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        
        // Add to document
        document.body.appendChild(toast);
        
        // Show toast
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        // Remove after 4 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 4000);
    }
    
    // Add CSS for toast
    const toastStyles = document.createElement('style');
    toastStyles.textContent = `
        .toast {
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: var(--color-primary);
            color: white;
            padding: 15px 25px;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            transform: translateY(100px);
            opacity: 0;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            z-index: 10000;
            max-width: 350px;
            font-family: 'Outfit', sans-serif;
            border-left: 4px solid var(--color-secondary);
        }
        
        .toast.show {
            transform: translateY(0);
            opacity: 1;
        }
        
        .toast.error {
            background: #ef4444;
            border-left-color: #dc2626;
        }
        
        .toast.success {
            background: #10b981;
            border-left-color: #059669;
        }
        
        @media (max-width: 768px) {
            .toast {
                bottom: 20px;
                right: 20px;
                left: 20px;
                max-width: none;
            }
        }
    `;
    document.head.appendChild(toastStyles);
});