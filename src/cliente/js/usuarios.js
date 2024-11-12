document.addEventListener('DOMContentLoaded', () => {//esto es para que cargue el js hasta se cargue el html completo
  fetch('/api/usuarios') //con feth se llaman los servicios desde el js del cliente
    .then(response => {
      console.log('Response:', response);  // Imprime la respuesta completa (Response Object)
      return response.json();  // Convertir la respuesta a JSON
    })
    .then(usuarios => {
      console.log('Usuarios:', usuarios);  // Imprime el array de usuarios obtenido del JSON

      const list = document.getElementById('usuarios-list');//lama al contenedor usuarios-list que debe estar en el html
      usuarios.forEach(usuario => {//itera sobre la respuest JSON
        console.log(usuario);
        
        const li = document.createElement('li');//crea una lista
        li.textContent = `${usuario.NOMBRE}, ${usuario.APELLIDO}, ${usuario.CORREO}`;//añade contenido a la lista segun se va iterando
        list.appendChild(li);//inserta la lista creada en el contenedor que ya está creado en el html
      });
    })
    .catch(error => console.error('Error al obtener usuarios:', error));//devulve un error si no puede hacer la solicitud del servicio
});