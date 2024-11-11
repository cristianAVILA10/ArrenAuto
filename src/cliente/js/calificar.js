document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const ID_RESERVA = urlParams.get('id');
    
  // Obtener el ID de la reserva
  if (!ID_RESERVA) {
    alert('El ID de la reserva no se capturo');
    return;
  }
    
  // Obtener los datos de la reserva
  fetch(`/api/calificar/${ID_RESERVA}`)
  .then(response => {
    if (!response.ok) {
      throw new Error('No se pudo obtener los datos de la reserva');
    }
    return response.json();
  })
  .then(reserva => {
    if (!reserva) {
      alert('No se pudo encontrar la reserva');
      return;
    }
  
    // Mostrar los datos de la reserva 
    document.querySelector('.card-title').innerHTML = `Calificación del arriendo ${reserva.MODELO} | Placa: ${reserva.PLACA}`;
    document.querySelector('.img_calificacion').src = `/img/${reserva.IMG_VEHICULO}.jpg`;    
    const detallesReserva = `
      <strong>Fecha de Reserva:</strong> ${new Date(reserva.FECHA_RESERVA).toLocaleDateString()} <br>
      <strong>Fecha de Inicio:</strong> ${new Date(reserva.FECHA_INICIO).toLocaleDateString()} <br>
      <strong>Fecha de Fin:</strong> ${new Date(reserva.FECHA_FIN).toLocaleDateString()} <br>
      <strong>Punto de Recogida:</strong> ${reserva.PUNTO_RECOGIDA} <br>
      <strong>Punto de Entrega:</strong> ${reserva.PUNTO_ENTREGA} <br>
    `;
    document.querySelector('#reservation-details').innerHTML = detallesReserva;
  })
  .catch(error => {
    console.error('Error al obtener los datos de la reserva:', error);
    alert('Ocurrió un error al cargar los datos de la reserva');
  });
  
  // Evento de envío de la calificación
  document.getElementById('submit-rating').addEventListener('click', () => {
    const review = document.getElementById('review').value.trim();
    const rating = document.querySelectorAll('.star.selected').length;
  
    // Verificar que se haya ingresado un comentario y una puntuacion
    if (review === '' || rating === 0) {
      alert('Por favor, ingrese un comentario y una calificación');
      return;
    }
  
    // Enviar la calificación
    fetch(`/api/calificar/${ID_RESERVA}/calificar`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        comentario: review,
        puntuacion: rating
      })
    })
    .then(response => {
      console.log('Código de estado de la respuesta:', response.status);
      if (!response.ok) {
        return response.json().then(data => {
          throw new Error(data.message || 'Error desconocido al calificar');
        });
      }
      return response.json();
    })
    .then(data => {
      console.log('Respuesta de la calificación:', data);  
      if (data.redirectTo) {
        window.location.href = data.redirectTo; // Redirige a las reservas del cliente
      } else {
        alert('Ocurrió un error al enviar la calificación');
      }
    })
    .catch(error => {
      console.error('Error:', error);  // Detalle del error
      alert(`Ocurrió un error al enviar la calificación: ${error.message}`);
    });
  });

  // Manejar la selección de estrellas para la calificación
  document.querySelectorAll('.star').forEach(star => {
    star.addEventListener('click', () => {
      const index = Array.from(star.parentNode.children).indexOf(star);
      console.log("Estrella seleccionada en el índice: " + index);
  
      // Cambiar las clases de las estrellas según la selección
      document.querySelectorAll('.star').forEach((s, i) => {
      s.classList.toggle('selected', i <= index);
      });
    });
  });
});
  