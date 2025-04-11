// backend/routes/mercadolibre.js
const express = require('express');
const router = express.Router();
const axios = require('axios');

const CLIENT_ID = process.env.ML_CLIENT_ID;
const CLIENT_SECRET = process.env.ML_CLIENT_SECRET;
const REDIRECT_URI = process.env.ML_REDIRECT_URI;

// 1. Redirigir al login de MercadoLibre
router.get('/login', (req, res) => {
  const url = `https://auth.mercadolibre.com.ar/authorization?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}`;
  res.redirect(url);
});

// 2. Callback para capturar el código y obtener token
router.get('/callback', async (req, res) => {
  const code = req.query.code;

  try {
    const response = await axios.post('https://api.mercadolibre.com/oauth/token', null, {
      params: {
        grant_type: 'authorization_code',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
        redirect_uri: REDIRECT_URI
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    const token = response.data.access_token;
    // Podés guardarlo, mostrarlo o usarlo en la próxima búsqueda
    res.json({ mensaje: "Autenticación exitosa", token });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: 'Fallo al obtener token de acceso' });
  }
});

module.exports = router;
