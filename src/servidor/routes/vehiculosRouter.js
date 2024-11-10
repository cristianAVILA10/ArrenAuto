const express = require('express');
const router = express.Router();
const Vehiculo = require('../models/vehiculosModel'); // Asegúrate de que este archivo existe y tiene la función `getVehiculos`

// Ruta para obtener todos los vehículos
router.get('/', (req, res) => {
  // Realizamos la consulta a la base de datos para obtener todos los vehículos
  Vehiculo.getVehiculos((err, vehiculos) => {
    if (err) {
      return res.status(500).json({ message: 'Error al obtener vehículos', error: err });
    }

    // Devolver los vehículos en formato JSON
    res.json(vehiculos);
  });
});

module.exports = router;
