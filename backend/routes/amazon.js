// routes/amazon.js
const express = require('express');
const router = express.Router();

const productosAmazonSimulados = require('../data/productosAmazonSimulados'); // asegúrate que este archivo exista

router.get('/productos', (req, res) => {
  res.json(productosAmazonSimulados);
});

module.exports = router;
