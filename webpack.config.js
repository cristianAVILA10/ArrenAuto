const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/cliente/js/index.js',  // Archivo JS de entrada
  output: {
    path: path.resolve(__dirname, 'dist'),  // Directorio de salida
    filename: 'bundle.js',  // Nombre del archivo JS compilado
  },
  module: {
    rules: [
      {
        test: /\.js$/,  // Procesa archivos JS
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,  // Procesa archivos CSS
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.join(__dirname, 'dist'),  // Carpeta de contenido estático
    port: 3000,  // Puerto para servir los archivos
  },
};
