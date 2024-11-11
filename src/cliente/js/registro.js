document.addEventListener("DOMContentLoaded", () => {
  const btn_registra = document.getElementById("btn_registra");
  const selectTipoUsuario = document.getElementById("tip_usuario");

  // Función para mostrar mensajes de éxito o error
  function mostrarNotificacion(mensaje, tipo = "exito") {
    const notificacion = document.createElement("div");
    notificacion.className = tipo === "exito" ? "notificacion-exito" : "notificacion-error";
    notificacion.textContent = mensaje;
    document.body.appendChild(notificacion);
    setTimeout(() => notificacion.remove(), 3000); // Ocultar después de 3 segundos
  }

  btn_registra.addEventListener("click", async (event) => {
    event.preventDefault(); // Prevenir el envío del formulario

    // Validar campos obligatorios
    const nombre = document.getElementById("nombre").value.trim();
    const apellido = document.getElementById("apellido").value.trim();
    const usuario = document.getElementById("usuario").value.trim();
    const correo = document.getElementById("correo").value.trim();
    const password = document.getElementById("password").value.trim();
    const telefono = document.getElementById("telefono")?.value.trim();
    const direccion = document.getElementById("direccion")?.value.trim();
    const id_tip_usuario = selectTipoUsuario.value;

    if (!nombre || !apellido || !usuario || !correo || !password || !id_tip_usuario) {
      mostrarNotificacion("Por favor, completa todos los campos obligatorios.", "error");
      return;
    }

    // Crear objeto de datos para enviar
    const datosUsuario = {
      nombre,
      apellido,
      correo,
      telefono,
      direccion,
      usuario,
      password,
      id_tip_usuario,
    };

    console.log("Enviando datos:", JSON.stringify(datosUsuario));

    // Llamada al servicio POST para insertar el usuario
    try {
      const response = await fetch("http://localhost:3000/api/usuarios/registrar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datosUsuario),
      });

      if (!response.ok) throw new Error("Error en el registro");

      const data = await response.json();
      mostrarNotificacion("Usuario registrado exitosamente");
      console.log(data);
    } catch (error) {
      console.error("Hubo un problema con el registro:", error);
      mostrarNotificacion("Error en el registro", "error");
    }
  });
});
