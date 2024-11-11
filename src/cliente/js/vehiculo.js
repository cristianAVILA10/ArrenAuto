function validarCampos(filtro) {
    return filtro.fechaInicial && filtro.fechaFinal && filtro.horaInicial && filtro.horaFinal;
}

function aplicarFiltroBusqueda() {
    return {
        fechaInicial: document.getElementById("fechaInicial").value,
        fechaFinal: document.getElementById("fechaFinal").value,
        horaInicial: document.getElementById("horaInicial").value,
        horaFinal: document.getElementById("horaFinal").value,
        marca: document.getElementById("marca").value.toLowerCase()
    };
}

function getVehiculos(filtro) {
    const queryString = new URLSearchParams(filtro).toString();
    fetch(`http://localhost:3000/api/vehiculos?${queryString}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("No se pudieron obtener los datos de los vehículos.");
            }
            return response.json();
        })
        .then(data => {
            mostrarResultados(data);
        })
        .catch(error => {
            mostrarError(error.message);
        });
} 


function mostrarResultados(vehiculos) {
    const contenedor = document.getElementById("resultadoVehiculos");
    contenedor.innerHTML = ""; 

    if (vehiculos.length === 0) {
        contenedor.innerHTML = "<p>No se encontraron vehículos disponibles para las opciones seleccionadas.</p>";
        return;
    }

    vehiculos.forEach(vehiculo => {
        const cardHtml = crearCartaVehiculo(vehiculo);
        contenedor.appendChild(cardHtml);
    });
}

function crearCartaVehiculo(vehiculo) {
    const colDiv = document.createElement("div");
    colDiv.className = "col-md-4 mb-3";

    const cardDiv = document.createElement("div");
    cardDiv.className = "card flip-card";

    const flipInnerDiv = document.createElement("div");
    flipInnerDiv.className = "flip-card-inner";

    const frontDiv = document.createElement("div");
    frontDiv.className = "flip-card-front card-body";
    frontDiv.innerHTML = `
        <h5 class="card-title">${vehiculo.nombre}</h5>
        <p class="card-text">Marca: ${vehiculo.marca}</p>
    `;

    const backDiv = document.createElement("div");
    backDiv.className = "flip-card-back card-body";
    backDiv.innerHTML = `
        <h5 class="card-title">${vehiculo.modelo}</h5>
        <p class="card-text">Año: ${vehiculo.anio}</p>
        <p class="card-text">Precio: ${vehiculo.precio}</p>
        <p class="card-text">${vehiculo.descripcion}</p>
        <button class="btn btn-primary mt-2" onclick="mostrarPopupReserva('${vehiculo.id}', '${vehiculo.marca}')">Reservar</button>
    `;

    flipInnerDiv.appendChild(frontDiv);
    flipInnerDiv.appendChild(backDiv);
    cardDiv.appendChild(flipInnerDiv);
    colDiv.appendChild(cardDiv);

    return colDiv;
}

function mostrarPopupReserva(idVehiculo, marcaVehiculo) {
    window.idVehiculoSeleccionado = idVehiculo;
    window.marcaVehiculoSeleccionado = marcaVehiculo;

    document.getElementById("popupReserva").style.display = "block";
}

function cerrarPopupReserva() {
    document.getElementById("popupReserva").style.display = "none";
}

async function reservarVehiculo() {
    const puntoRecogida = document.getElementById("puntoRecogida").value;
    const puntoEntrega = document.getElementById("puntoEntrega").value;
    
    const fechaInicial = document.getElementById("fechaInicial").value;
    const fechaFinal = document.getElementById("fechaFinal").value;
    const horaInicial = document.getElementById("horaInicial").value;
    const horaFinal = document.getElementById("horaFinal").value;
    const idVehiculo = window.idVehiculoSeleccionado;

    const reservaData = {
        idVehiculo,
        fechaInicial,
        fechaFinal,
        horaInicial,
        horaFinal,
        puntoRecogida,
        puntoEntrega
    };

    try {
        const response = await fetch('/api/reservar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reservaData)
        });

        if (response.ok) {
            alert('Reserva realizada con éxito y estado del vehículo actualizado.');
            cerrarPopupReserva();
        } else {
            alert('Hubo un problema con la reserva.');
        }
    } catch (error) {
        console.error('Error al realizar la reserva:', error);
    }
}


function mostrarError(mensaje) {
    const contenedor = document.getElementById("resultadoVehiculos");
    contenedor.innerHTML = `<p class="text-danger">${mensaje}</p>`;
}

document.addEventListener("DOMContentLoaded", function() {

    const botonBuscar = document.getElementById("buscar")
    botonBuscar.addEventListener("click", function() {
        const filtroBusqueda = aplicarFiltroBusqueda();

        if (!validarCampos(filtroBusqueda)) {
            alert("Por favor, completa todos los campos antes de buscar.");
            return; 
        }
        getVehiculos(filtroBusqueda);
    });
});