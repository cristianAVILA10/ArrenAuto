const oracledb = require('oracledb');
const db = require('../db');

// Obtener una reserva específica
async function getReserva(id) {
  let connection;
  try {
    connection = await db();
    const query = `
      SELECT id_reserva, modelo, fecha_inicio, fecha_reserva, fecha_fin, punto_recogida, punto_entrega, img_vehiculo, placa 
      FROM reserva a 
      INNER JOIN vehiculo b ON a.id_vehiculo = b.id_vehiculo
      WHERE id_reserva = :id
    `;
    const result = await connection.execute(query, [id], { outFormat: oracledb.OUT_FORMAT_OBJECT });
    if (result.rows.length === 0) {
      throw new Error('Reserva no encontrada');
    }
    return result.rows[0];
  } catch (err) {
    console.error('Error al obtener la reserva:', err);
    throw new Error('Error al obtener la reserva');
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

// Insertar una calificación para una reserva
async function insertCalificacion(id, puntuacion, comentario) {
  let connection;
  try {
    connection = await db();
    const query = `
      INSERT INTO CLASIFICACION (id_clasificacion, id_reserva, puntuacion, comentario, fecha)
      VALUES (SEQ_CLASIFICACION.NEXTVAL, :id, :puntuacion, :comentario, SYSTIMESTAMP)
    `;
    const result = await connection.execute(query, [id, puntuacion, comentario], { autoCommit: true });
    return result;
  } catch (err) {
    console.error('Error al insertar calificación:', err);
    throw new Error('Error al insertar calificación');
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

// Actualizar el estado de una reserva a Calificada (estado 5)
async function actualizarEstadoReserva(id) {
  let connection;
  try {
    connection = await db();
    console.log('Conexión establecida para actualizar el estado.');

    // Realizar el update en la reserva del estado a 5
    const query = `
      UPDATE reserva SET id_est_reserva = 5 WHERE id_reserva = :id
    `;
    const result = await connection.execute(query, [id], { autoCommit: true });
    console.log('Resultado de la ejecución de la actualización:', result);

    if (result.rowsAffected === 0) {
      console.warn('Advertencia: No se pudo actualizar el estado de la reserva. Ninguna fila afectada.');
      throw new Error('No se pudo actualizar el estado de la reserva');
    }
    return { message: 'Estado de la reserva actualizado exitosamente' };

  } catch (err) {

    console.error('Error al actualizar el estado de la reserva:', err);
    throw new Error('Error al actualizar el estado de la reserva');

  } finally {

    if (connection) {
      await connection.close();
    }

  }
}

// Función para calificar y actualizar la reserva
async function calificarReserva(req, res) {
  const { reservaId, puntuacion, comentario } = req.body;

  try {
    console.log('Iniciando la calificación para la reserva:', reservaId); 

    // Insertar la calificación
    await insertCalificacion(reservaId, puntuacion, comentario);
    console.log('Calificación insertada exitosamente.');

    // Actualizar el estado de la reserva a 'calificado'
    const updateResponse = await actualizarEstadoReserva(reservaId);
    console.log('Respuesta de la actualización del estado:', updateResponse);

    if (updateResponse.message === 'Estado de la reserva actualizado exitosamente') {
      console.log('Estado actualizado correctamente.');

      // Redirigir al cliente a "mis reservas"
      res.status(200).json({ message: 'Calificación insertada y estado actualizado. Redirigiendo a "mis reservas".', redirectTo: '/mis-reservas' });

    } else {
      console.log('No se pudo actualizar el estado');
      throw new Error('No se pudo actualizar el estado de la reserva');
    }
    
  } catch (error) {
    console.error('Error en la calificación y actualización de reserva:', error);
    res.status(500).json({ message: 'Error en la calificación y actualización de reserva.', error: error.message });
  }
}

module.exports = { getReserva, insertCalificacion, actualizarEstadoReserva, calificarReserva };
