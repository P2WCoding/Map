const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const MAPBOX_SECRET_KEY = process.env.MAPBOX_SECRET_KEY;

if (!MAPBOX_SECRET_KEY) {
  throw new Error('MAPBOX_SECRET_KEY is not defined in the environment variables.');
}

app.use(cors({ origin: 'https://p2wcoding.github.io' })); // Update to your actual domain
app.use(express.json());

app.post('/get-route', async (req, res) => {
  const { userLocation } = req.body;
  const businessCoords = [39.6618797, -79.9539762];

  if (
    !Array.isArray(userLocation) ||
    userLocation.length !== 2 ||
    typeof userLocation[0] !== 'number' ||
    typeof userLocation[1] !== 'number' ||
    userLocation[0] < -90 ||
    userLocation[0] > 90 ||
    userLocation[1] < -180 ||
    userLocation[1] > 180
  ) {
    return res.status(400).send({ error: 'Invalid user location' });
  }

  try {
    const response = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/driving/${userLocation[1]},${userLocation[0]};${businessCoords[1]},${businessCoords[0]}?access_token=${MAPBOX_SECRET_KEY}`
    );

    if (!response.ok) {
      console.error(`Mapbox API error: ${response.status} ${response.statusText}`);
      throw new Error('Failed to fetch route from Mapbox API');
    }

    const routeData = await response.json();
    res.status(200).json(routeData);
  } catch (error) {
    console.error('Error fetching route:', error);
    res.status(500).send({ error: 'Failed to get route. Please try again later.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});