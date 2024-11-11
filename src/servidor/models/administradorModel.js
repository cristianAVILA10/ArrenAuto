const db = require('../db');

async function getAllReservas() {
  const query = `
    SELECT 
      r.id_reserva, r.fecha_reserva, r.fecha_inicio, r.fecha_fin,
      r.punto_recogida, r.punto_entrega, r.id_estado_reserva,
      v.marca, v.modelo, u.nombre AS nombre_usuario
    FROM reserva r
    JOIN vehiculo v ON r.id_vehiculo = v.id_vehiculo
    JOIN usuario u ON r.id_usuario = u.id_usuario
  `;
  const result = await db.query(query);
  return result;
}

async function actualizarEstadoReserva(id, nuevoEstado) {
  const query = `UPDATE reserva SET id_estado_reserva = ? WHERE id_reserva = ?`;
  await db.query(query, [nuevoEstado, id]);
}

module.exports = { getAllReservas, actualizarEstadoReserva };
