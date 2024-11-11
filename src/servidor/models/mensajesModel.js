const conectarOracle = require('../db');

async function guardarMensaje(id_usuario, asunto, mensaje) {
    const connection = await conectarOracle();
    const query = `
        INSERT INTO MENSAJE (id_usuario, asunto, mensaje, leido) 
        VALUES (:id_usuario, :asunto, :mensaje, :leido)
    `;
    const params = { id_usuario, asunto, mensaje, leido: 0 };

    try {
        await connection.execute(query, params, { autoCommit: true });
    } catch (error) {
        console.error('Error al guardar el mensaje:', error);
        throw error;
    } finally {
        await connection.close();
    }
}

module.exports = { guardarMensaje };
