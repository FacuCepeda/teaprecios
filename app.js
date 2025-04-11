// backend/app.js
const express = require('express');
const app = express();
require('dotenv').config(); // ✅ Cargar variables de entorno temprano

// Middlewares
const cors = require('cors');
app.use(cors());
app.use(express.json()); // ✅ Para recibir JSON en las peticiones

// Rutas
const busquedaRoutes = require('./routes/busqueda');
const amazonRoutes = require('./routes/amazon');
const mercadoLibreRoutes = require('./routes/mercadolibre');

// Uso de rutas
app.use("/api/amazon", amazonRoutes);
app.use("/api/busqueda", busquedaRoutes);
app.use("/api/ml", mercadoLibreRoutes);

// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
