function loginForm() {
    return {
        inputUsuario: '',
        inputPassword: '',

        iniciarSesion() {
            // 1. Usamos fetch para LEER el archivo JSON externo
            fetch('usuario.json')
                .then(respuesta => respuesta.json()) // Lo convertimos a formato JavaScript
                .then(baseDatos => {

                    // 2. Ahora "baseDatos" contiene todo lo que está en tu archivo usuario.json
                    const usuarioValidado = baseDatos.usuario.users.find(
                        user => user.username === this.inputUsuario && user.password === this.inputPassword
                    );

                    // 3. Tomamos la decisión
                    if (usuarioValidado) {
                        // Guardamos los datos en el navegador
                        localStorage.setItem('usuarioActivo', JSON.stringify(usuarioValidado));

                        // Evaluamos el rol para saber a qué página enviarlo
                        if (usuarioValidado.rol === "cliente") {

                            // Si es cliente, va a la página de reservas
                            alert(`Bienvenido ${usuarioValidado.nombre}`);
                            window.location.href = "reserva.html";

                        } else if (usuarioValidado.rol === "administrador" || usuarioValidado.rol === "cajero") {

                            // Si es staff del cibercafé, va al panel de control
                            alert(`Acceso concedido al sistema (${usuarioValidado.rol})`);
                            window.location.href = "paneldecontrol.html";

                        } else {
                            // Por si hay algún rol no reconocido en el JSON
                            alert("Error: Tu usuario no tiene un rol válido asignado.");
                        }

                    } else {
                        alert("Error: Usuario o contraseña incorrectos.");
                    }

                })
                .catch(error => {
                    console.error("No se pudo leer el archivo JSON:", error);
                    alert("Error del sistema: No se pudo cargar la base de datos.");
                });
        }
    };
}