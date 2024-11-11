const express = require('express');
const router = express.Router();
const AdministradorModel = require('../models/administradorModel');

router.get('/reservas', async (req, res) => {
  try {
    const reservas = await AdministradorModel.getAllReservas();
    res.json(reservas);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las reservas', error });
  }
});

router.post('/reservas/:id/estado', async (req, res) => {
  const { id } = req.params;
  const { nuevoEstado } = req.body;
  try {
    await AdministradorModel.actualizarEstadoReserva(id, nuevoEstado);
    res.json({ message: 'Estado de la reserva actualizado con éxito' });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el estado de la reserva', error });
  }
});

module.exports = router;
