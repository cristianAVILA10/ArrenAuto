import "../css/style.css"; // Importa el CSS en tu JS

let iframe = document.querySelector("#iframe");
let mis_reservas = document.querySelector("#mis_reservas");
let Vehiculos = document.querySelector("#Vehiculos");
let registro = document.querySelector("#registro");
let mensajess = document.querySelector("#mensajess");
let home = document.querySelector("#home");
let salir = document.querySelector("#salir");
let admin = document.querySelector("#admin");
let acceder = document.querySelector("#acceder");



//manejo de sesion
salir.addEventListener("click", () => {
     
  console.log(iframe.src);
  iframe.src = "/html/login.html";
  cerrarSesion();
});

admin.addEventListener("click", () => {
   if (localStorage.getItem("id_tip_usuario") == "2") {
       iframe.src = "/html/administrador.html";
   }else{
    alert('Solo para administradores')
   }
  
});

home.addEventListener("click", () => {
     
  console.log(iframe.src);
  iframe.src = "/html/login.html";
});

registro.addEventListener("click", () => {
     
  console.log(iframe.src);
  iframe.src = "/html/registro.html";
});

mis_reservas.addEventListener("click", () => {
     
  console.log(iframe.src);
  iframe.src = "/html/reserva.html";
});

Vehiculos.addEventListener("click", () => {
     
  console.log(iframe.src);
  iframe.src = "/html/vehiculos.html";
});

mensajess.addEventListener("click", () => {
 
  console.log(iframe.src);
  iframe.src = "/html/mensajes.html";
});

// Función para cerrar sesión
function cerrarSesion() {
  // Borra los datos de la "sesión"
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("id_usuario");
  localStorage.removeItem("id_tip_usuario");
  localStorage.removeItem("usuario");
}

acceder.addEventListener("click", () => {
  console.log(iframe.src);
  iframe.src = "/html/mensajes.html";
});


function isAuthenticated() {
  return localStorage.getItem("isLoggedIn") === "true";
}
