const oracledb = require('oracledb');
const db = require('../db');

async function getVehiculos(marca, callback) {
  try {
      const connection = await db();
      console.log('marca: ' + marca);

      let query = `
          SELECT * FROM vehiculo
          WHERE id_est_vehiculo = 1
          AND LOWER(marca) LIKE :marca
      `;

      // Asegúrate de pasar los parámetros correctamente
      const params = { marca: `%${marca.toLowerCase()}%` };

      const result = await connection.execute(query, params, { outFormat: oracledb.OUT_FORMAT_OBJECT });
      await connection.close();

      callback(null, result.rows);
  } catch (err) {
      console.error('Error al obtener los vehículos:', err);
      callback(err, null);
  }
}


async function crearReserva(reservaData) {
  const { id_usuario, idVehiculo, fechaInicial, fechaFinal, horaInicial, horaFinal, puntoRecogida, puntoEntrega } = reservaData;

  try {
    const connection = await db();

    console.log('llega bien 1');
    
    const reservaQuery = `
      INSERT INTO RESERVA (id_reserva, id_usuario, id_vehiculo, fecha_reserva, fecha_inicio, fecha_fin, punto_recogida, punto_entrega, id_est_reserva)
      VALUES (SEQ_RESERVA.NEXTVAL, :id_usuario, :idVehiculo, SYSTIMESTAMP, TO_DATE(:fechaInicial, 'YYYY-MM-DD'), TO_DATE(:fechaFinal, 'YYYY-MM-DD'), :puntoRecogida, :puntoEntrega, 1)
    `;
    console.log('llega bien 2');

    await connection.execute(
      reservaQuery,
      {
        id_usuario,
        idVehiculo,
        fechaInicial,
        fechaFinal,
        puntoRecogida,
        puntoEntrega,
      }
    );

    await actualizarEstadoVehiculo(idVehiculo, 3);

    await connection.commit();
    await connection.close();
  } catch (err) {
    console.error('Error al crear la reserva 2:', err);
    throw err;
  }
}

async function actualizarEstadoVehiculo(idVehiculo, nuevoEstado) {
  try {
    const connection = await db();

    const query = `
      UPDATE VEHICULO
      SET id_est_vehiculo = :nuevoEstado
      WHERE id_vehiculo = :idVehiculo
    `;

    await connection.execute(query, { nuevoEstado, idVehiculo }, { autoCommit: true });

    await connection.close();
  } catch (err) {
    console.error('Error al actualizar el estado del vehículo:', err);
    throw err;
  }
}

module.exports = { getVehiculos, crearReserva, actualizarEstadoVehiculo };
