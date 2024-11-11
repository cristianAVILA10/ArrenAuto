document.addEventListener('DOMContentLoaded', () => {
  fetch('/api/usuarios')
    .then(response => {
      console.log('Response:', response);  // Imprime la respuesta completa (Response Object)
      return response.json();  // Convertir la respuesta a JSON
    })
    .then(usuarios => {
      console.log('Usuarios:', usuarios);  // Imprime el array de usuarios obtenido del JSON

      const list = document.getElementById('usuarios-list');
      usuarios.forEach(usuario => {
        console.log(usuario);
        
        const li = document.createElement('li');
        li.textContent = `${usuario.NOMBRE}, ${usuario.APELLIDO}, ${usuario.CORREO}`;
        list.appendChild(li);
      });
    })
    .catch(error => console.error('Error al obtener usuarios:', error));
});