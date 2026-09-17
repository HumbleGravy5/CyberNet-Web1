let totalCaja = 0;
let tarifaPorMinuto = 250; // $15.000 la hora

// hamburguesa desplegable
const botonMenu = document.getElementById('botonMenu');
const menuNavegacion = document.getElementById('menuNavegacion');

if (botonMenu && menuNavegacion) {
    botonMenu.addEventListener('click', function() {
        menuNavegacion.classList.toggle('mostrar');
    });
}

// iniciar sesion
function iniciar(boton) {
    let nombreCliente = prompt("Nombre del cliente para este equipo:");
    
    if (nombreCliente) {
        let caja = boton.parentElement;
        caja.classList.add("fondo-cafe");
        
        // Guardamos la hora actual en el HTML de la caja y los extras en 0
        caja.setAttribute("data-inicio", Date.now());
        caja.setAttribute("extras", "0");
        
        let parrafos = caja.querySelectorAll("p");
        parrafos[0].innerText = "Cliente: " + nombreCliente;
        parrafos[1].innerText = "Tiempo: Sesión iniciada";
        parrafos[2].innerText = "Estado: Ocupado";
        
        boton.innerText = "Cobrar y Finalizar";
        boton.setAttribute("onclick", "cobrar(this)");

        // Creamos un botón nuevo para agregar servicios adicionales
        let btnServicio = document.createElement("button");
        btnServicio.innerText = "+ Agregar Servicio";
        btnServicio.className = "btn-servicio";
        btnServicio.onclick = function() { agregarServicio(caja); };
        caja.appendChild(btnServicio);
    }
}

// 2. servicios de Impresion o Snacks
function agregarServicio(caja) {
    let montoServicio = prompt("Ingrese el valor del servicio adicional (Ej: 300 para impresión):", "0");
    if (montoServicio !== null && montoServicio !== "") {
        let extrasActuales = parseInt(caja.getAttribute("extras"));
        let nuevoTotalExtras = extrasActuales + parseInt(montoServicio);
        caja.setAttribute("extras", nuevoTotalExtras);
        alert("Servicio de $" + montoServicio + " agregado a la cuenta.");
    }
}

// 3. COBRAR, CALCULAR Y ENVIAR AL HISTORIAL
function cobrar(boton) {
    let caja = boton.parentElement;
    
    let minutosUso = 0;
    let tiempoInicio = caja.getAttribute("data-inicio");
    
    if (tiempoInicio) {
        // Si el PC se inició recién haciendo clic en "Iniciar", calculamos el tiempo real
        let tiempoFin = Date.now();
        minutosUso = Math.floor((tiempoFin - tiempoInicio) / 60000); 
    } else {
        // Si el PC ya venía ocupado desde el HTML, leemos el número oculto que le pusimos
        let minPredefinidos = caja.getAttribute("data-minutos");
        if (minPredefinidos) {
            minutosUso = parseInt(minPredefinidos);
        } else {
            minutosUso = 45; // Por si se nos olvida ponerle el número a alguno
        }
    }
    
    if (minutosUso < 1) minutosUso = 1; // Cobro mínimo
    
    let cobroTiempo = minutosUso * tarifaPorMinuto;
    let extras = parseInt(caja.getAttribute("data-extras") || "0");
    let totalPagar = cobroTiempo + extras;

    // Confirmación (Regla de negocio: monto no negativo y cálculo automático)
    if (confirm(`RESUMEN DE COBRO:\n- Tiempo (${minutosUso} min): $${cobroTiempo}\n- Extras: $${extras}\nTOTAL: $${totalPagar}\n\n¿Finalizar sesión?`)) {
        
        // Sumar al total
        totalCaja += totalPagar;
        document.getElementById("total-recaudado").innerText = totalCaja;
        
        // Registrar en el historial
        let nombreCliente = caja.querySelectorAll("p")[0].innerText.replace("Cliente: ", "");
        let nombrePC = caja.querySelector("h4").innerText;
        let tablaHistorial = document.getElementById("cuerpo-historial");
        
        // Crear nueva fila en la tabla
        let nuevaFila = `<tr>
            <td>${nombreCliente}</td>
            <td>${nombrePC}</td>
            <td>${minutosUso} min</td>
            <td>$${extras}</td>
            <td><strong>$${totalPagar}</strong></td>
        </tr>`;
        tablaHistorial.innerHTML += nuevaFila;
        
        // Formatear PC a estado Libre
        caja.classList.remove("fondo-cafe");
        let parrafos = caja.querySelectorAll("p");
        parrafos[0].innerText = "Cliente: -";
        parrafos[1].innerText = "Tiempo: -";
        parrafos[2].innerHTML = 'Estado: <span class="texto-verde">Libre</span>';
        
        boton.innerText = "Iniciar";
        boton.setAttribute("onclick", "iniciar(this)");
        
        // Borrar el botón de servicios extra
        let btnServicio = caja.querySelector(".btn-servicio");
        if (btnServicio) caja.removeChild(btnServicio);
    }
}