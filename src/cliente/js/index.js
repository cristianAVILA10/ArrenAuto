import '../css/style.css';  // Importa el CSS en tu JS

let iframe = document.querySelector('#iframe');
let mis_reservas = document.querySelector('#mis_reservas');
let Vehiculos = document.querySelector('#Vehiculos');
let registro = document.querySelector('#registro');

registro.addEventListener('click', () => {
    console.log(iframe.src);
    iframe.src = '/html/registro.html'
});

mis_reservas.addEventListener('click', () => {
    console.log(iframe.src);
    iframe.src = '/html/usuarios.html'
});


Vehiculos.addEventListener('click', () => {
    console.log(iframe.src);
    iframe.src = '/html/vehiculos.html'
});


