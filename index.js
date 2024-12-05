let map;

document.getElementById('useLocation').addEventListener('click', () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        // If the map already exists, remove it before creating a new one
        if (map) {
          map.remove(); // Clear the map instance
        }

        // Initialize the map
        map = L.map('map').setView([latitude, longitude], 13);

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '© OpenStreetMap contributors',
        }).addTo(map);

        // Optionally add a marker to the map
        L.marker([latitude, longitude]).addTo(map).bindPopup('You are here!').openPopup();
      },
      (error) => {
        console.error('Geolocation error:', error);
        alert('Unable to retrieve location. Please enable location services.');
      }
    );
  } else {
    alert('Geolocation is not supported by your browser.');
  }
});
