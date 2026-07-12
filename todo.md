# TODO - Torneo Manager Pro

## Fase 1: Estructura Base y Autenticación
- [x] Configurar esquema de base de datos (torneos, equipos, partidos, usuarios)
- [x] Implementar autenticación Google con OAuth
- [x] Crear contexto de usuario y persistencia de sesión
- [x] Pantalla de login/splash
- [x] Pantalla de inicio (listado de torneos)

## Fase 2: Creación de Torneos
- [x] Paso 1: Información del torneo (nombre, descripción, formato)
- [x] Paso 2: Agregar participantes (equipos)
- [x] Paso 3: Configuración de puntuación (V/E/D)
- [x] Paso 4: Resumen y generación de fixture
- [x] Generar contraseña admin (4 dígitos alfanuméricos)

## Fase 3: Lógica de Torneos
- [x] Implementar generador de fixture para Liga
- [x] Implementar generador de fixture para Grupos
- [x] Implementar generador de fixture para Eliminatorias
- [x] Implementar generador de fixture para Combinado
- [x] Manejo de equipos impares (PENDIENTE/descanso)
- [x] Cálculo automático de tabla de posiciones

## Fase 4: Pantalla Principal (4 Pestañas)
- [x] Pestaña INFORMACIÓN (datos del torneo, contraseña admin, compartir)
- [x] Pestaña PARTICIPANTES (listado de equipos)
- [x] Pestaña RESULTADOS (fixture por jornadas)
- [x] Pestaña CLASIFICACIÓN (tabla de posiciones)
- [x] Navegación entre pestañas

## Fase 5: Edición de Resultados
- [x] Pantalla de edición de marcador
- [x] Validación de goles (no negativos)
- [x] Guardar resultado con pulgar (feedback háptico)
- [x] Actualizar tabla de posiciones automáticamente
- [x] Recálculo de puntos

## Fase 6: Roles y Compartir
- [ ] Rol Admin: editar torneo, eliminar (con contraseña)
- [ ] Rol Espectador: solo lectura
- [ ] Link para compartir por WhatsApp
- [ ] Generación de código único para espectador
- [ ] Pantalla de espectador (actualización en tiempo real)

## Fase 7: Escudos de Equipos
- [ ] Seleccionar escudo desde galería
- [ ] Escudo genérico por defecto
- [ ] Almacenar escudos en S3
- [ ] Mostrar escudos en todas las pantallas

## Fase 8: Tema Oscuro y UI/UX
- [ ] Configurar tema oscuro moderno
- [ ] Color dinámico según equipo seleccionado
- [ ] Cabeceras y barras con color del equipo
- [ ] Feedback visual (press states, loading)
- [ ] Animaciones sutiles (transiciones)
- [ ] Responsive design (una mano)

## Fase 9: Pulir y Entregar
- [ ] Pruebas end-to-end
- [ ] Validación de flujos
- [ ] Generación de logo/icono de app
- [ ] Configuración de app.config.ts
- [ ] Checkpoint y entrega
