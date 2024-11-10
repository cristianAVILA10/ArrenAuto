/*const mysql = require('mysql2');

// Conectar a la base de datos MySQL
const connection = mysql.createConnection({
  host: "localhost",
  database: "vehiculos",
  user: "root",
  password: ""
});

connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos: ', err.stack);
    return;
  }
  console.log('Conexión exitosa a la base de datos');
});

module.exports = connection;
*/
const oracledb = require('oracledb');

// Configura los datos de conexión
const config = {
  user: 'eespinosa',       // Reemplaza por el nombre de usuario de Oracle
  password: 'eespinosa', // Reemplaza por la contraseña de Oracle
  connectString: '190.60.231.121:8080/isispdb.utadeo.edu.co' // XE es el nombre de la base de datos predeterminada en Oracle Express, cámbialo si es diferente
};

async function conectarOracle() {
  try {
    const connection = await oracledb.getConnection(config);
    console.log('Conexión exitosa a la base de datos Oracle');
    return connection;
  } catch (err) {
    console.error('Error al conectar a la base de datos:', err);
  }
}

module.exports = conectarOracle;
