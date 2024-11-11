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


// Función para insertar un nuevo usuario
async function insertarUsuario(datosUsuario) {
  let connection;  // Definir connection aquí
  console.log('pasa 3.1');
  try {
      connection = await db(); 
      console.log('pasa 3.2');

      const sql = `
          INSERT INTO USUARIO (id_usuario, nombre, apellido, correo, telefono, direccion, usuario, contraseña, id_tip_usuario, fecha_registro)
          VALUES (SEQ_USUARIO.NEXTVAL, :nombre, :apellido, :correo, :telefono, :direccion, :usuario, :password, :id_tip_usuario, SYSTIMESTAMP)
      `;
      console.log('pasa 3.3');
      const binds = {
          nombre: datosUsuario.nombre,
          apellido: datosUsuario.apellido,
          correo: datosUsuario.correo,
          telefono: datosUsuario.telefono,
          direccion: datosUsuario.direccion,
          usuario: datosUsuario.usuario,
          password: datosUsuario.password,
          id_tip_usuario: datosUsuario.id_tip_usuario
      };
      console.log('pasa 3.4');
      const result = await connection.execute(sql, binds, { autoCommit: true });
      console.log('pasa 3.5: ' + result);
      return result;
  } catch (error) {
      console.error("Error al insertar usuario en la base de datos:", error);
      throw error;
  } finally {
      if (connection) { // Asegúrate de que connection esté definida antes de intentar cerrarla
          try {
              await connection.close();
          } catch (err) {
              console.error("Error al cerrar la conexión:", err);
          }
      }
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

module.exports = { getUsuarios, insertarUsuario, verificarCredenciales };

