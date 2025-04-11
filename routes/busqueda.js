const express = require('express');
const router = express.Router();
const { buscarAmazon } = require('../controllers/amazonController');
const { buscarEnMercadoLibre } = require('../controllers/mercadolibreController');

router.get('/', async (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.status(400).json({ error: 'Falta el parámetro de búsqueda "q"' });
  }

  try {
    const [resultadosAmazon, resultadosML] = await Promise.all([
      buscarAmazon(query).catch(err => {
        console.error('⚠️ Error en buscarAmazon:', err.message);
        return []; // evita que explote si falla una fuente
      }),
      buscarEnMercadoLibre(query).catch(err => {
        console.error('⚠️ Error en buscarEnMercadoLibre:', err.message);
        return [];
      })
    ]);

    const resultados = [...resultadosAmazon, ...resultadosML];
    res.json({ resultados });

  } catch (error) {
    console.error('❌ Error general en la búsqueda:', error.message);
    res.status(500).json({ error: 'Error al buscar productos' });
  }
});

module.exports = router;
