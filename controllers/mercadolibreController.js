const axios = require('axios');

const buscarEnMercadoLibre = async (query) => {
  try {
    const response = await axios.get(
      `https://api.mercadolibre.com/sites/MLA/search?q=${encodeURIComponent(query)}`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/113.0.0.0 Safari/537.36',
          'Accept': 'application/json',
        },
      }
    );

    const resultados = response.data.results.slice(0, 5);

    return resultados.map(item => ({
      fuente: 'MercadoLibre',
      titulo: item.title,
      precio: item.price,
      link: item.permalink,
      imagen: item.thumbnail,
    }));
  } catch (error) {
    console.error('Error en buscarEnMercadoLibre:', error.message);
    throw new Error('Error al buscar en MercadoLibre');
  }
};

module.exports = { buscarEnMercadoLibre };
