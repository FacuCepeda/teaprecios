const axios = require('axios');

async function buscarMercadoLibre(termino) {
  try {
    const respuesta = await axios.get('https://api.mercadolibre.com/sites/MLA/search', {
      params: { q: termino, limit: 10 }
    });

    const resultados = respuesta.data.results.map(item => ({
      titulo: item.title,
      precio: item.price,
      link: item.permalink,
      fuente: 'MercadoLibre',
      imagen: item.thumbnail
    }));

    return resultados;
  } catch (error) {
    console.error('Error al consultar MercadoLibre:', error.message);
    return [];
  }
}

module.exports = { buscarMercadoLibre };
