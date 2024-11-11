const oracledb = require('oracledb');
const db = require('../db');

async function getVehiculos( marca, callback) {
  try {
      const connection = await db();

      let query = `
          SELECT * FROM vehiculo
          WHERE id_est_vehiculo = 1
          AND LOWER(marca) = :marca
      `;

      const params = {
          marca: marca.toLowerCase()
      };


      const result = await connection.execute(query, params, { outFormat: oracledb.OUT_FORMAT_OBJECT });
      await connection.close();

      callback(null, result.rows);  
  } catch (err) {
      console.error('Error al obtener los vehículos:', err);
      callback(err, null);  
  }
}



async function crearReserva(reservaData) {
  const { idVehiculo, fechaInicial, fechaFinal, horaInicial, horaFinal, puntoRecogida, puntoEntrega } = reservaData;

  try {
    const connection = await db();

    await connection.execute(`BEGIN`);

    const reservaQuery = `
      INSERT INTO RESERVA (id_vehiculo, fecha_inicial, fecha_final, hora_inicial, hora_final, punto_recogida, punto_entrega)
      VALUES (:idVehiculo, TO_DATE(:fechaInicial, 'YYYY-MM-DD'), TO_DATE(:fechaFinal, 'YYYY-MM-DD'), :horaInicial, :horaFinal, :puntoRecogida, :puntoEntrega)
    `;

    await connection.execute(
      reservaQuery,
      {
        idVehiculo,
        fechaInicial,
        fechaFinal,
        horaInicial,
        horaFinal,
        puntoRecogida,
        puntoEntrega
      }
    );

    await actualizarEstadoVehiculo(idVehiculo, 3);

    await connection.commit();
    await connection.close();
  } catch (err) {
    console.error('Error al crear la reserva:', err);
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
