document.addEventListener('DOMContentLoaded', function () {
    const priceSlider = document.getElementById('price-slider');

    if (priceSlider) {
        const priceLower = document.getElementById('price-lower');
        const priceUpper = document.getElementById('price-upper');

        noUiSlider.create(priceSlider, {
            start: [800000, 2500000],
            connect: true,
            step: 100000,
            range: {
                'min': 500000,
                'max': 5000000
            },
            format: {
                to: function (value) {
                    return 'Rp ' + Math.round(value).toLocaleString('id-ID');
                },
                from: function (value) {
                    return Number(value.replace('Rp ', '').replace(/\./g, ''));
                }
            }
        });

        priceSlider.noUiSlider.on('update', function (values, handle) {
            if (handle === 0) {
                priceLower.innerHTML = values[handle];
            } else {
                priceUpper.innerHTML = values[handle];
            }
        });
    }

    const filtersToggleBtn = document.querySelector('.filters-toggle-btn');
    const mobileFilterOverlay = document.getElementById('mobile-filter-overlay');
    const closeFilterBtn = document.getElementById('close-filter-btn');
    const applyFiltersBtn = document.querySelector('.apply-filters');

    if (filtersToggleBtn && mobileFilterOverlay && closeFilterBtn) {
        filtersToggleBtn.addEventListener('click', () => {
            mobileFilterOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        const closeFilters = () => {
            mobileFilterOverlay.classList.remove('active');
            document.body.style.overflow = '';
        };

        closeFilterBtn.addEventListener('click', closeFilters);
        
        if (applyFiltersBtn) {
            applyFiltersBtn.addEventListener('click', closeFilters);
        }
    }
});
