const form = document.getElementById('messageForm');
const result = document.getElementById('result');

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;

    try {
        const response = await fetch('/api/mensajes/sendMessage', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_usuario: 1, asunto: subject, mensaje: message }),
        });

        const data = await response.json();
        if (response.ok) {
            result.textContent = data.message;
            result.classList.remove('d-none');
            result.classList.add('alert-success');
        } else {
            result.textContent = data.error;
            result.classList.remove('d-none');
            result.classList.add('alert-danger');
        }

        form.reset();
    } catch (error) {
        console.error('Error:', error);
    }
});
