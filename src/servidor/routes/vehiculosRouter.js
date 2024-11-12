const express = require('express');
const router = express.Router();
const Vehiculo = require('../models/vehiculosModel');


router.get('/', (req, res) => {
  const {  marca } = req.query;
  
  Vehiculo.getVehiculos( marca, (err, vehiculos) => {
    if (err) {
      return res.status(500).json({ message: 'Error al obtener vehículos 1', error: err });
    }
    res.json(vehiculos);
  });
});




router.post('/reservar', async (req, res) => {
  const reservaData = req.body;

  try {
    await Vehiculo.crearReserva(reservaData);
    res.json({ message: 'Reserva realizada con éxito y estado del vehículo actualizado.' });
  } catch (err) {
    console.error('Error al reservar el vehículo:', err);
    res.status(500).json({ message: 'Error al reservar el vehículo.', error: err });
  }
});

module.exports = router;
