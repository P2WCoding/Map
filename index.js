document.getElementById('useLocation').addEventListener('click', () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        fetch('https://map-ec27.onrender.com/get-route', { // Backend URL
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userLocation: [latitude, longitude] }),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log('Route data:', data);
            // Use Leaflet to display the route
            const map = L.map('map').setView([latitude, longitude], 13);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              maxZoom: 19,
              attribution: '© OpenStreetMap contributors',
            }).addTo(map);

            const waypoints = [
              L.latLng(latitude, longitude),
              L.latLng(39.6618797, -79.9539762),
            ];

            L.Routing.control({
              waypoints,
              routeWhileDragging: true,
            }).addTo(map);
          })
          .catch((error) => console.error('Error fetching route:', error));
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