document.addEventListener('DOMContentLoaded', () => {
    const showMapBtn = document.getElementById('show-map-btn');
    const closeMapBtn = document.getElementById('close-map-btn');
    const mapOverlay = document.getElementById('map-overlay');
    const mapContainer = document.getElementById('map');

    if (!mapContainer || !showMapBtn || !closeMapBtn || !mapOverlay) return;

    let mapInitialized = false;
    let map;

    const initMap = () => {
        if (mapInitialized) return;

        map = L.map('map').setView([-6.89, 107.61], 9); // Centered around Bandung

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        const listings = document.querySelectorAll('.results .card');
        
        listings.forEach(listing => {
            const lat = listing.dataset.lat;
            const lon = listing.dataset.lon;
            const title = listing.querySelector('h3').textContent;

            if (lat && lon) {
                const marker = L.marker([lat, lon]).addTo(map);
                marker.bindPopup(`<strong>${title}</strong>`);

                listing.addEventListener('mouseover', () => {
                    // Find the corresponding marker and open its popup
                    marker.openPopup();
                });

                 listing.addEventListener('mouseout', () => {
                    marker.closePopup();
                });
            }
        });
        mapInitialized = true;
    };

    showMapBtn.addEventListener('click', () => {
        mapOverlay.classList.add('active');
        // Initialize map only when it's first opened
        initMap();
        // Adjust map size every time it's opened
        setTimeout(() => map.invalidateSize(), 10); 
    });

    closeMapBtn.addEventListener('click', () => {
        mapOverlay.classList.remove('active');
    });

    // Optional: Close map when clicking the overlay background
    mapOverlay.addEventListener('click', (e) => {
        if (e.target === mapOverlay) {
            mapOverlay.classList.remove('active');
        }
    });
});