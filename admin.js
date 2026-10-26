function panelAdmin() {
    return {
        tarifas: [],
        equipos: [],
        cargando: true,
        mensajeError: '',
        mensajeTarifa: '',
        errorTarifa: false,

        async init() {
            try {
                // 1. Cargar Equipos desde localStorage o equipos.json
                const equiposGuardados = localStorage.getItem('equiposActualizados');
                if (equiposGuardados) {
                    this.equipos = JSON.parse(equiposGuardados);
                } else {
                    const respEquipos = await fetch('equipos.json', { cache: 'no-store' });
                    if (!respEquipos.ok) throw new Error("No se pudo cargar equipos.json");
                    const datosEquipos = await respEquipos.json();

                    // Detecta automáticamente si dentro de equipos.json dice "servicios.equipos" o directo "equipos"
                    this.equipos = datosEquipos.servicios ? datosEquipos.servicios.equipos : datosEquipos.equipos;
                }

                // 2. Cargar Tarifas desde localStorage o tarifas.json
                const tarifasGuardadas = localStorage.getItem('tarifasActualizadas');
                if (tarifasGuardadas) {
                    this.tarifas = JSON.parse(tarifasGuardadas);
                } else {
                    const respTarifas = await fetch('tarifas.json', { cache: 'no-store' });
                    if (!respTarifas.ok) throw new Error("No se pudo cargar tarifas.json");
                    const datosTarifas = await respTarifas.json();
                    this.tarifas = datosTarifas.tarifas;
                }

            } catch (error) {
                console.error("Error en panelAdmin:", error);
                this.mensajeError = "Error al leer equipos.json o tarifas.json. Verifica que estés usando Live Server.";
            } finally {
                this.cargando = false;
            }
        },

        // Validar y guardar las nuevas tarifas
        guardarTarifas() {
            const tarifaInvalida = this.tarifas.some(t => !t.precio || isNaN(t.precio) || Number(t.precio) <= 0);

            if (tarifaInvalida) {
                this.errorTarifa = true;
                this.mensajeTarifa = "Datos inválidos: Todas las tarifas deben tener un precio mayor a $0.";
                return;
            }

            // Actualizar el precio de los equipos según su categoría exacta
            this.equipos.forEach(pc => {
                const tipoPC = pc.tipo.toLowerCase();

                const tarifaRelacionada = this.tarifas.find(t =>
                    t.descripcion.toLowerCase().includes(tipoPC)
                );

                if (tarifaRelacionada) {
                    pc.precio = Number(tarifaRelacionada.precio);
                }
            });

            // Guardar cambios en localStorage
            localStorage.setItem('tarifasActualizadas', JSON.stringify(this.tarifas));
            localStorage.setItem('equiposActualizados', JSON.stringify(this.equipos));

            this.errorTarifa = false;
            this.mensajeTarifa = "¡Envío válido! Tarifas actualizadas y sincronizadas con los equipos.";
        },

        // Alternar entre 'mantenimiento' y 'disponible'
        cambiarEstadoMantenimiento(pc) {
            if (pc.estado === 'mantenimiento') {
                pc.estado = 'disponible';
            } else if (pc.estado === 'disponible') {
                pc.estado = 'mantenimiento';
            }

            localStorage.setItem('equiposActualizados', JSON.stringify(this.equipos));
        },

        // Limpiar memoria para recargar los estados originales de equipos.json
        restaurarDatosOriginales() {
            localStorage.removeItem('equiposActualizados');
            localStorage.removeItem('tarifasActualizadas');
            window.location.reload();
        },

        cerrarSesion() {
            localStorage.removeItem('usuarioActivo');
        }
    };
}