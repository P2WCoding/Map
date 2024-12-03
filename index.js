const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors()); // Allow requests from any origin (or specify your domain for security)
app.use(express.json());

const MAPBOX_SECRET_KEY = process.env.MAPBOX_SECRET_KEY; // Read secret key from environment variable

app.post('/get-route', async (req, res) => {
  const { userLocation } = req.body;
  const businessCoords = [39.6618797, -79.9539762];

  try {
    const response = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/driving/${userLocation[1]},${userLocation[0]};${businessCoords[1]},${businessCoords[0]}?access_token=${MAPBOX_SECRET_KEY}`
    );

    if (!response.ok) {
      throw new Error(`Mapbox API error: ${response.statusText}`);
    }

    const routeData = await response.json();
    res.status(200).json(routeData);
  } catch (error) {
    console.error('Error fetching route:', error);
    res.status(500).send({ error: 'Failed to get route' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
