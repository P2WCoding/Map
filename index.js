let map; // Global map variable

document.getElementById('useLocation').addEventListener('click', () => {
  console.log('Button clicked'); // Debugging log
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log('User location:', latitude, longitude); // Debugging log

        // Check if map exists and remove it
        if (map) {
          map.remove();
          console.log('Old map removed');
        }

        // Initialize the map
        map = L.map('map').setView([latitude, longitude], 13);
        console.log('Map initialized at:', latitude, longitude); // Debugging log

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '© OpenStreetMap contributors',
        }).addTo(map);

        // Add a marker for user's location
        L.marker([latitude, longitude])
          .addTo(map)
          .bindPopup('You are here!')
          .openPopup();
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