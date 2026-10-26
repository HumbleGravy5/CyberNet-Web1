function panelReserva() {
    return {
        // --- Variables de Estado ---
        usuario: {
            nombre: "Invitado",
            saldo: 15000
        },
        equipos: [],
        cargando: true,
        mensajeError: '',
        busqueda: '',

        formRecarga: {
            monto: '',
            metodo: '',
            mensaje: '',
            esError: false
        },

        // --- Filtro de Búsqueda en Tiempo Real ---
        get equiposFiltrados() {
            if (this.busqueda.trim() === '') {
                return this.equipos;
            }
            const termino = this.busqueda.toLowerCase();
            return this.equipos.filter(pc => {
                return pc.id_equipo.toLowerCase().includes(termino) ||
                        pc.tipo.toLowerCase().includes(termino) ||
                        pc.estado.toLowerCase().includes(termino);
            });
        },

        // --- Inicialización Automática ---
        async init() {
            // Recuperar usuario del Login
            const usuarioGuardado = localStorage.getItem('usuarioActivo');
            if (usuarioGuardado) {
                try {
                    const datos = JSON.parse(usuarioGuardado);
                    this.usuario.nombre = datos.nombre || datos.username || "Cliente";
                } catch (e) {
                    console.error("Error leyendo usuarioActivo:", e);
                }
            }

            // Cargar los equipos directamente desde equipos.json
            try {
                const respuesta = await fetch('equipos.json', { cache: 'no-store' });

                if (!respuesta.ok) {
                    throw new Error("No se encontró el archivo equipos.json");
                }

                const baseDatos = await respuesta.json();
                this.equipos = baseDatos.equipos;

            } catch (err) {
                console.error("Error al cargar equipos.json:", err);
                this.mensajeError = "No se pudieron cargar los equipos desde equipos.json. Verifica que estés usando Live Server y que el JSON no tenga errores de sintaxis.";
            } finally {
                this.cargando = false;
            }
        },

        procesarRecarga() {
            // Validar campos requeridos y monto mínimo
            if (!this.formRecarga.monto || this.formRecarga.monto < 1000) {
                this.formRecarga.esError = true;
                this.formRecarga.mensaje = "Datos inválidos: Debes ingresar un monto mínimo de $1000.";
                return;
            }

            if (this.formRecarga.metodo === '') {
                this.formRecarga.esError = true;
                this.formRecarga.mensaje = "Datos inválidos: Selecciona un método de pago.";
                return;
            }

            // Si todo es válido, sumamos el saldo y mostramos mensaje de éxito
            this.usuario.saldo += Number(this.formRecarga.monto);
            this.formRecarga.esError = false;
            this.formRecarga.mensaje = `¡Recarga exitosa! Se abonaron $${this.formRecarga.monto} mediante ${this.formRecarga.metodo}.`;

            // Limpiamos los campos del formulario
            this.formRecarga.monto = '';
            this.formRecarga.metodo = '';
        },

        // --- 4. Acciones de los Botones ---
        reservar(pc) {
            if (this.usuario.saldo >= pc.precio) {
                this.usuario.saldo -= pc.precio;
                pc.estado = "ocupado";
                alert(`✅ Has reservado exitosamente el ${pc.id_equipo} (${pc.tipo}).`);
            } else {
                alert(`❌ Saldo insuficiente. El equipo cuesta $${pc.precio} y tienes $${this.usuario.saldo}`);
            }
        },

        cerrarSesion() {
            localStorage.removeItem('usuarioActivo');
            window.location.href = "login.html";
        }
    };
}