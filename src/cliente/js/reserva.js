document.addEventListener('DOMContentLoaded', cargarReservas);

function cargarReservas() {
  fetch('/api/reserva')
    .then(response => {
      console.log('Response:', response); // Imprime la respuesta completa (Response Object)
      return response.json(); // Convertir la respuesta a JSON
    })
    .then(reservas => {
      console.log('Reservas:', reservas); // Imprime el array de reservas obtenido del JSON

      const container = document.getElementById('reservas-container');
      container.innerHTML = ''; // Limpiar el contenedor de reservas

      reservas.forEach(reserva => {
        console.log(reserva);

        // Crear el elemento de tarjeta y agregar la información de la reserva
        const card = document.createElement('div');
        card.classList.add('card', 'mb-3');
        card.style.width = '18rem';
        card.id = `reserva-${reserva.ID_RESERVA}`;

        card.innerHTML = `
          <img src="/img/${reserva.IMG_VEHICULO}.jpg" class="card-img-top" alt="Imagen del vehículo" style="height:150px; object-fit:cover;">
          <div class="card-body">
            <h5 class="card-title">${reserva.MODELO} | Placa: ${reserva.PLACA}</h5>
            <p class="card-text">
              <strong>Número Reserva:</strong> ${reserva.ID_RESERVA}<br>
              <strong>Fecha Reserva:</strong> ${new Date(reserva.FECHA_RESERVA).toLocaleDateString()}<br>
              <strong>Fecha Inicio:</strong> ${new Date(reserva.FECHA_INICIO).toLocaleDateString()}<br>
              <strong>Fecha Fin:</strong> ${new Date(reserva.FECHA_FIN).toLocaleDateString()}<br>
              <strong>Punto de Recogida:</strong> ${reserva.PUNTO_RECOGIDA}<br>
              <strong>Punto de Entrega:</strong> ${reserva.PUNTO_ENTREGA}<br>
              <strong>Estado:</strong> ${reserva.ESTADO}<br>
            </p>
          </div>
        `;

        // Mostrar el botón "Cancelar" solo si el estado es "Confirmada"
        if (reserva.ESTADO === 'Confirmada') {
          const cancelButton = document.createElement('button');
          cancelButton.textContent = 'Cancelar';
          cancelButton.classList.add('btn', 'btn-danger', 'w-100');
          cancelButton.addEventListener('click', () => confirmarCancelacion(reserva.ID_RESERVA));
          
          const cardFooter = document.createElement('div');
          cardFooter.classList.add('card-footer', 'text-center');
          cardFooter.appendChild(cancelButton);
          card.appendChild(cardFooter);
        }

        container.appendChild(card);
      });
    })
    .catch(error => console.error('Error al obtener reservas:', error));
}

/**
 * Muestra un diálogo de confirmación antes de cancelar la reserva.
 * @param {number} idReserva - ID de la reserva a cancelar.
 */
function confirmarCancelacion(idReserva) {
  if (confirm("¿Estás seguro de que deseas cancelar esta reserva?")) {
    cancelarReserva(idReserva);
  }
}

/**
 * Cancela la reserva con el ID especificado y actualiza la lista de reservas.
 * @param {number} idReserva - ID de la reserva a cancelar.
 */
function cancelarReserva(idReserva) {
  fetch(`/api/reserva/${idReserva}/cancelar`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      estado: 2 // Estado 2 para cancelar
    })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('No se pudo cancelar la reserva');
    }
    return response.json();
  })
  .then(updatedReserva => {
    console.log("Reserva actualizada:", updatedReserva);
    
    // Mostrar mensaje de éxito y recargar la lista de reservas
    alert("Reserva cancelada exitosamente.");
    cargarReservas(); // Vuelve a cargar las reservas sin recargar la página
  })
  .catch(error => {
    console.error('Error al cancelar la reserva:', error);
    alert("Ocurrió un error al intentar cancelar la reserva.");
  });
}
