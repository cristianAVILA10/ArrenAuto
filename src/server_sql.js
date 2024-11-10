const express = require('express');
const mysql = require('mysql');
const app = express();
const port = 3000;
const cors = require('cors');
app.use(cors());
app.use(express.json());  // Middleware para parsear el cuerpo de las solicitudes JSON

// Configuración de conexión a MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',      // Cambia 'root' si tienes un usuario diferente
  password: '',      // Coloca tu contraseña si tienes una
  database: 'vehiculos_prueba'  // Cambia a tu nombre de base de datos
});

// Conectar a la base de datos
db.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    return;
  }
  console.log('Conectado a la base de datos MySQL');
});

// Ruta para obtener reservas
app.get('/api/reservas', (req, res) => {
  const sql = 'SELECT * FROM reserva';
  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Error en la consulta de la base de datos' });
    } else {
      res.json(results);
    }
  });
});

// Ruta para actualizar el estado de una reserva (cancelar reserva)
app.put('/api/reservas/:id/cancelar', (req, res) => {
  const { id } = req.params;
  const { estado } = req.body; // El estado debe ser 2 para cancelarla

  if (!estado) {
    return res.status(400).json({ error: 'El estado es necesario' });
  }

  const sql = 'UPDATE reserva SET id_est_reserva = ? WHERE id_reserva = ?';
  db.query(sql, [estado, id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error al actualizar el estado de la reserva' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }
    res.json({ message: 'Reserva cancelada exitosamente' });
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor ejecutándose en http://localhost:${port}`);
});
