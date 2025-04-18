// controllers/mercadolibreController.js
const axios = require('axios');

const buscarEnMercadoLibre = async (query) => {
  try {
    const response = await axios.get(
      `https://api.mercadolibre.com/sites/MLA/search?q=${encodeURIComponent(query)}&limit=5`,
      {
        headers: {
          'User-Agent': 'TeApreciosBot/1.0',
          'Accept': 'application/json'
        }
      }
    );

    return response.data.results.map(item => ({
      fuente: 'MercadoLibre',
      titulo: item.title,
      precio: item.price,
      link: item.permalink,
      imagen: item.thumbnail
    }));
  } catch (error) {
    console.error('Error en buscarEnMercadoLibre:', error?.response?.data || error.message);
    return [];
  }
};

module.exports = { buscarEnMercadoLibre };
