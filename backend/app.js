// backend/app.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const busquedaRoutes = require('./routes/busqueda');
const mercadolibreRoutes = require('./routes/mercadolibre');
const amazonRoutes = require('./routes/amazon');
const testUserRoutes = require('./routes/testUser'); // 👈 NUEVO

app.use('/busqueda', busquedaRoutes);
app.use('/mercadolibre', mercadolibreRoutes);
app.use('/amazon', amazonRoutes);
app.use('/testuser', testUserRoutes); // 👈 NUEVO

app.get('/', (req, res) => {
    res.send('🚀 TeAprecios API funcionando correctamente');
  });
  

module.exports = app;
