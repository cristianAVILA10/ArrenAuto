const db = require('../db');

// Función para obtener todos los vehículos
const getVehiculos = (callback) => {
  const query = 'SELECT * FROM vehiculo'; // Asegúrate de que esta consulta es correcta
  db.query(query, (err, results) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
};

module.exports = { getVehiculos };