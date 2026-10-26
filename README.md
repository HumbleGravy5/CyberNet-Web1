# CyberNet - Sistema de Gestión de Cibercafé (Tarea 2)

**Integrantes:** Daniel Aedo Guerra, Maximiliano González Torres  
**Proyecto seleccionado:** Sistema de gestión de un cibercafé

## 1. Descripción del proyecto
Aplicación web frontend para gestionar un cibercafé. Permite a los clientes ver equipos disponibles, buscarlos en tiempo real, recargar saldo y reservarlos. Incluye también paneles operativos y de administración para iniciar/cobrar sesiones, editar tarifas y gestionar el mantenimiento de equipos sin recargar la página.

## 2. Tecnologías y forma de incorporar Alpine.js
* **Tecnologías:** HTML5, CSS3, JavaScript (ES6+) y archivos JSON estáticos.
* **Alpine.js:** Incorporado mediante enlace CDN (`https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js`) con `defer`. El estado y los métodos se manejan mediante funciones en archivos JS externos (`panelReserva()`, `panelOperativo()` y `panelAdmin()`) conectadas con `x-data`.

## 3. Estructura de carpetas
```text
CyberNet/
├── index.html, login.html, registro.html    # Vistas de inicio y acceso
├── reserva.html / reserva.js                # Vista de cliente (Alpine.js)
├── paneldecontrol.html / script.js          # Vista operativa de sala (Alpine.js)
├── admin.html / admin.js                    # Vista de administración (Alpine.js)
├── equipos.json, tarifas.json, usuario.json # Archivos de datos JSON
├── style.css                                # Hoja de estilos responsiva
└── img/Logo.jpg                             # Logotipo
```

## 4. Funcionalidades agregadas en la Tarea 2
* Carga de datos desde archivos JSON usando `fetch()` al iniciar cada componente (`init()`).
* Listado dinámico de computadores y tarifas con `x-for` y `:key`.
* Buscador en tiempo real con `x-model` (filtra en memoria sin distinguir mayúsculas/minúsculas).
* Botón con `x-show` para mostrar/ocultar las instrucciones de reserva.
* Formularios interactivos con `x-model` y `@submit.prevent` (recarga de saldo y edición de tarifas) con validación de campos y mensajes de estado.
* Mensajes diferenciados para los estados: *Cargando*, *Error de carga* y *Sin resultados*.

## 5. Ubicación y estructura de los archivos JSON
Ubicados en la raíz del proyecto con rutas relativas:
* **`equipos.json`:** Contiene el arreglo `equipos` con `id_equipo` (ID único), `tipo` (categoría), `precio`, `estado` (`disponible`, `ocupado`, `mantenimiento`) y `especificaciones` (`cpu`, `ram`, `gpu`).
* **`tarifas.json`:** Arreglo `tarifas` con `id_tarifa`, `descripcion`, `precio`, `moneda` y `minutos`.
* **`usuario.json`:** Usuarios ficticios de prueba con `id_user`, `username`, `password`, `rol` y `nombre`.

## 6. Flujo de carga y filtrado de datos
1. Al abrir `reserva.html`, la función `init()` ejecuta `fetch('equipos.json')` y guarda los datos en el arreglo reactivo `this.equipos`.
2. El buscador usa `x-model="busqueda"`.
3. La propiedad `equiposFiltrados` filtra `this.equipos` en memoria usando `.toLowerCase().includes()`, actualizando la vista mientras el usuario escribe sin volver a solicitar el JSON. Al limpiar el campo, se muestra toda la lista nuevamente.

## 7. Instrucciones de prueba
*(Acceso en `login.html`: Cliente `Teo` / `1234` | Admin `Drella` / `sambuka`, o entrar directo a `reserva.html`)*
* **Listado y búsqueda:** En `reserva.html`, escribir en el buscador `"PC-01"`, `"office"` o `"disponible"` para filtrar, o `"xyz"` para ver el mensaje de búsqueda sin coincidencias.
* **Sección mostrar/ocultar (`x-show`):** En `reserva.html`, hacer clic en el botón **"Instrucciones de Reserva"** para desplegar u ocultar la ayuda.
* **Formulario interactivo:** En *"Recargar Saldo"* (`reserva.html`), enviar el formulario vacío o con un monto menor a $1000 para ver el mensaje de error; luego ingresar `5000` y seleccionar un método de pago para ver el mensaje de éxito y cómo sube el saldo.

## 8. Cómo comprobar el estado de error de carga
1. En `reserva.js` (línea 46), cambiar temporalmente `fetch('equipos.json')` por `fetch('error.json')` (o renombrar el archivo `equipos.json`).
2. Recargar `reserva.html` y verificar que aparece en pantalla el cuadro de error rojo indicando que no se pudieron cargar los datos.

## 9. Dirección pública en AWS
* **Elastic IP:** `54.164.207.243`
* **Sitio Web:** `http://54.164.207.243/`
* **Archivo JSON público:** `http://54.164.207.243/equipos.json`

## 10. Limitaciones conocidas
* **Pérdida de datos al recargar:** No hay backend ni base de datos. Las recargas de saldo, reservas, cobros y cambios de tarifas ocurren solo en la memoria del navegador y **se pierden al recargar la página (F5)**.
* **Uso de `localStorage`:** Se usa solo para recordar el nombre del usuario activo en ese navegador local, no en el servidor.
* **Seguridad:** Los archivos JSON son públicos y las validaciones u ocultamiento con Alpine.js en el navegador son solo demostrativas; **no implementan seguridad ni autenticación real**.