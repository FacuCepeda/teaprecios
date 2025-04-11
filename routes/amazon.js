// backend/routes/amazon.js
const express = require('express');
const router = express.Router();

const productosAmazonSimulados = require('../data/productosAmazonSimulados');

// GET /api/amazon/productos
router.get('/productos', (req, res) => {
  res.json(productosAmazonSimulados);
});

module.exports = router;
