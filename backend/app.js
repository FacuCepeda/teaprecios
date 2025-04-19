// backend/app.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Rutas
const busquedaRoutes = require('./routes/busqueda');
const mercadolibreRoutes = require('./routes/mercadolibre');
const amazonRoutes = require('./routes/amazon');
const testUserRoutes = require('./routes/testUser'); // opcional

app.use('/buscar', busquedaRoutes);
app.use('/mercadolibre', mercadolibreRoutes);
app.use('/amazon', amazonRoutes);
app.use('/testuser', testUserRoutes);

// Ruta raíz para testear el backend
app.get('/', (req, res) => {
    res.send('✅ API TeAprecios funcionando correctamente');
});

module.exports = app;