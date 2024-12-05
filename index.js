let map; // Declare the map variable globally

document.getElementById('useLocation').addEventListener('click', () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        // If the map already exists, remove it before reinitializing
        if (map) {
          map.remove(); // Clear the previous map instance
        }

        // Initialize the map
        map = L.map('map').setView([latitude, longitude], 13);

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '© OpenStreetMap contributors',
        }).addTo(map);

        // Fetch route data
        fetch('https://map-ec27.onrender.com/get-route', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userLocation: [latitude, longitude] }),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log('Route data:', data);

            // Add routing to the map using waypoints
            const waypoints = data.routes[0].geometry.coordinates.map(([lng, lat]) =>
              L.latLng(lat, lng)
            );

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