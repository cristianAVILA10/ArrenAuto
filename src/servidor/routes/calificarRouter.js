const express = require('express');
const calificarRouter = express.Router();
const calificarModel = require('../models/calificarModel');

// Ruta para obtener los detalles de la reserva y calificarla
calificarRouter.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const reserva = await calificarModel.getReserva(id);
    res.json(reserva);
  } catch (err) {
    console.error('Error al obtener la reserva:', err);
    res.status(500).json({ message: 'No se pudo obtener la reserva' });
  }
});

// Ruta para calificar una reserva y actualizar su estado
calificarRouter.put('/:id/calificar', async (req, res) => {
  const { id } = req.params;
  const { comentario, puntuacion } = req.body;

  // Validación de la calificación
  if (!comentario || puntuacion === undefined) {
    return res.status(400).json({ message: 'Comentario y puntuación son requeridos' });
  }

  if (typeof puntuacion !== 'number' || puntuacion < 1 || puntuacion > 5) {
    return res.status(400).json({ message: 'La puntuación debe ser un número entre 1 y 5' });
  }

  try {
    // Insertar la calificación
    await calificarModel.insertCalificacion(id, puntuacion, comentario);

    // Actualizar el estado de la reserva a 'calificado' (o el estado que corresponda)
    await calificarModel.actualizarEstadoReserva(id);

    // Responder con la redirección
    res.status(200).json({ message: 'Calificación insertada y estado actualizado. Redirigiendo a "mis reservas".', redirectTo: '../html/reserva.html' });
  } catch (err) {
    console.error('Error al calificar y actualizar el estado de la reserva:', err);
    res.status(500).json({ message: 'Ocurrió un error al calificar la reserva' });
  }
});

module.exports = calificarRouter;
