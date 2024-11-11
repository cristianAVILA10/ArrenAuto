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

router.post("/registrar", async (req, res) => {
  const { nombre, apellido, correo, telefono, direccion, usuario, password, id_tip_usuario } = req.body;
console.log('pasa 1');

  // Validación de datos recibidos
  if (!nombre || !apellido || !correo || !usuario || !password || !id_tip_usuario) {
      return res.status(400).json({ error: "Faltan datos requeridos" });
  }
  console.log('pasa 2');
  try {
      // Insertar usuario en la base de datos
      console.log('pasa 3');
      const result = await Usuario.insertarUsuario({ nombre, apellido, correo, telefono, direccion, usuario, password, id_tip_usuario });
      console.log('pasa 4');
      res.status(201).json({ message: "Usuario registrado exitosamente", result });
      console.log('pasa 4.1');
  } catch (error) {
      res.status(500).json({ error: "Error al registrar usuario 4" + error});
  }
});


module.exports = router;
