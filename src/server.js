const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackConfig = require('../webpack.config');
const usuariosRouter = require('./servidor/routes/usuariosRouter');
const vehiculosRouter = require('./servidor/routes/vehiculosRouter');
const reservaRouter = require('./servidor/routes/reservaRouter');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;



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

// Rutas para apis Nota: este es el que deben modificar, es decir, agregar una linea con la url que quiera y con la variable router que se creo
app.use('/api/usuarios', usuariosRouter);
app.use('/api/vehiculos', vehiculosRouter);
app.use('/api/reserva', reservaRouter);

// Iniciar el servidor - no modificar
app.listen(port, () => {
  console.log(`Servidor iniciado en el puerto ${port}`);
});
