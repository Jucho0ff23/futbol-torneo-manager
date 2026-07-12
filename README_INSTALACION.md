# 📱 Guía de Instalación - Torneo Manager Pro

**Instrucciones paso a paso para generar el APK de producción**

---

## 🎯 Objetivo

Convertir el código fuente en un archivo APK instalable en tu dispositivo Android.

---

## ✅ Requisitos Previos

Antes de comenzar, asegúrate de tener:

### 1. **Node.js y pnpm**

```bash
# Verifica que tengas Node.js 18+
node --version
# Debe mostrar: v18.0.0 o superior

# Instala pnpm si no lo tienes
npm install -g pnpm

# Verifica pnpm
pnpm --version
# Debe mostrar: 9.0.0 o superior
```

**Descargar:**
- Node.js: [https://nodejs.org](https://nodejs.org)
- pnpm se instala automáticamente con npm

### 2. **Cuenta Expo (Gratuita)**

1. Ve a [https://expo.dev/signup](https://expo.dev/signup)
2. Crea una cuenta con tu email
3. Verifica tu email
4. ¡Listo! Ya tienes acceso a EAS Build

---

## 🚀 Pasos de Instalación

### Paso 1: Descargar y Descomprimir el Proyecto

```bash
# 1. Descarga el archivo futbol-torneo-manager.zip
# (desde el panel de Management UI o desde el enlace proporcionado)

# 2. Descomprime el archivo
unzip futbol-torneo-manager.zip

# 3. Entra al directorio
cd futbol-torneo-manager

# 4. Verifica que esté todo
ls -la
# Deberías ver: app/, lib/, server/, package.json, app.config.ts, etc.
```

### Paso 2: Instalar Dependencias

```bash
# Instala todas las dependencias del proyecto
pnpm install

# Esto puede tomar 2-5 minutos la primera vez
# Espera a que termine sin errores
```

**Si hay errores:**
```bash
# Limpia el caché e intenta de nuevo
pnpm install --force
```

### Paso 3: Iniciar Sesión en Expo

```bash
# Inicia sesión con tu cuenta Expo
eas login

# Te pedirá:
# - Email: (tu email de Expo)
# - Contraseña: (tu contraseña de Expo)

# Verifica que funcionó
eas whoami
# Debe mostrar tu email
```

### Paso 4: Generar el APK de Producción

```bash
# Construye el APK para Android
eas build --platform android --profile production

# Esto iniciará el proceso de compilación
# Verás mensajes como:
# "Building Android app..."
# "Uploading to EAS..."
# "Build queued..."

# Espera a que termine (10-15 minutos)
```

### Paso 5: Descargar el APK

Una vez que la compilación termine, verás algo como:

```
✓ Build finished
📱 APK: https://eas-builds.s3.amazonaws.com/...apk
```

**Opciones para descargar:**

#### Opción A: Desde la Terminal
```bash
# El enlace aparecerá en la terminal
# Cópialo y pégalo en tu navegador
# O usa wget/curl:
wget "https://eas-builds.s3.amazonaws.com/...apk" -O TorneoManager.apk
```

#### Opción B: Desde Expo Dashboard
1. Ve a [https://expo.dev/dashboard](https://expo.dev/dashboard)
2. Selecciona tu proyecto
3. Ve a "Builds"
4. Haz clic en el build completado
5. Descarga el APK

#### Opción C: Enviar a tu Teléfono
```bash
# Si tienes adb instalado:
adb install TorneoManager.apk

# O envía el APK por email/WhatsApp a tu teléfono
```

---

## 📲 Instalar en tu Dispositivo Android

### Método 1: Descarga Directa (Más Fácil)

1. Descarga el APK en tu teléfono
2. Abre el archivo descargado
3. Toca "Instalar"
4. Espera a que termine
5. ¡Listo! La app está instalada

**Nota:** Si ves una advertencia de "Fuentes desconocidas", es normal. Toca "Instalar de todas formas".

### Método 2: Desde Computadora (USB)

1. Conecta tu teléfono a la computadora con USB
2. Copia el APK al teléfono
3. Abre el archivo desde el teléfono
4. Sigue los pasos del Método 1

### Método 3: Código QR

```bash
# Desde la terminal, después de descargar el APK:
# Genera un código QR
qr "https://enlace-al-apk.com"

# Escanea el código QR con tu teléfono
# Se descargará automáticamente
```

---

## 🔧 Solución de Problemas

### "eas: command not found"

```bash
# Instala EAS CLI globalmente
npm install -g eas-cli

# Verifica
eas --version
```

### "No estoy autenticado"

```bash
# Inicia sesión nuevamente
eas logout
eas login

# Verifica
eas whoami
```

### "Build falló"

```bash
# Limpia y reinicia
pnpm install --force
eas build --platform android --profile production --clear-cache
```

### "No puedo instalar el APK"

1. **Verifica la versión de Android**: Debe ser 7.0 o superior
2. **Habilita fuentes desconocidas**: 
   - Configuración → Seguridad → Fuentes desconocidas
3. **Libera espacio**: Necesitas al menos 100 MB libres
4. **Descarga nuevamente**: El APK puede estar corrupto

### "La app se cierra al abrir"

```bash
# Verifica los logs
adb logcat | grep "TorneoManager"

# O reinstala:
adb uninstall com.app.futboltorneomanager
adb install TorneoManager.apk
```

---

## ⏱️ Tiempos Esperados

| Paso | Tiempo |
|------|--------|
| Descomprimir | < 1 min |
| `pnpm install` | 2-5 min |
| `eas login` | < 1 min |
| `eas build` | 10-15 min |
| Descargar APK | 1-5 min |
| Instalar en teléfono | 1-2 min |
| **TOTAL** | **15-30 min** |

---

## 📊 Información del APK

- **Tamaño**: ~50-80 MB
- **Versión de Android**: 7.0+ (API 24+)
- **Arquitectura**: ARM64 + ARMv7
- **Almacenamiento requerido**: 100 MB mínimo
- **Conexión**: Internet (para autenticación y sincronización)

---

## 🎉 ¡Listo!

Una vez instalado, la app estará en tu pantalla de inicio. Toca el icono para abrir.

**Primera vez:**
1. Toca "Iniciar sesión con Google"
2. Autoriza el acceso
3. ¡Comienza a crear torneos!

---

## 📞 Soporte

Si tienes problemas:

1. **Revisa la sección de Solución de Problemas** arriba
2. **Consulta la GUIA_USO.md** para usar la app
3. **Consulta README_DEV.md** para detalles técnicos

---

## 🔄 Actualizar la App

Cuando hagas cambios en el código:

```bash
# Repite los pasos 4-5:
eas build --platform android --profile production

# Descarga el nuevo APK
# Instala sobre la versión anterior
adb install -r TorneoManager.apk
```

---

## 📝 Notas Importantes

- ✅ El APK es **seguro y verificado** por EAS
- ✅ Puedes **compartir el APK** con otros usuarios
- ✅ No necesitas **Play Store** para instalar
- ✅ Los datos se **sincronizan en la nube** con tu cuenta Google
- ❌ No incluye **publicidad** ni **rastreadores**

---

**¡Que disfrutes gestionando tus torneos!** ⚽🏆

Versión 1.0.0 | Julio 2026
