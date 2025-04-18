// controllers/amazonController.js
// ✅ Sintaxis consistente y compatible con Vercel (CommonJS)

async function buscarAmazon(termino) {
  const productosSimulados = [
    {
      titulo: "Echo Dot (5th Gen, 2022) con Alexa",
      precio: 49.99,
      link: "https://www.amazon.com/dp/B09B8V8NQM?tag=teapre-20",
      fuente: "Amazon",
      imagen: "https://m.media-amazon.com/images/I/61VTpZWSnFL._AC_SL1000_.jpg"
    },
    {
      titulo: "Apple AirPods Pro (2da generación)",
      precio: 249.00,
      link: "https://www.amazon.com/dp/B0BDHWDR12?tag=teapre-20",
      fuente: "Amazon",
      imagen: "https://m.media-amazon.com/images/I/61SUj2aKoEL._AC_SL1500_.jpg"
    },
    {
      titulo: "Fire TV Stick 4K Max con control remoto Alexa",
      precio: 39.99,
      link: "https://www.amazon.com/dp/B08XVYZ1Y5?tag=teapre-20",
      fuente: "Amazon",
      imagen: "https://m.media-amazon.com/images/I/51Da2Z+FTqL._AC_SL1000_.jpg"
    }
  ];

  return productosSimulados.filter(p =>
    p.titulo.toLowerCase().includes(termino.toLowerCase())
  );
}

module.exports = { buscarAmazon };
