const oracledb = require('oracledb');
const db = require('../db');

// Obtener todos los usuarios de la base de datos en Oracle
async function getUsuarios(callback) {
  try {
    const connection = await db(); // Esto asume que `db` es una función asíncrona que devuelve la conexión

    const query = 'SELECT * FROM usuario';

    // Usamos `outFormat: oracledb.OUT_FORMAT_OBJECT` para obtener resultados como objetos
    const result = await connection.execute(query, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });

    await connection.close();

    // Los resultados ahora serán un array de objetos, con claves que son los nombres de las columnas
    callback(null, result.rows);
  } catch (err) {
    console.error('Error al obtener los usuarios:', err);
    callback(err, null);
  }
}

async function verificarCredenciales(usuario, contrasena, callback) {
  try {
    const connection = await db();
    const query = `SELECT * FROM usuario WHERE USUARIO = :usuario AND CONTRASEÑA = :contrasena`;

    const result = await connection.execute(
      query,
      [usuario, contrasena],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    await connection.close();

    callback(null, result.rows.length > 0 ? result.rows[0] : null);
  } catch (err) {
    console.error('Error al verificar credenciales:', err);
    callback(err, null);
  }
}

module.exports = { getUsuarios, verificarCredenciales };
