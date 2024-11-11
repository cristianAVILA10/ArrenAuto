const express = require('express');
const router = express.Router();
const Reserva = require('../models/reservaModel');

// Ruta para obtener todos los usuarios
router.get('/', (req, res) => {
  Reserva.getReserva((err, reserva) => {
    if (err) {
      return res.status(500).json({ message: 'Error al obtener la reserva' });
    }
    res.json(reserva);  // Retorna los usuarios en formato JSON
  });
});

// Ruta para cancelar una reserva específica
router.put('/:id/cancelar', (req, res) => {
  const reservaId = req.params.id;

  // Llama a una función en el modelo para actualizar el estado de la reserva
  Reserva.cancelarReserva(reservaId, (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'No se pudo cancelar la reserva' });
    }
    res.json({ message: 'Reserva cancelada correctamente' });
  });
});

module.exports = router;