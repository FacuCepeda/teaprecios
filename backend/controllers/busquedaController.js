// controllers/busquedaController.js

const { buscarAmazon } = require('./amazonController');
const { buscarEnMercadoLibre } = require('./mercadolibreController');

const buscarProductos = async (query) => {
  try {
    const [resultadosAmazon, resultadosML] = await Promise.all([
      buscarAmazon(query).catch(err => {
        console.error('⚠️ Error en buscarAmazon:', err.message);
        return [];
      }),
      buscarEnMercadoLibre(query).catch(err => {
        console.error('⚠️ Error en buscarEnMercadoLibre:', err.message);
        return [];
      })
    ]);

    return [...resultadosAmazon, ...resultadosML];
  } catch (error) {
    console.error('❌ Error general en buscarProductos:', error.message);
    return [];
  }
};

module.exports = { buscarProductos };
