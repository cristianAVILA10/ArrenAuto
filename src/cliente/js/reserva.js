document.addEventListener('DOMContentLoaded', () => {
  // Obtener las reservas desde la API
  fetch('/api/reserva')
    .then(response => {
      console.log('Response:', response); // Imprime la respuesta completa (Response Object)
      return response.json(); // Convertir la respuesta a JSON
    })
    .then(reservas => {
      console.log('Reservas:', reservas); // Verifica que reservas sea un array y tenga más de un elemento

      const container = document.getElementById('reservas-container');
      container.innerHTML = ''; // Limpiar el contenedor de reservas antes de agregar nuevas

      if (Array.isArray(reservas) && reservas.length > 0) {
        // Iterar sobre las reservas y generar las tarjetas
        reservas.forEach(reserva => {
          console.log(reserva); // Verifica los detalles de cada reserva

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
                <strong>Estado:</strong> <span class="estado-reserva">${reserva.ESTADO}</span><br>
              </p>
            </div>
          `;

          // Mostrar el botón "Cancelar" solo si el estado es "Confirmada"
          if (reserva.ESTADO === 'Confirmada') {
            const cancelButton = document.createElement('button');
            cancelButton.textContent = 'Cancelar';
            cancelButton.classList.add('btn', 'btn-danger', 'w-100');
            cancelButton.addEventListener('click', () => confirmarCancelacion(reserva.ID_RESERVA, card, reserva));

            const cardFooter = document.createElement('div');
            cardFooter.classList.add('card-footer', 'text-center');
            cardFooter.appendChild(cancelButton);
            card.appendChild(cardFooter);
          }else if (reserva.ESTADO === 'Pendiente') {
            const alert = document.createElement('div');
            alert.textContent = 'Pendiente por aprobacion del vendedor';
            alert.classList.add('alert', 'alert-warning', 'w-100');
            const cardFooter = document.createElement('div');
            cardFooter.classList.add('card-footer', 'text-center');
            cardFooter.appendChild(alert);
            card.appendChild(cardFooter);
          }
          else if (reserva.ESTADO === 'Cancelada') {
            const alert = document.createElement('div');
            alert.textContent = 'Reserva Cancelada';
            alert.classList.add('alert', 'alert-danger', 'w-100');
            const cardFooter = document.createElement('div');
            cardFooter.classList.add('card-footer', 'text-center');
            cardFooter.appendChild(alert);
            card.appendChild(cardFooter);
          }
          else if (reserva.ESTADO === 'Finalizada') {
            const alert = document.createElement('div');
            alert.textContent = 'Finalizada';
            alert.classList.add('alert', 'alert-secondary', 'w-100');
            const cardFooter = document.createElement('div');
            cardFooter.classList.add('card-footer', 'text-center');
            cardFooter.appendChild(alert);
            card.appendChild(cardFooter);
          }

          // Agregar la tarjeta al contenedor
          container.appendChild(card);
        });
      }else {
        container.innerHTML = "<p>No hay reservas disponibles.</p>";
      }
    })
    .catch(error => console.error('Error al obtener reservas:', error));
});

/**
 * Muestra un diálogo de confirmación antes de cancelar la reserva.
 * @param {number} idReserva - ID de la reserva a cancelar.
 * @param {HTMLElement} card - Elemento de la tarjeta correspondiente.
 * @param {Object} reserva - Objeto de la reserva.
 */
function confirmarCancelacion(idReserva, card, reserva) {
  if (confirm("¿Estás seguro de que deseas cancelar esta reserva?")) {
    cancelarReserva(idReserva, card, reserva);
  }
}

/**
 * Cancela la reserva con el ID especificado y actualiza la interfaz.
 * @param {number} idReserva - ID de la reserva a cancelar.
 * @param {HTMLElement} card - Elemento de la tarjeta correspondiente.
 * @param {Object} reserva - Objeto de la reserva que se está cancelando.
 */
function cancelarReserva(idReserva, card, reserva) {
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

    // Actualizar el estado de la reserva localmente
    const estadoElemento = card.querySelector('.estado-reserva');
    if (estadoElemento) {
      estadoElemento.textContent = 'Pendiente'; // Actualiza el estado en la tarjeta
    }

    // Eliminar el botón de "Cancelar" después de la actualización
    const cancelButton = card.querySelector('.btn-danger');
    if (cancelButton) {
      cancelButton.remove();
    }

    // Mostrar mensaje de éxito
    alert("Reserva cancelada exitosamente.");
  })
  .catch(error => {
    console.error('Error al cancelar la reserva:', error);
    alert("Ocurrió un error al intentar cancelar la reserva.");
  });
}
