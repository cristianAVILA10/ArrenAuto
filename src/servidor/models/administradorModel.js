const db = require("../db");
const oracledb = require("oracledb");

// Obtener todos los usuarios de la base de datos en Oracle
async function getAllReservas(callback) {
  try {
    const connection = await db(); // Esto asume que `db` es una función asíncrona que devuelve la conexión

    const query = `
    SELECT 
      r.id_reserva, r.fecha_reserva, r.fecha_inicio, r.fecha_fin,
      r.punto_recogida, r.punto_entrega, r.id_est_reserva, v.img_vehiculo,
      v.marca, v.modelo, u.nombre AS nombre_usuario
    FROM reserva r
    JOIN vehiculo v ON r.id_vehiculo = v.id_vehiculo
    JOIN usuario u ON r.id_usuario = u.id_usuario
  `;

    // Usamos `outFormat: oracledb.OUT_FORMAT_OBJECT` para obtener resultados como objetos
    const result = await connection.execute(query, [], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });

    await connection.close();

    // Los resultados ahora serán un array de objetos, con claves que son los nombres de las columnas
    callback(null, result.rows);
  } catch (err) {
    console.error("Error al obtener los reservas:", err);
    callback(err, null);
  }
}

async function actualizarEstadoReserva(id_reserva, id_est_reserva, callback) {
  try {
    const connection = await db();

    const query = `UPDATE reserva SET id_est_reserva = :id_est_reserva WHERE id_reserva = :id_reserva`;
    const result = await connection.execute(query, [id_est_reserva, id_reserva], {
      autoCommit: true,
    }); // Estado 1 para "Pendiente" pasa al Admin
    await connection.close();

    if (result.rowsAffected === 0) {
      return callback(new Error("Reserva no encontrada"), null);
    }

    callback(null, { message: "Reserva cancelada exitosamente" });
  } catch (err) {
    console.error("Error al cancelar la reserva:", err);
    callback(err, null);
  }
}

module.exports = { getAllReservas, actualizarEstadoReserva };
