const express = require('express');
const router = express.Router();
const { buscarMercadoLibre } = require('../controllers/mercadolibreController');
const { buscarAmazon } = require('../controllers/amazonController');

router.get('/', async (req, res) => {
  const { producto } = req.query;

  if (!producto) {
    return res.status(400).json({ error: 'Debes proporcionar un término de búsqueda.' });
  }

  try {
    const [ml, amz] = await Promise.all([
      buscarMercadoLibre(producto),
      buscarAmazon(producto)
    ]);

    const resultados = [...ml, ...amz].filter(r => r.precio !== null);

    resultados.sort((a, b) => a.precio - b.precio);

    res.json(resultados);
  } catch (error) {
    console.error('Error en la búsqueda:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
