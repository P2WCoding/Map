let map; // Declare map globally to track its state

document.getElementById('useLocation').addEventListener('click', () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        // Check if the map is already initialized and remove it
        if (map) {
          map.remove(); // Clear the existing map instance
        }

        // Initialize the map
        map = L.map('map').setView([latitude, longitude], 13);

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '© OpenStreetMap contributors',
        }).addTo(map);

        // Fetch route data from the backend
        fetch('https://map-ec27.onrender.com/get-route', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userLocation: [latitude, longitude] }),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log('Route data:', data);

            // Use waypoints to draw the route
            const waypoints = [
              L.latLng(latitude, longitude),
              L.latLng(39.6618797, -79.9539762), // Example destination (update as needed)
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