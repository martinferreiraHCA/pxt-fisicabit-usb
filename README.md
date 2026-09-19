# FisicaBit USB + BT — Extensión para micro:bit

> Versión reducida de [pxt-fisicabit](https://github.com/martinferreiraHCA/pxt-fisicabit): dos categorías, **FisicaBit USB** (envío por cable + sensores internos y externos) y **FisicaBit BT** (envío por Bluetooth), para enviar datos a [fisicabit.com](https://fisicabit.com) con un solo bloque. Sin módulos avanzados.

## Cómo usar esta extensión

En MakeCode, entrá a **Extensiones** y pegá la URL de este repositorio:

```
https://github.com/martinferreiraHCA/pxt-fisicabit-usb
```

Los bloques están en **español** siempre, sin importar el idioma del editor (con el editor en portugués se traducen al portugués). Si la extensión ya estaba en un proyecto y ves textos viejos, quitala y volvé a agregarla: MakeCode guarda en caché la versión anterior.

## Secuencia mínima

```blocks
basic.forever(function () {
    FisicaBitSerial.enviar1(FisicaBitSerial.leerSensorInterno(TipoSensorInterno.AcelerometroX), 100)
})
```

En fisicabit.com (Chrome o Edge): **USB → Conectar**, **Número de variables = 1**, **"Micro:bit envía timestamp" activado**, **Iniciar**.

## FisicaBit BT — enviar sin cable

```blocks
FisicaBitBT.inicioRapido()
basic.forever(function () {
    FisicaBitBT.enviar1(FisicaBitSerial.leerSensorInterno(TipoSensorInterno.AcelerometroX), 100)
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

## Bloques de FisicaBit USB (en el orden en que aparecen)

| Sección | Bloque | Descripción |
|---------|--------|-------------|
| 1. Enviar (dentro de "para siempre") | `enviar a fisicabit.com tiempo y [valor] cada [100] ms` | Toma el tiempo del micro:bit (desde 0), envía `tiempo,valor` y espera hasta la próxima muestra. Variantes de 2, 3 y 4 valores. 100 ms = 10 muestras por segundo |
| Envío de datos sin tiempo | `enviar a fisicabit.com sin tiempo [valor]` | Sólo los valores, sin tiempo y sin espera: al apretar un botón, en un evento o en `para siempre` con tu propia pausa. En la página, desactivar "Micro:bit envía timestamp" |
| Sensores internos | `leer sensor interno [temperatura]` | Temperatura, acelerómetro X/Y/Z, nivel de luz, brújula, nivel de sonido (v2), fuerza G |
| Sensores externos | `leer sensor analógico en [P0]` | Potenciómetro, LDR, etc. (0 a 1023) |
| Sensores externos | `leer sensor digital en P[8]` | PIR, infrarrojo, interruptor (0 / 1) |
| Sensores externos | `temperatura NTC 10K en [P0] en [°C]` | Termistor NTC 10K con divisor de 10 kΩ |
| Sensores externos | `HC-SR04 distancia TRIG [P8] ECHO [P12] en [cm]` | Ultrasónico, mediana de 3 lecturas |
| 2. Opcional | `bucle rápido para fisicabit.com cada [20] ms` | En lugar de `para siempre`, para 50 / 100 Hz; el bloque de envío va adentro |
| 2. Opcional | `reiniciar tiempo USB a 0`, `tiempo USB (ms)` | Control del tiempo |
| Avanzado | `USB enviar tiempo del micro:bit`, `USB fijar decimales`, `USB enviar línea` | Sólo si hace falta |

## Tutorial paso a paso

```
https://makecode.microbit.org/#tutorial:https://github.com/martinferreiraHCA/pxt-fisicabit-usb/tutorial-usb
```

## Conexiones

```
Sensor analógico:  señal → P0/P1/P2, VCC → 3V, GND → GND
Sensor digital:    OUT → P8 (o P12, P16), VCC → 3V, GND → GND
NTC 10K:           3V ─[10 kΩ]─┬─ P0    ;   NTC entre ese punto y GND
HC-SR04:           TRIG → P8, ECHO → P12, VCC → 3V (o 5V), GND → GND
```

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
