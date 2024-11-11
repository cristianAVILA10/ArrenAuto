const oracledb = require('oracledb');
const db = require('../db');

// Obtener las reservas
async function getReserva(id_usuario, callback) {
  try {

    console.log('pasa 1');
    
    const connection = await db(); // Esto asume que `db` es una función asíncrona que devuelve la conexión
    const query = `
      SELECT id_reserva, modelo, fecha_reserva, fecha_inicio, fecha_fin, 
             punto_recogida, punto_entrega, c.estado,a.id_est_reserva, img_vehiculo, placa 
      FROM reserva a 
      INNER JOIN vehiculo b ON a.id_vehiculo = b.id_vehiculo 
      INNER JOIN estado_reserva c ON c.id_est_reserva = a.id_est_reserva
      where a.id_usuario = :id_usuario
    `;
    console.log('pasa 2: ' +id_usuario );
    const result = await connection.execute(query, [id_usuario], { outFormat: oracledb.OUT_FORMAT_OBJECT });
    await connection.close();
    callback(null, result.rows);

  } catch (err) {
    console.error('Error al obtener las reservas:', err);
    callback(err, null);
  }
}

// Actualizar el estado de una reserva a "Pendiente"
async function cancelarReserva(id, callback) {
  try {
    const connection = await db();
    const query = `UPDATE reserva SET id_est_reserva = :estado WHERE id_reserva = :id`;

    const result = await connection.execute(query, [1, id], { autoCommit: true }); // Estado 1 para "Pendiente" pasa al Admin
    await connection.close();

    if (result.rowsAffected === 0) {
      return callback(new Error('Reserva no encontrada'), null);
    }

    callback(null, { message: 'Reserva cancelada exitosamente' });
  } catch (err) {
    console.error('Error al cancelar la reserva:', err);
    callback(err, null);
  }
}

module.exports = { getReserva, cancelarReserva };
