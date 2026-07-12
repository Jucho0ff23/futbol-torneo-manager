# 🏆 Torneo Manager Pro - Guía de Desarrollo

**Aplicación nativa Android para gestión de torneos de fútbol**

---

## 📋 Tabla de Contenidos

1. [Stack tecnológico](#stack-tecnológico)
2. [Instalación de dependencias](#instalación-de-dependencias)
3. [Estructura del proyecto](#estructura-del-proyecto)
4. [Desarrollo local](#desarrollo-local)
5. [Compilación y distribución](#compilación-y-distribución)
6. [API y endpoints](#api-y-endpoints)
7. [Base de datos](#base-de-datos)

---

## 🛠️ Stack Tecnológico

### Frontend
- **React Native 0.81** - Framework nativo
- **Expo SDK 54** - Herramientas de desarrollo
- **Expo Router 6** - Navegación
- **TypeScript 5.9** - Tipado estático
- **NativeWind 4** - Tailwind CSS para React Native
- **React Native Reanimated 4** - Animaciones

### Backend
- **Node.js** - Runtime
- **Express.js** - Framework web
- **tRPC 11.7** - RPC type-safe
- **PostgreSQL / MySQL** - Base de datos
- **Drizzle ORM** - ORM
- **OAuth 2.0** - Autenticación Google

### Herramientas
- **pnpm** - Package manager
- **Vitest** - Testing framework
- **ESLint** - Linting
- **Prettier** - Code formatting

---

## 📦 Instalación de Dependencias

### Requisitos Previos

```bash
# Node.js 18+ y npm/pnpm
node --version  # v18.0.0+
pnpm --version  # 9.12.0+

# Expo CLI
npm install -g expo-cli

# Android SDK (para compilar APK)
# Descargar desde: https://developer.android.com/studio
```

### Instalar Dependencias del Proyecto

```bash
# Clonar o entrar al directorio
cd futbol-torneo-manager

# Instalar dependencias
pnpm install

# Generar tipos de base de datos
pnpm db:push
```

---

## 📁 Estructura del Proyecto

```
futbol-torneo-manager/
├── app/                          # Pantallas y rutas (Expo Router)
│   ├── (tabs)/                   # Tab navigation
│   │   ├── index.tsx             # Home - Listado de torneos
│   │   └── _layout.tsx           # Tab bar configuration
│   ├── create-tournament*.tsx     # Flujo de creación (4 pasos)
│   ├── tournament-detail.tsx      # Pantalla principal del torneo
│   ├── tournament-tabs/           # Componentes de pestañas
│   │   ├── info-tab.tsx           # Información del torneo
│   │   ├── participants-tab.tsx    # Lista de equipos
│   │   ├── results-tab.tsx         # Fixture y resultados
│   │   └── standings-tab.tsx       # Tabla de posiciones
│   ├── edit-match-result.tsx      # Edición de marcador
│   ├── share-tournament.tsx       # Compartir torneo
│   └── _layout.tsx               # Root layout con providers
│
├── components/                   # Componentes reutilizables
│   ├── screen-container.tsx      # SafeArea wrapper
│   ├── themed-view.tsx           # View con tema
│   ├── haptic-tab.tsx            # Tab con feedback
│   └── ui/
│       └── icon-symbol.tsx       # Icon mapping
│
├── lib/                          # Utilidades y lógica
│   ├── tournament-context.tsx    # Context para estado global
│   ├── tournament-utils.ts       # Generador de contraseña/código
│   ├── fixture-generator.ts      # Generador de fixtures (4 formatos)
│   ├── scoring-calculator.ts     # Cálculo de puntuación
│   ├── auth-utils.ts             # Roles y permisos
│   ├── theme-provider.tsx        # Provider de tema
│   ├── trpc.ts                   # Cliente tRPC
│   └── utils.ts                  # Utilidades generales
│
├── hooks/                        # Custom hooks
│   ├── use-auth.ts               # Estado de autenticación
│   ├── use-colors.ts             # Colores del tema
│   └── use-color-scheme.ts       # Detección de tema
│
├── server/                       # Backend
│   ├── _core/
│   │   ├── index.ts              # Servidor Express
│   │   ├── trpc.ts               # Configuración tRPC
│   │   ├── auth.ts               # Autenticación
│   │   ├── oauth.ts              # OAuth Google
│   │   └── ...                   # Otros servicios
│   ├── routers/
│   │   └── tournaments.ts        # API de torneos
│   └── db.ts                     # Conexión a BD
│
├── drizzle/                      # Migraciones de BD
│   ├── schema.ts                 # Esquema de tablas
│   ├── relations.ts              # Relaciones
│   └── migrations/               # Archivos SQL
│
├── assets/                       # Recursos
│   └── images/
│       ├── icon.png              # App icon
│       ├── splash-icon.png       # Splash screen
│       └── favicon.png           # Web favicon
│
├── theme.config.js               # Configuración de colores
├── tailwind.config.js            # Configuración Tailwind
├── app.config.ts                 # Configuración Expo
├── package.json                  # Dependencias
└── tsconfig.json                 # Configuración TypeScript
```

---

## 🚀 Desarrollo Local

### Iniciar Servidor de Desarrollo

```bash
# Iniciar Metro bundler y servidor backend
pnpm dev

# En otra terminal, ver QR para Expo Go
pnpm qr
```

### Escanear QR en Dispositivo

1. Instala **Expo Go** desde Play Store
2. Abre la app
3. Escanea el QR que aparece en la terminal
4. La app se abrirá en tu dispositivo

### Desarrollo en Web

```bash
# El servidor web está disponible en:
# http://localhost:8081
```

### Desarrollo en Android Studio

```bash
# Compilar y ejecutar en emulador
pnpm android

# O en dispositivo físico conectado
adb devices
pnpm android
```

---

## 🔨 Compilación y Distribución

### Compilar APK para Android

```bash
# Compilar APK de desarrollo
eas build --platform android --profile preview

# Compilar APK de producción
eas build --platform android --profile production

# Descargar APK localmente
# El archivo estará en: ./dist/
```

### Compilar para iOS

```bash
# Compilar para iOS (requiere Mac)
eas build --platform ios --profile production
```

### Publicar en Play Store

```bash
# Configurar credenciales
eas credentials

# Compilar para Play Store
eas build --platform android --profile production

# Subir a Play Store
eas submit --platform android
```

---

## 🔌 API y Endpoints

### Rutas tRPC (Backend)

#### Torneos

```typescript
// Crear torneo
tournaments.create({
  userId: number;
  name: string;
  description?: string;
  format: "league" | "groups" | "playoffs" | "combined";
})

// Obtener torneos del usuario
tournaments.getByUser(userId: number)

// Obtener torneo por ID
tournaments.getById(tournamentId: number)

// Actualizar torneo
tournaments.update({
  tournamentId: number;
  name?: string;
  description?: string;
})

// Eliminar torneo (requiere admin password)
tournaments.delete({
  tournamentId: number;
  adminPassword: string;
})

// Generar fixture
tournaments.generateFixture(tournamentId: number)

// Registrar resultado
tournaments.recordResult({
  matchId: number;
  homeScore: number;
  awayScore: number;
})

// Obtener standings
tournaments.getStandings(tournamentId: number)
```

#### Equipos

```typescript
// Agregar equipo
teams.add({
  tournamentId: number;
  name: string;
  shieldUrl?: string;
})

// Actualizar equipo
teams.update({
  teamId: number;
  name?: string;
  shieldUrl?: string;
})

// Eliminar equipo
teams.delete(teamId: number)

// Obtener equipos del torneo
teams.getByTournament(tournamentId: number)
```

#### Partidos

```typescript
// Obtener partidos del torneo
matches.getByTournament(tournamentId: number)

// Obtener partidos por jornada
matches.getByMatchday({
  tournamentId: number;
  matchday: number;
})

// Actualizar resultado
matches.updateResult({
  matchId: number;
  homeScore: number;
  awayScore: number;
})
```

---

## 🗄️ Base de Datos

### Esquema de Tablas

#### tournaments
```sql
- id (PK)
- userId (FK)
- name
- description
- format (league|groups|playoffs|combined)
- status (draft|active|finished)
- adminPassword
- spectatorCode
- pointsWin
- pointsDraw
- pointsLoss
- rounds
- createdAt
- updatedAt
```

#### teams
```sql
- id (PK)
- tournamentId (FK)
- name
- shieldUrl
- createdAt
```

#### matches
```sql
- id (PK)
- tournamentId (FK)
- homeTeamId (FK)
- awayTeamId (FK)
- homeScore
- awayScore
- status (pending|live|finished|postponed)
- matchday
- round
- isReturn
- createdAt
- updatedAt
```

#### standings
```sql
- id (PK)
- tournamentId (FK)
- teamId (FK)
- position
- played
- wins
- draws
- losses
- goalsFor
- goalsAgainst
- goalDifference
- points
- updatedAt
```

### Migraciones

```bash
# Generar migración
pnpm db:generate

# Aplicar migraciones
pnpm db:push

# Ver estado de BD
pnpm db:studio
```

---

## 🧪 Testing

### Ejecutar Tests

```bash
# Ejecutar todos los tests
pnpm test

# Ejecutar tests en modo watch
pnpm test:watch

# Coverage
pnpm test:coverage
```

### Escribir Tests

```typescript
// tests/example.test.ts
import { describe, it, expect } from 'vitest';

describe('Example', () => {
  it('should work', () => {
    expect(1 + 1).toBe(2);
  });
});
```

---

## 📝 Convenciones de Código

### Estructura de Archivos

- Componentes: `PascalCase.tsx`
- Utilidades: `kebab-case.ts`
- Hooks: `use-kebab-case.ts`
- Constantes: `UPPER_SNAKE_CASE`

### Nomenclatura

```typescript
// Componentes
export function MyComponent() {}

// Hooks
export function useMyHook() {}

// Utilidades
export function myUtilityFunction() {}

// Tipos
export interface MyInterface {}
export type MyType = {}
```

### Imports

```typescript
// Orden: React, librerías, locales
import { View, Text } from 'react-native';
import { useColors } from '@/hooks/use-colors';
import { cn } from '@/lib/utils';
```

---

## 🐛 Debugging

### Logs en Consola

```bash
# Ver logs en tiempo real
pnpm dev

# En Expo Go, shake el dispositivo para abrir el menú
```

### DevTools

```typescript
// Usar React DevTools
import { useDebugValue } from 'react';

function useMyHook() {
  useDebugValue('My Hook');
}
```

### Network Debugging

```bash
# Inspeccionar requests tRPC
# Abre DevTools en el navegador
# Pestaña Network → filtrar por "trpc"
```

---

## 📚 Recursos Útiles

- [Expo Documentation](https://docs.expo.dev)
- [React Native Docs](https://reactnative.dev)
- [tRPC Documentation](https://trpc.io)
- [NativeWind](https://www.nativewind.dev)
- [Drizzle ORM](https://orm.drizzle.team)

---

## 🤝 Contribuir

1. Crea una rama: `git checkout -b feature/my-feature`
2. Commit cambios: `git commit -m 'Add my feature'`
3. Push a rama: `git push origin feature/my-feature`
4. Abre un Pull Request

---

## 📄 Licencia

Torneo Manager Pro © 2026. Todos los derechos reservados.

---

**Hecho con ❤️ para los amantes del fútbol**
