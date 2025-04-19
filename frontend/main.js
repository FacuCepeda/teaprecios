document.addEventListener('DOMContentLoaded', () => {
  const formBusqueda = document.getElementById('form-busqueda');
  const inputBusqueda = document.getElementById('input-busqueda');
  const productosAmazonContainer = document.getElementById('productos-amazon');
  const productosMLContainer = document.getElementById('productos-ml');

  formBusqueda.addEventListener('submit', async (event) => {
      event.preventDefault();
      const query = inputBusqueda.value.trim();
      if (query) {
          await buscarProductos(query);
      }
  });

  async function buscarProductos(query) {
      productosAmazonContainer.innerHTML = ''; // Limpiar contenedor de Amazon
      productosMLContainer.innerHTML = '';     // Limpiar contenedor de MercadoLibre

      try {
          const response = await fetch(`https://teaprecios-backend.vercel.app/buscar?q=${encodeURIComponent(query)}`);
          const data = await response.json();

          if (data && data.resultados && data.resultados.length > 0) {
              data.resultados.forEach(producto => {
                  const item = document.createElement('div');
                  item.classList.add('producto');
                  item.innerHTML = `
                      <img src="${producto.imagen}" alt="${producto.titulo}">
                      <h3>${producto.titulo}</h3>
                      <p>Precio: ${producto.precio}</p>
                      <a href="${producto.link}" target="_blank" rel="noopener noreferrer">Ver en ${producto.plataforma}</a>
                  `;

                  if (producto.plataforma === 'Amazon') {
                      productosAmazonContainer.appendChild(item);
                  } else if (producto.plataforma === 'Mercado Libre') {
                      productosMLContainer.appendChild(item);
                  }
              });
          } else {
              productosAmazonContainer.innerHTML = '<p>No se encontraron productos para Amazon.</p>';
              productosMLContainer.innerHTML = '<p>No se encontraron productos para Mercado Libre.</p>';
          }

      } catch (error) {
          console.error('Error al buscar productos:', error);
          productosAmazonContainer.innerHTML = '<p>Error al cargar los productos.</p>';
          productosMLContainer.innerHTML = '<p>Error al cargar los productos.</p>';
      }
  }

  // Carga inicial de productos de Amazon (opcional, si quieres mostrar algo al cargar la página)
  fetch('https://teaprecios-backend.vercel.app/amazon/productos')
      .then(res => res.json())
      .then(productos => {
          productosAmazonContainer.innerHTML = ''; // Limpiar
          productos.forEach(producto => {
              const item = document.createElement('div');
              item.classList.add('producto');
              item.innerHTML = `
                  <img src="${producto.imagen}" alt="${producto.titulo}">
                  <h3>${producto.titulo}</h3>
                  <p>Precio: ${producto.precio}</p>
                  <a href="${producto.link}" target="_blank" rel="noopener noreferrer">Ver en Amazon</a>
              `;
              productosAmazonContainer.appendChild(item);
          });
      })
      .catch(err => {
          console.error('Error al obtener productos iniciales de Amazon:', err);
          productosAmazonContainer.innerHTML = '<p>Error al cargar los productos de Amazon.</p>';
      });
});