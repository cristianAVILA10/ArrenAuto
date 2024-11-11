// Otros requerimientos y configuración
const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackConfig = require('../webpack.config');
const usuariosRouter = require('./servidor/routes/usuariosRouter');
const vehiculosRouter = require('./servidor/routes/vehiculosRouter');
const reservaRouter = require('./servidor/routes/reservaRouter');
const calificarRouter = require('./servidor/routes/calificarRouter');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Configurar el middleware para interpretar JSON en el cuerpo de las solicitudes
app.use(express.json());  // <--- Agrega esta línea aquí

// Configurar la carpeta de archivos estáticos - no modificar
app.use(express.static(path.join(__dirname, 'cliente')));

// Servir archivos estáticos de imágenes desde la carpeta - no modificar
app.use('/img', express.static(path.join(__dirname, 'img')));

// Middleware de Webpack - no modificar
app.use('/static', express.static('dist'));
app.use(webpackDevMiddleware(webpack(webpackConfig), {
  publicPath: '/static/',
}));

// Ruta para el archivo HTML principal - no modificar
app.get('/', (req, res) => {
  res.sendFile('index.html', { root: './src/cliente' });
});

// Rutas para apis
app.use('/api/usuarios', usuariosRouter);
app.use('/api/vehiculos', vehiculosRouter);
app.use('/api/reserva', reservaRouter);      // Ruta para las reservas
app.use('/api/calificar', calificarRouter);  // Ruta para calificar una reserva

// Iniciar el servidor - no modificar
app.listen(port, () => {
  console.log(`Servidor iniciado en el puerto ${port}`);
});
