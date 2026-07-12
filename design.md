# Diseño de Interfaz - Torneo Manager Pro

## Orientación y Contexto
- **Orientación:** Retrato (9:16) optimizado para una mano
- **Tema:** Oscuro moderno con colores dinámicos según equipo seleccionado
- **Plataforma:** iOS/Android nativo con Expo

## Pantallas Principales

### 1. **Pantalla de Autenticación (Splash/Login)**
- Logo de la app (generado)
- Botón "Iniciar sesión con Google"
- Enlace "Continuar como espectador" (opcional)
- Tema oscuro con gradiente sutil

### 2. **Pantalla de Inicio (Home)**
- Listado de torneos del usuario
- Botón flotante "Crear nuevo torneo" (FAB)
- Cada torneo muestra:
  - Nombre del torneo
  - Fecha de creación
  - Número de equipos
  - Estado (En progreso, Finalizado)
- Opción de compartir torneo por WhatsApp

### 3. **Flujo de Creación de Torneo (4 pasos)**

#### Paso 1: Información del Torneo
- Nombre del torneo
- Descripción (opcional)
- Formato (selector: Liga, Grupos, Eliminatorias, Combinado)
- Configuración según formato:
  - **Liga:** Vueltas (1-5), Puntos (V/E/D)
  - **Grupos:** Número de grupos, Vueltas, Puntos
  - **Eliminatorias:** Tipo (Mata-mata, Ida y Vuelta), Tercer puesto (sí/no)
  - **Combinado:** Selector de fases

#### Paso 2: Participantes (Equipos)
- Agregar equipos (nombre + escudo opcional)
- Escudo desde galería o genérico
- Listado de equipos con opción de editar/eliminar
- Validación: Mínimo 2 equipos

#### Paso 3: Configuración Avanzada
- Puntos por victoria (1-5)
- Puntos por empate (0-2)
- Puntos por derrota (0-1)
- Número de vueltas (1-5)

#### Paso 4: Resumen y Generar Fixture
- Resumen de configuración
- Botón "Generar Fixture"
- Confirmación de creación

### 4. **Pantalla Principal del Torneo (4 Pestañas)**

#### Pestaña 1: INFORMACIÓN
- Nombre y descripción del torneo
- Fecha de inicio/fin
- Formato del torneo
- **Sección: Contraseña de Administrador**
  - Código único de 4 dígitos alfanuméricos (ej: "2b4k")
  - Generado automáticamente al crear torneo
  - Copiable al portapapeles
- Botón "Compartir por WhatsApp" (link de espectador)
- Botón "Eliminar torneo" (requiere contraseña admin)

#### Pestaña 2: PARTICIPANTES
- Listado de equipos con:
  - Escudo (o ícono genérico)
  - Nombre del equipo
  - Número de jugadores (opcional)
- Botón "Editar equipo" (solo admin)
- Botón "Agregar equipo" (solo admin, antes de generar fixture)

#### Pestaña 3: RESULTADOS
- Fixture organizado por jornadas
- Cada jornada muestra:
  - Encabezado "Jornada 1", "Jornada 2", etc.
  - Partidos con:
    - Escudos de ambos equipos
    - Nombres de equipos
    - Marcador (editable si es admin)
    - Estado: PENDIENTE, EN VIVO, FINALIZADO
  - Equipos con "PENDIENTE" (descanso) marcados
- Botón de edición de resultado (solo admin)
- Pulgar para guardar resultado (feedback háptico)

#### Pestaña 4: CLASIFICACIÓN
- Tabla de posiciones con:
  - Posición (1°, 2°, etc.)
  - Escudo del equipo
  - Nombre del equipo
  - Partidos jugados (PJ)
  - Victorias (V)
  - Empates (E)
  - Derrotas (D)
  - Goles a favor (GF)
  - Goles en contra (GC)
  - Diferencia de goles (DG)
  - Puntos (Pts)
- Ordenada por puntos (descendente)
- Colores: Verde (líder), Amarillo (zona de playoffs), Rojo (descenso)

### 5. **Pantalla de Edición de Resultado**
- Selector de equipo local/visitante
- Entrada numérica de goles
- Botón "Guardar resultado"
- Confirmación con feedback háptico

### 6. **Pantalla de Espectador (Modo Solo Lectura)**
- Acceso mediante link compartido
- Muestra las 4 pestañas (sin edición)
- Actualización en tiempo real
- Botón "Compartir" para enviar link a otros

## Paleta de Colores (Tema Oscuro)

| Token | Valor |
|-------|-------|
| Background | #0F0F0F |
| Surface | #1A1A1A |
| Foreground | #FFFFFF |
| Muted | #888888 |
| Border | #333333 |
| Primary | Dinámico (color del equipo) |
| Success | #22C55E |
| Warning | #F59E0B |
| Error | #EF4444 |

## Componentes Clave

- **ScreenContainer:** Manejo de SafeArea
- **TabBar:** 4 pestañas con iconos
- **Card:** Información de torneo/equipo/partido
- **Button:** Acciones primarias/secundarias
- **Modal:** Confirmaciones y alertas
- **FlatList:** Listas de torneos, equipos, partidos

## Flujos de Usuario

### Admin
1. Crear torneo → Agregar equipos → Generar fixture
2. Ver torneo → Editar resultados → Guardar con pulgar
3. Compartir link de espectador

### Espectador
1. Recibir link compartido
2. Ver fixture en tiempo real (solo lectura)
3. Ver tabla de posiciones actualizada

## Validaciones

- Mínimo 2 equipos para crear torneo
- Máximo 32 equipos (para eliminatorias)
- Contraseña admin requerida para eliminar torneo
- Validación de marcadores (no negativos)
- Prevención de ediciones duplicadas
