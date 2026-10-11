# FisicaBit BT — Extensión para micro:bit (Bluetooth)

> Categoría **FisicaBit BT**: enviar datos a [fisicabit.com](https://fisicabit.com) por Bluetooth con un solo bloque. Es el complemento de [FisicaBit USB](https://github.com/martinferreiraHCA/pxt-fisicabit-usb) (rama `main` de este mismo repositorio) y vive en la rama `bluetooth`.

## Por qué está separada de FisicaBit USB

MakeCode **no permite usar Radio y Bluetooth en el mismo programa** (las dos extensiones fijan ajustes incompatibles). Todo proyecto nuevo trae Radio. Si FisicaBit USB incluyera Bluetooth, al agregarla aparecería el diálogo "Las extensiones no se pueden usar juntas" y habría que elegir qué borrar. Por eso:

- **FisicaBit USB** no depende de Bluetooth: se agrega a cualquier proyecto sin tocar Radio.
- **FisicaBit BT** (esta extensión) sí depende de Bluetooth y se activa a propósito, cuando se quiere enviar sin cable.

## Cómo activarla

**Camino fácil (recomendado):** en [fisicabit.com](https://fisicabit.com) → **EXTRAS → MAKECODE + FISICABIT**, en la barra **FisicaBit** del editor tocá **Bluetooth**. Un diálogo guiado quita Radio de la práctica y agrega esta categoría. El mismo botón permite **volver a Radio**.

**A mano, en makecode.microbit.org:** Extensiones → pegá

```
https://github.com/martinferreiraHCA/pxt-fisicabit-usb#bluetooth
```

Si el proyecto tiene Radio, MakeCode va a preguntar qué quitar: elegí **Eliminar radio**.

## Secuencia mínima

```blocks
FisicaBitBT.inicioRapido()
basic.forever(function () {
    FisicaBitBT.enviar1(input.acceleration(Dimension.X), 100)
})
```

En fisicabit.com (Chrome o Edge, en Windows, macOS, Linux, ChromeOS o Android): **BLUETOOTH → elegí `BBC micro:bit [xxxxx]`**, **Número de variables = 1**, **"Micro:bit envía timestamp" activado**, **CAPTURAR**. La extensión ya fija "sin vinculación" (No Pairing Required).

## Bloques (en el orden en que aparecen)

```blocks
FisicaBitBT.inicioRapido()
basic.forever(function () {
    FisicaBitBT.enviar1(input.acceleration(Dimension.X), 100)
})
```

| Sección | Bloque | Descripción |
|---------|--------|-------------|
| 1. Iniciar (en al iniciar) | `iniciar Bluetooth para fisicabit.com` | **Primero** en `al iniciar`: diana ◎ esperando, corazón ♥ conectado |
| 2. Enviar (dentro de para siempre) | `enviar a fisicabit.com por Bluetooth tiempo y [valor] cada [100] ms` | Igual que USB; sólo transmite mientras hay conexión. Por Bluetooth, 50 ms o más |
| Envío de datos sin tiempo | `enviar a fisicabit.com por Bluetooth sin tiempo [valor]` | Sólo los valores, sin tiempo ni espera |
| 3. Opcional | `¿Bluetooth conectado?`, `al conectar / al desconectar`, `reiniciar tiempo Bluetooth a 0`, `tiempo Bluetooth (ms)`, `bucle rápido`, `mostrar íconos de conexión` | Estado de la conexión y control del tiempo |
| Avanzado | `enviar tiempo del micro:bit`, `fijar decimales`, `enviar texto`, `iniciar con todos los servicios BLE` | Sólo si hace falta |

En fisicabit.com (Chrome o Edge, en Windows, macOS, Linux, ChromeOS o Android): **Bluetooth → Conectar → `BBC micro:bit [xxxxx]`**. La extensión ya fija "sin vinculación" (No Pairing Required). Si un micro:bit vinculado antes no conecta, quitalo del Bluetooth del sistema. Bluetooth y la extensión Radio no pueden convivir en un programa; USB sí funciona junto con Bluetooth.

### Si conecta pero no llegan datos (celular / Android)

Síntoma: fisicabit.com muestra el micro:bit como conectado, pero la tabla y la gráfica quedan vacías. Casi siempre la causa está en la configuración del proyecto o en el vínculo guardado por el teléfono. Probá en este orden:

1. **Vínculo viejo en el teléfono.** En Android: Ajustes → Bluetooth → `BBC micro:bit [xxxxx]` → **Olvidar**. Reiniciá el micro:bit (botón de atrás) y volvé a conectar desde fisicabit.com.
2. **Configuración del proyecto.** En MakeCode, **⚙ → Configuración del proyecto** tiene que estar en **No Pairing Required**. Si el proyecto está en *JustWorks* o *Passkey*, esa elección gana sobre la de la extensión: el `.hex` exige vinculación y el teléfono conecta pero no lee datos. (Con la versión 1.1.0 y 1.1.1 esta combinación además producía **"Errores de extensión"** y la categoría quedaba vacía; desde la 1.1.2 ya no.) Elegí *No Pairing Required*, volvé a **descargar el .hex** y cargalo de nuevo.
3. **Versión de la extensión.** En **Extensiones** verificá que `fisicabit-bt` esté instalada (1.0.0 o posterior). Si no, quitala, agregala de nuevo y descargá el `.hex` otra vez: el firmware ya cargado en la placa no se actualiza solo.
4. **Bloques.** `iniciar Bluetooth para fisicabit.com` va dentro de `al iniciar` y `enviar a fisicabit.com por Bluetooth ...` dentro de `para siempre`.
5. **fisicabit.com.** Elegí **Bluetooth**, poné el **número de variables** igual a la cantidad de valores del bloque (sin contar el tiempo) y dejá **"Micro:bit envía timestamp"** activado (desactivado si usás los bloques *sin tiempo*).
6. **Navegador.** En Android sólo **Chrome** (o Edge/Samsung Internet) tiene Web Bluetooth; Firefox no, y en iPhone/iPad ninguno. La pestaña tiene que quedar visible con la pantalla encendida.
7. **Intervalo.** Por Bluetooth usá 50 ms o más en el bloque de envío.

## Tutorial paso a paso

`tutorial-bluetooth.md` (en inglés; traducciones en `_locales/es` y `_locales/pt-BR`).

## Compatibilidad

| Plataforma | Navegador | USB (Web Serial) | Bluetooth (Web Bluetooth) |
|------------|-----------|------------------|---------------------------|
| Windows / macOS / Linux / ChromeOS | Chrome, Edge | Sí | Sí |
| Android | Chrome | No | Sí |
| iOS / iPadOS | — | No | No |

## Licencia

MIT

<script src="https://makecode.com/gh-pages-embed.js"></script>
<script>makeCodeRender("{{ site.makecode.home_url }}", "{{ site.github.owner_name }}/{{ site.github.repository_name }}");</script>
