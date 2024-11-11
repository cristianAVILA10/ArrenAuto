const express = require('express');
const router = express.Router();
const Usuario = require('../models/usuarioModel');

// Ruta para obtener todos los usuarios
router.get('/', (req, res) => {
  Usuario.getUsuarios((err, usuarios) => {
    if (err) {
      return res.status(500).json({ message: 'Error al obtener usuarios' });
    }
    res.json(usuarios);  // Retorna los usuarios en formato JSON
  });
});


module.exports = router;
