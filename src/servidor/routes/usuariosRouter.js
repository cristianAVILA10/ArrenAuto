const express = require('express');
const router = express.Router();
const Usuario = require('../models/usuarioModel');

router.get('/', (req, res) => {
  Usuario.getUsuarios((err, usuarios) => {
    if (err) {
      return res.status(500).json({ message: 'Error al obtener usuarios' });
    }
    res.json(usuarios);
  });
});

router.post('/login', (req, res) => {
  const { usuario, contrasena } = req.body;

  if (!usuario || !contrasena) {
    return res.status(400).json({ message: 'Faltan credenciales' });
  }

  Usuario.verificarCredenciales(usuario, contrasena, (err, usuarioEncontrado) => {
    if (err) {
      return res.status(500).json({ message: 'Error en el servidor' });
    }

    if (!usuarioEncontrado) {
      return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
    }

    res.status(200).json({ message: 'Login exitoso', usuario: usuarioEncontrado });
  });
});


module.exports = router;