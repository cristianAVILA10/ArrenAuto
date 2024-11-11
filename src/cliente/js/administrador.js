async function obtenerReservas() {
    try {
        const response = await fetch('/api/administrador/reservas');
        const reservas = await response.json();
        mostrarReservas(reservas);
    } catch (error) {
        console.error('Error al obtener las reservas:', error);
    }
}

function mostrarReservas(reservas) {
    const contenedorReservas = document.getElementById('contenedorReservas');
    contenedorReservas.innerHTML = '';

    reservas.forEach(reserva => {
        const reservaHtml = crearTarjetaReserva(reserva);
        contenedorReservas.appendChild(reservaHtml);
    });
}

function crearTarjetaReserva(reserva) {
    const tarjeta = document.createElement('div');
    tarjeta.className = 'col-md-4 mb-3';

    tarjeta.innerHTML = `
        <div class="card">
            <img src="ruta_imagen/${reserva.marca}.jpg" alt="${reserva.marca}" class="card-img-top">
            <div class="card-body">
                <h5 class="card-title">${reserva.marca} ${reserva.modelo}</h5>
                <p><strong>ID Reserva:</strong> ${reserva.id_reserva}</p>
                <p><strong>Fecha Reserva:</strong> ${reserva.fecha_reserva}</p>
                <p><strong>Fecha Inicio:</strong> ${reserva.fecha_inicio}</p>
                <p><strong>Fecha Fin:</strong> ${reserva.fecha_fin}</p>
                <p><strong>Punto de Recogida:</strong> ${reserva.punto_recogida}</p>
                <p><strong>Punto de Entrega:</strong> ${reserva.punto_entrega}</p>
                <p><strong>Estado Reserva:</strong> ${reserva.id_estado_reserva}</p>
                <p><strong>Nombre Usuario:</strong> ${reserva.nombre_usuario}</p>
                <button class="btn btn-success" onclick="cambiarEstadoReserva(${reserva.id_reserva}, 2)">Aceptar</button>
                <button class="btn btn-danger" onclick="cambiarEstadoReserva(${reserva.id_reserva}, 3)">Rechazar</button>
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

document.addEventListener('DOMContentLoaded', obtenerReservas);
