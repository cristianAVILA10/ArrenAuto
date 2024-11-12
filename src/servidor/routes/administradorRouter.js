const express = require('express');
const router = express.Router();
const AdministradorModel = require('../models/administradorModel');
/*
router.get('/reservas', async (req, res) => {
  try {
    const reservas = await AdministradorModel.getAllReservas();
    res.json(reservas);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las reservas', error });
  }
});
*/
router.get('/reservas', (req, res) => {
  AdministradorModel.getAllReservas((err, reservas) => {
    if (err) {
      return res.status(500).json({ message: 'Error al obtener usuarios' });
    }
    res.json(reservas);  // Retorna los usuarios en formato JSON
  });
});

router.post('/reservas/:id/estado',  (req, res) => {
  const { id } = req.params;
  const { nuevoEstado } = req.body;
     AdministradorModel.actualizarEstadoReserva(id, nuevoEstado, (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'No se pudo cancelar la reserva' });
      }
      res.json({ message: 'Reserva cancelada correctamente' });
    });
  });



module.exports = router;
