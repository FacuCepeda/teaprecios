// public/main.js
document.addEventListener('DOMContentLoaded', () => {
  const contenedor = document.getElementById('productos-amazon');

  fetch('http://localhost:3000/api/amazon/productos')
    .then(res => res.json())
    .then(productos => {
      contenedor.innerHTML = ''; // Limpiar

      productos.forEach(producto => {
        const item = document.createElement('div');
        item.classList.add('producto');

        item.innerHTML = `
          <img src="${producto.imagen}" alt="${producto.titulo}">
          <h3>${producto.titulo}</h3>
          <p>Precio: ${producto.precio}</p>
          <a href="${producto.link}" target="_blank">Ver en Amazon</a>
        `;

        contenedor.appendChild(item);
      });
    })
    .catch(err => {
      console.error('Error al obtener productos de Amazon:', err);
      contenedor.innerHTML = '<p>Error al cargar los productos.</p>';
    });
});
