const express = require('express');
const router = express.Router();
const Mensaje = require('../models/mensajesModel');

router.post('/sendMessage', async (req, res) => {
    const { id_usuario, asunto, mensaje } = req.body;

    try {
        await Mensaje.guardarMensaje(id_usuario, asunto, mensaje);
        res.status(200).json({ message: 'Mensaje guardado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al guardar el mensaje' });
    }
});

module.exports = router;
