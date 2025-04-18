// routes/mercadolibre.js
const express = require('express');
const axios = require('axios');
const crypto = require('crypto');
require('dotenv').config();

const router = express.Router();

let temporaryState = null;
let codeVerifier = null;
let accessToken = null;

// 🔐 Generar code_verifier y su hash code_challenge
function generatePKCE() {
  codeVerifier = crypto.randomBytes(32).toString('hex');

  const hash = crypto.createHash('sha256').update(codeVerifier).digest();
  const codeChallenge = hash.toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  return { codeVerifier, codeChallenge };
}

// 🎲 Generador de state seguro
function generateState() {
  return crypto.randomBytes(16).toString('hex');
}

// 🔗 Paso 1: Redirigir a ML con PKCE
router.get('/login', (req, res) => {
  const state = generateState();
  temporaryState = state;

  const { codeChallenge } = generatePKCE();

  const authUrl = `https://auth.mercadolibre.com.ar/authorization?response_type=code&client_id=${process.env.ML_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.REDIRECT_URI)}&state=${state}&code_challenge=${codeChallenge}&code_challenge_method=S256`;

  res.redirect(authUrl);
});

// 🔁 Paso 2: Callback y obtener access_token con code_verifier
router.get('/callback', async (req, res) => {
  const { code, state } = req.query;

  if (!code || !state || state !== temporaryState) {
    return res.status(400).json({ error: 'State inválido o código faltante' });
  }

  try {
    const tokenResponse = await axios.post(
      'https://api.mercadolibre.com/oauth/token',
      new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: process.env.ML_CLIENT_ID,
        client_secret: process.env.ML_CLIENT_SECRET, // Obligatorio aunque uses PKCE
        code,
        redirect_uri: process.env.REDIRECT_URI,
        code_verifier: codeVerifier,
      }),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }
    );

    accessToken = tokenResponse.data.access_token;

    console.log('✅ ACCESS TOKEN:', accessToken);
    res.send('✅ Autenticación con MercadoLibre completada con éxito.');
  } catch (error) {
    console.error('❌ Error al obtener el token:', error.response?.data || error.message);
    res.status(500).json({ error: 'Error al obtener token de MercadoLibre' });
  }
});

// 🔎 Buscar productos en MercadoLibre
router.get('/buscar', async (req, res) => {
  const { q } = req.query;

  if (!q) return res.status(400).json({ error: 'Falta el parámetro "q"' });
  if (!accessToken) return res.status(401).json({ error: 'No autenticado con MercadoLibre' });

  try {
    console.log(`🔍 Buscando "${q}" en MercadoLibre...`);
    console.log(`📦 Usando accessToken: ${accessToken.substring(0, 15)}...`);

    const response = await axios.get(`https://api.mercadolibre.com/sites/MLA/search?q=${encodeURIComponent(q)}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const resultados = response.data.results.map((item) => ({
      id: item.id,
      title: item.title,
      price: item.price,
      currency: item.currency_id,
      thumbnail: item.thumbnail,
      permalink: item.permalink,
    }));

    console.log(`✅ Resultados encontrados: ${resultados.length}`);
    res.json({ resultados });
  } catch (error) {
    console.error('❌ Error al buscar en MercadoLibre:');
    console.error(error.response?.data || error.message);

    res.status(500).json({ error: 'Error al buscar en MercadoLibre', detalle: error.response?.data || error.message });
  }
});

// 👤 Crear usuario de prueba de MercadoLibre
router.post('/crear-test-user', async (req, res) => {
  if (!accessToken) {
    return res.status(401).json({ error: 'No autenticado con MercadoLibre' });
  }

  try {
    const response = await axios.post(
      'https://api.mercadolibre.com/users/test_user',
      { site_id: 'MLA' },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('✅ Usuario de prueba creado:', response.data);
    res.status(201).json(response.data);
  } catch (error) {
    console.error('❌ Error al crear usuario de prueba:', error.response?.data || error.message);
    res.status(500).json({ error: 'No se pudo crear el usuario de prueba', detalle: error.response?.data });
  }
});

// Ruta de login a MercadoLibre
router.get('/login', (req, res) => {
  const redirect_uri = encodeURIComponent("https://teaprecios-backend.vercel.app/api/ml/callback");
  const client_id = process.env.ML_CLIENT_ID;

  const url = `https://auth.mercadolibre.com.ar/authorization?response_type=code&client_id=${client_id}&redirect_uri=${redirect_uri}`;
  res.redirect(url);
});


module.exports = router;
