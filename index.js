import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import app from express();
dotenv.config();

app.use(cors());
app.use(express.json());

const MAPBOX_SECRET_KEY = process.env.MAPBOX_SECRET_KEY; // Read secret key from environment
	if (!MAPBOX_SECRET_KEY) {
  throw new Error('MAPBOX_SECRET_KEY is not defined in the environment variables.');
}


app.post('/get-route', async (req, res) => {
  const { userLocation } = req.body;
  const businessCoords = [39.6618797, -79.9539762];

  // Validate user location
  if (!Array.isArray(userLocation) || userLocation.length !== 2 ||
      typeof userLocation[0] !== 'number' || typeof userLocation[1] !== 'number' ||
      userLocation[0] < -90 || userLocation[0] > 90 ||
      userLocation[1] < -180 || userLocation[1] > 180) {
    return res.status(400).send({ error: 'Invalid user location' });
  }

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
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
