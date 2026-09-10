# FisicaBit USB — Extensión para micro:bit

> Versión reducida de [pxt-fisicabit](https://github.com/martinferreiraHCA/pxt-fisicabit): una sola categoría **FisicaBit USB** para enviar datos a [fisicabit.com](https://fisicabit.com) por el cable USB, con los sensores internos y externos del micro:bit dentro de la misma categoría. Sin Bluetooth ni módulos avanzados.

## Cómo usar esta extensión

En MakeCode, entrá a **Extensiones** y pegá la URL de este repositorio:

```
https://github.com/martinferreiraHCA/pxt-fisicabit-usb
```

Los bloques aparecen en el idioma del editor (español, inglés o portugués). Si la extensión ya estaba en un proyecto y ves textos viejos, quitala y volvé a agregarla: MakeCode guarda en caché la versión anterior.

## Secuencia mínima

```blocks
basic.forever(function () {
    FisicaBitSerial.enviar1(FisicaBitSerial.leerSensorInterno(TipoSensorInterno.AcelerometroX), 100)
})
```

En fisicabit.com (Chrome o Edge): **USB → Conectar**, **Número de variables = 1**, **"Micro:bit envía timestamp" activado**, **Iniciar**.

## Bloques (en el orden en que aparecen)

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

| Plataforma | Navegador | USB (Web Serial) |
|------------|-----------|------------------|
| Windows / macOS / Linux / ChromeOS | Chrome, Edge | Sí |
| Android, iOS / iPadOS | — | No |

## Licencia

MIT

<script src="https://makecode.com/gh-pages-embed.js"></script>
<script>makeCodeRender("{{ site.makecode.home_url }}", "{{ site.github.owner_name }}/{{ site.github.repository_name }}");</script>
