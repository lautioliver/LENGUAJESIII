/**
 * app.js — Gestor de Tareas de Proyecto (TP6)
 * Lenguajes III · UCASAL · 2026
 *
 * Lógica principal de la aplicación. Maneja el ciclo completo de una tarea:
 * captura desde el formulario, inserción en DataTables, y eliminación con animación.
 *
 * Decisiones clave:
 *  - Se usa DataTables (no manipulación manual del DOM) porque la consigna lo pide
 *    explícitamente. Esto tiene un tradeoff: DataTables redibujan el DOM en cada
 *    draw(), lo que puede interferir con animaciones jQuery. Por eso el fadeIn()
 *    se hace DESPUÉS del draw y el fadeOut() ANTES del remove.
 *  - El evento 'click' en .btn-eliminar se delega al tbody porque las filas
 *    se crean dinámicamente y no existen en el DOM al momento del bind.
 *  - El cambio de color del título usa .css() directamente en vez de clases CSS
 *    para mantenerlo lo más simple posible (un solo color, sin ciclos).
 *
 * Dependencias: jQuery 3.7+, DataTables 1.13+
 */

$(document).ready(function () {

    // ─── DataTable ──────────────────────────────────────────────────────────────
    // Se localiza al español y se deshabilita el sort en la columna de acciones
    // (no tiene sentido ordenar por botones).
    var tabla = $('#tablaTareas').DataTable({
        language: {
            search: "Buscar:",
            lengthMenu: "Mostrar _MENU_ tareas",
            info: "Mostrando _START_ a _END_ de _TOTAL_ tareas",
            infoEmpty: "Sin tareas",
            infoFiltered: "(filtrado de _MAX_ tareas totales)",
            zeroRecords: "No se encontraron tareas",
            emptyTable: "No hay tareas cargadas. ¡Agregá una!",
            paginate: { first: "«", last: "»", next: "›", previous: "‹" }
        },
        columnDefs: [
            { orderable: false, targets: 2 }
        ],
        order: [[0, 'asc']],
        pageLength: 10,
        dom: '<"top"lf>rt<"bottom"ip>'
    });

    // ─── Helpers ────────────────────────────────────────────────────────────────

    /**
     * Actualiza el badge con la cantidad de tareas.
     * Distingue singular/plural porque "1 tareas" se ve mal.
     */
    function actualizarContador() {
        var count = tabla.rows().count();
        $('#taskCount').text(count + (count === 1 ? ' tarea' : ' tareas'));
    }

    /**
     * Muestra una notificación flotante abajo a la derecha.
     * Se destruye la anterior antes de crear una nueva para evitar acumulación.
     *
     * @param {string} mensaje - Texto a mostrar
     * @param {string} tipo    - 'success' o 'error' (determina el color del borde)
     */
    function mostrarToast(mensaje, tipo) {
        $('.toast').remove();

        var toast = $('<div>')
            .addClass('toast toast-' + tipo)
            .text(mensaje)
            .appendTo('body');

        // El delay de 50ms es necesario para que el browser registre el elemento
        // en el DOM antes de aplicar la transición CSS (si no, no anima).
        setTimeout(function () { toast.addClass('show'); }, 50);

        setTimeout(function () {
            toast.removeClass('show');
            // Espera a que termine la transición de salida (300ms) antes de borrar del DOM
            setTimeout(function () { toast.remove(); }, 300);
        }, 2500);
    }

    /**
     * Genera el HTML del badge de prioridad.
     * Cada prioridad tiene su propia clase CSS que define color y fondo.
     *
     * @param {string} prioridad - 'Alta', 'Media', o 'Baja'
     * @returns {string} HTML del badge
     */
    function crearBadgePrioridad(prioridad) {
        var clases = {
            'Alta': 'priority-alta',
            'Media': 'priority-media',
            'Baja': 'priority-baja'
        };
        return '<span class="priority-badge ' + clases[prioridad] + '">'
            + '● ' + prioridad + '</span>';
    }

    // ─── Agregar tarea ─────────────────────────────────────────────────────────
    // Se capturan los valores con val() y se valida que el nombre no esté vacío
    // antes de insertar en DataTables.

    $('#formTarea').on('submit', function (e) {
        e.preventDefault();

        var nombre = $('#nombreTarea').val().trim();
        var prioridad = $('#prioridadTarea').val();

        // Validación: nombre obligatorio
        if (nombre === '') {
            $('#nombreTarea').addClass('input-error');
            $('#errorNombre').text('El nombre de la tarea es obligatorio.').show();
            mostrarToast('Completá el nombre de la tarea', 'error');
            return;
        }

        // Limpiar estado de error previo
        $('#nombreTarea').removeClass('input-error');
        $('#errorNombre').text('').hide();

        // Insertar fila. draw(false) evita que DataTables vuelva a la página 1.
        var fila = tabla.row.add([
            nombre,
            crearBadgePrioridad(prioridad),
            '<button class="btn-eliminar" type="button">✕ Eliminar</button>'
        ]).draw(false);

        // fadeIn: se oculta el nodo recién insertado y se anima su aparición.
        // Esto cumple el requisito de "La nueva fila debe aparecer con .fadeIn()".
        $(fila.node()).hide().fadeIn(500);

        // Reset del formulario y foco para carga rápida de múltiples tareas
        $('#nombreTarea').val('').focus();

        actualizarContador();
        mostrarToast('Tarea "' + nombre + '" agregada', 'success');
    });

    // Limpiar el indicador de error apenas el usuario empieza a escribir
    $('#nombreTarea').on('input', function () {
        $(this).removeClass('input-error');
        $('#errorNombre').text('').hide();
    });

    // ─── Eliminar tarea ────────────────────────────────────────────────────────
    // Delegación de eventos: el listener está en tbody, no en cada botón.
    // Esto es obligatorio porque los botones se crean después del bind.
    //
    // El orden importa: primero fadeOut (visual), después remove (datos).
    // Si se invierte, DataTables ya eliminó la fila y el fadeOut no tiene nodo.

    $('#tablaTareas tbody').on('click', '.btn-eliminar', function () {
        var fila = $(this).closest('tr');
        var nombreTarea = fila.find('td:first').text();

        fila.fadeOut(400, function () {
            tabla.row(fila).remove().draw(false);
            actualizarContador();
            mostrarToast('Tarea "' + nombreTarea + '" eliminada', 'error');
        });
    });

    // ─── Cambio de color del título ────────────────────────────────────────────
    // Requisito: "Al pasar el mouse sobre el título, cambiar su color."
    // Se usa .css() con valor vacío en mouseleave para revertir al color
    // definido en CSS (no hardcodear el color original).

    $('#titulo-principal').on('mouseenter', function () {
        $(this).css('color', '#7dd3c8');
    });

    $('#titulo-principal').on('mouseleave', function () {
        $(this).css('color', '');
    });

});
