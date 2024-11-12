async function obtenerReservas() {
    try {
        const response = await fetch('/api/administrador/reservas');
        
        // Verificar si la respuesta fue exitosa
        if (!response.ok) {
            throw new Error(`Error al obtener las reservas: ${response.statusText}`);
        }

        const reservas = await response.json();
        
        // Verificar si se recibieron reservas
        if (Array.isArray(reservas) && reservas.length > 0) {
            mostrarReservas(reservas);
        } else {
            console.warn('No se encontraron reservas.');
        }
    } catch (error) {
        console.error('Error al obtener las reservas:', error);
    }
}

function mostrarReservas(reservas) {
    const contenedorReservas = document.getElementById('contenedorReservas');
    contenedorReservas.innerHTML = ''; // Limpiar contenido previo

    reservas.forEach(reserva => {
        const reservaHtml = crearTarjetaReserva(reserva);
        contenedorReservas.appendChild(reservaHtml);
    });
}

function crearTarjetaReserva(reserva) {
    const tarjeta = document.createElement('div');
    tarjeta.className = 'col-md-4 mb-3';

    // Asegurarse de que los datos existen antes de usarlos
    const marca = reserva.MARCA || 'Marca desconocida';
    const modelo = reserva.MODELO || 'Modelo desconocido';
    const idReserva = reserva.ID_EST_RESERVA || 'ID desconocido';
    const fechaReserva = reserva.FECHA_RESERVA || 'Fecha no disponible';
    const fechaInicio = reserva.FECHA_INICIO || 'Fecha no disponible';
    const fechaFin = reserva.FECHA_FIN || 'Fecha no disponible';
    const puntoRecogida = reserva.PUNTO_RECOGIDA || 'Punto no disponible';
    const puntoEntrega = reserva.PUNTO_ENTREGA || 'Punto no disponible';
    const nombreUsuario = reserva.NOMBRE_USUARIO || 'Usuario desconocido';

    // Crear tarjeta HTML de la reserva
    tarjeta.innerHTML = `
        <div class="card">
            <img src="/img/${reserva.IMG_VEHICULO}.jpg" alt="${marca}" class="card-img-top">
            <div class="card-body">
                <h5 class="card-title">${marca} ${modelo}</h5>
                <p><strong>ID Reserva:</strong> ${idReserva}</p>
                <p><strong>Fecha Reserva:</strong> ${fechaReserva}</p>
                <p><strong>Fecha Inicio:</strong> ${fechaInicio}</p>
                <p><strong>Fecha Fin:</strong> ${fechaFin}</p>
                <p><strong>Punto de Recogida:</strong> ${puntoRecogida}</p>
                <p><strong>Punto de Entrega:</strong> ${puntoEntrega}</p>
                <p><strong>Estado Reserva:</strong> ${idReserva}</p>
                <p><strong>Nombre Usuario:</strong> ${nombreUsuario}</p>
                <button class="btn btn-success" onclick="cambiarEstadoReserva(${reserva.ID_RESERVA}, 2)">Aceptar</button>
                <button class="btn btn-danger" onclick="cambiarEstadoReserva(${reserva.ID_RESERVA}, 3)">Rechazar</button>
            </div>
        </div>
    `;
    return tarjeta;
}


async function cambiarEstadoReserva(idReserva, nuevoEstado) {
    try {
        const response = await fetch(`/api/administrador/reservas/${idReserva}/estado`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nuevoEstado })
        });

        if (response.ok) {
            alert('Reserva actualizada con éxito.');
            obtenerReservas();
        } else {
            alert('Error al actualizar la reserva.');
        }
    } catch (error) {
        console.error('Error al cambiar el estado de la reserva:', error);
    }
}

document.addEventListener('DOMContentLoaded', obtenerReservas());
