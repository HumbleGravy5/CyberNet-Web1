function panelOperativo() {
    return {
        equipos: [],
        historial: [],
        totalRecaudado: 0,
        cargando: true,
        mensajeError: '',

        get equiposDisponibles() {
            return this.equipos.filter(pc => pc.estado === 'Libre').length;
        },

        get sesionesActivas() {
            return this.equipos.filter(pc => pc.estado === 'Ocupado').length;
        },

        async init() {
            try {
                // Si el admin actualizó equipos en localStorage, los usamos; si no, leemos equipos.json
                const guardados = localStorage.getItem('equiposActualizados');
                let listaBase = [];

                if (guardados) {
                    listaBase = JSON.parse(guardados);
                } else {
                    const respuesta = await fetch('equipos.json', { cache: 'no-store' });
                    if (!respuesta.ok) throw new Error("No se encontró equipos.json");
                    const baseDatos = await respuesta.json();
                    listaBase = baseDatos.equipos;
                }

                this.equipos = listaBase.map(pc => {
                    const estaOcupado = pc.estado.toLowerCase() === 'ocupado';
                    return {
                        ...pc,
                        estado: estaOcupado ? 'Ocupado' : 'Libre',
                        cliente: estaOcupado ? (pc.cliente || 'Cliente') : '-',
                        minutos: estaOcupado ? (pc.minutos || 60) : 0,
                        tiempoTexto: estaOcupado ? `${pc.minutos || 60} min` : '-'
                    };
                });

            } catch (error) {
                console.error("Error cargando equipos.json:", error);
                this.mensajeError = "Error al conectar con equipos.json. Asegúrate de usar Live Server.";
            } finally {
                this.cargando = false;
            }
        },

        cambiarEstado(pc) {
            if (pc.estado === 'Libre') {
                this.iniciar(pc);
            } else {
                this.cobrar(pc);
            }
        },

        iniciar(pc) {
            const nombreCliente = prompt(`Ingrese el nombre del cliente para ${pc.id_equipo}:`);
            if (!nombreCliente || nombreCliente.trim() === '') return;

            const minutosInput = prompt("Ingrese el tiempo en minutos (Ej: 45):", "60");
            if (minutosInput === null) return;
            const minutos = parseInt(minutosInput) || 60;

            pc.cliente = nombreCliente.trim();
            pc.minutos = minutos;
            pc.tiempoTexto = `${minutos} min`;
            pc.estado = 'Ocupado';
        },

        cobrar(pc) {
            const costoTiempo = Math.round((pc.precio / 60) * pc.minutos);

            const extraInput = prompt(
                `Cobro para ${pc.cliente} en ${pc.id_equipo}\n` +
                `Tiempo: ${pc.tiempoTexto} ($${costoTiempo})\n\n` +
                `Ingrese monto por equipos extra (o deje 0):`,
                "0"
            );
            if (extraInput === null) return;

            const montoExtra = parseInt(extraInput) || 0;
            const totalPagar = costoTiempo + montoExtra;

            this.totalRecaudado += totalPagar;

            this.historial.push({
                cliente: pc.cliente,
                computador: `${pc.id_equipo} (${pc.tipo})`,
                tiempo: pc.tiempoTexto,
                extra: montoExtra > 0 ? `$${montoExtra}` : 'Ninguno',
                total: totalPagar
            });

            pc.cliente = '-';
            pc.minutos = 0;
            pc.tiempoTexto = '-';
            pc.estado = 'Libre';
        },

        cerrarSesion() {
            localStorage.removeItem('usuarioActivo');
        }
    };
}


document.addEventListener('DOMContentLoaded', () => {
    const botonMenu = document.getElementById('botonMenu');
    const menuNavegacion = document.getElementById('menuNavegacion');

    if (botonMenu && menuNavegacion) {
        botonMenu.addEventListener('click', () => {
            menuNavegacion.classList.toggle('activo');
            menuNavegacion.classList.toggle('mostrar');
            menuNavegacion.classList.toggle('active');
        });
    }
});