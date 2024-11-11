document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const usuarioInput = document.getElementById("usuario");
  const passwordInput = document.getElementById("password");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const usuario = usuarioInput.value;
    const password = passwordInput.value;

    try {
      const response = await fetch("http://localhost:3000/api/usuarios/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario, contrasena: password }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Login exitoso");
        iniciarSesion(data.usuario);
        window.location.href = "/html/vehiculos.html";
      } else {
        alert(data.message || "Usuario o contraseña incorrectos");
      }
    } catch (error) {
      console.error("Error en el login:", error);
    }
  });
});

function iniciarSesion(usuario) {
  console.log('usuario: ' + usuario);
  
  // Guarda el estado de sesión en localStorage
  localStorage.setItem("isLoggedIn", "true");
  localStorage.setItem("id_usuario", usuario.ID_USUARIO);
  localStorage.setItem("id_tip_usuario", usuario.ID_TIP_USUARIO);
  localStorage.setItem("usuario", usuario.USUARIO);
}
