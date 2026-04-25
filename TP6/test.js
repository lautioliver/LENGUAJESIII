/**
 * Script de prueba automática — TP6 Gestor de Tareas
 * 
 * Prueba todas las funcionalidades:
 *  1. Validación (campo vacío)
 *  2. Agregar tareas con distintas prioridades
 *  3. Verificar que las filas aparecen en la tabla
 *  4. Eliminar una tarea
 *  5. Hover del título (cambio de color)
 *
 * Para usar: incluí <script src="test.js"></script> al final del index.html
 *            o pegá el contenido en la consola del navegador.
 */

$(document).ready(function () {

    // Esperar a que DataTables termine de inicializar
    setTimeout(function () {
        console.log('🧪 ══════════════════════════════════════');
        console.log('🧪 INICIO DE PRUEBAS AUTOMÁTICAS');
        console.log('🧪 ══════════════════════════════════════');
        ejecutarPruebas();
    }, 500);

    function ejecutarPruebas() {
        var paso = 0;
        var tareas = [
            { nombre: 'Diseñar la base de datos', prioridad: 'Alta' },
            { nombre: 'Implementar API REST', prioridad: 'Media' },
            { nombre: 'Configurar servidor Express', prioridad: 'Baja' },
            { nombre: 'Crear componentes React', prioridad: 'Alta' },
            { nombre: 'Escribir tests unitarios', prioridad: 'Media' },
            { nombre: 'Documentar endpoints', prioridad: 'Baja' },
            { nombre: 'Revisar pull requests', prioridad: 'Alta' },
            { nombre: 'Optimizar consultas SQL', prioridad: 'Media' },
        ];

        // ─── PASO 1: Validación de campo vacío ─────────────────────
        paso++;
        console.log('\n📋 Paso ' + paso + ': Validación de campo vacío...');
        $('#nombreTarea').val('');
        $('#formTarea').trigger('submit');

        setTimeout(function () {
            var tieneError = $('#nombreTarea').hasClass('input-error');
            var mensajeVisible = $('#errorNombre').is(':visible') && $('#errorNombre').text() !== '';
            console.log(tieneError ? '  ✅ Input marcado con error' : '  ❌ Input NO marcado con error');
            console.log(mensajeVisible ? '  ✅ Mensaje de error visible' : '  ❌ Mensaje de error NO visible');

            // ─── PASO 2: Agregar tareas secuencialmente ──────────────
            paso++;
            console.log('\n📋 Paso ' + paso + ': Agregando ' + tareas.length + ' tareas...');
            agregarTareasSecuencial(tareas, 0, function () {

                setTimeout(function () {
                    // ─── PASO 3: Verificar filas en la tabla ──────────────
                    paso++;
                    var filasEnTabla = $('#tablaTareas').DataTable().rows().count();
                    console.log('\n📋 Paso ' + paso + ': Verificando tabla...');
                    console.log('  Total de filas: ' + filasEnTabla);
                    console.log(filasEnTabla === tareas.length
                        ? '  ✅ Cantidad correcta (' + tareas.length + ' tareas)'
                        : '  ❌ Se esperaban ' + tareas.length + ', hay ' + filasEnTabla);

                    // ─── PASO 4: Eliminar la primera tarea ────────────────
                    paso++;
                    console.log('\n📋 Paso ' + paso + ': Eliminando la primera tarea...');
                    var primerBoton = $('#tablaTareas tbody .btn-eliminar').first();
                    var nombreEliminada = primerBoton.closest('tr').find('td:first').text();
                    console.log('  Eliminando: "' + nombreEliminada + '"');
                    primerBoton.trigger('click');

                    setTimeout(function () {
                        var filasRestantes = $('#tablaTareas').DataTable().rows().count();
                        console.log('  Filas restantes: ' + filasRestantes);
                        console.log(filasRestantes === tareas.length - 1
                            ? '  ✅ Tarea eliminada correctamente'
                            : '  ❌ Error al eliminar');

                        // ─── PASO 5: Hover del título ─────────────────────
                        paso++;
                        console.log('\n📋 Paso ' + paso + ': Probando hover del título...');
                        var titulo = $('#titulo-principal');
                        var colorOriginal = titulo.css('color');
                        titulo.trigger('mouseenter');

                        setTimeout(function () {
                            var colorHover = titulo.css('color');
                            console.log('  Color original: ' + colorOriginal);
                            console.log('  Color hover:    ' + colorHover);
                            console.log(colorOriginal !== colorHover
                                ? '  ✅ Color cambió correctamente'
                                : '  ⚠️  No se detectó cambio (puede ser por timing)');

                            titulo.trigger('mouseleave');

                            // ─── RESUMEN ──────────────────────────────────────
                            console.log('\n🧪 ══════════════════════════════════════');
                            console.log('🧪 PRUEBAS FINALIZADAS');
                            console.log('🧪 Filas en tabla: ' + $('#tablaTareas').DataTable().rows().count());
                            console.log('🧪 ══════════════════════════════════════');
                        }, 300);
                    }, 600);
                }, 300);
            });
        }, 400);
    }

    /**
     * Agrega tareas una por una con delay para que se vean las animaciones
     */
    function agregarTareasSecuencial(tareas, index, callback) {
        if (index >= tareas.length) {
            callback();
            return;
        }

        var tarea = tareas[index];
        $('#nombreTarea').val(tarea.nombre);
        $('#prioridadTarea').val(tarea.prioridad);
        $('#formTarea').trigger('submit');

        console.log('  ✅ [' + (index + 1) + '/' + tareas.length + '] "' + tarea.nombre + '" (' + tarea.prioridad + ')');

        setTimeout(function () {
            agregarTareasSecuencial(tareas, index + 1, callback);
        }, 350);
    }

});
