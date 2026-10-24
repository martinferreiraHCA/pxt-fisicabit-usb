# FisicaBit USB — Extensión para micro:bit

> Versión reducida de [pxt-fisicabit](https://github.com/martinferreiraHCA/pxt-fisicabit): una categoría, **FisicaBit USB** (envío por cable + sensores internos y externos + ultrasonido HC-SR04 / HY-SRF05). **No depende de Bluetooth**, así que se agrega a cualquier proyecto sin tocar Radio. Para enviar sin cable está [FisicaBit BT](https://github.com/martinferreiraHCA/pxt-fisicabit-usb/tree/bluetooth) (ver abajo).

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

## ¿Y Bluetooth?

MakeCode no permite Radio y Bluetooth en el mismo programa, y todo proyecto nuevo trae Radio. Para no obligar a elegir, los bloques Bluetooth están en una extensión aparte, **FisicaBit BT**, que se activa a propósito:

- En [fisicabit.com](https://fisicabit.com) → **EXTRAS → MAKECODE + FISICABIT**, barra **FisicaBit** → botón **Bluetooth** (diálogo guiado: quita Radio y agrega la categoría; permite volver a Radio).
- A mano: Extensiones → `https://github.com/martinferreiraHCA/pxt-fisicabit-usb#bluetooth` y, si MakeCode pregunta, **Eliminar radio**.

Documentación de los bloques Bluetooth: [README de la rama bluetooth](https://github.com/martinferreiraHCA/pxt-fisicabit-usb/tree/bluetooth#readme).

## Bloques de FisicaBit USB (en el orden en que aparecen)

| Sección | Bloque | Descripción |
|---------|--------|-------------|
| 1. Enviar (dentro de "para siempre") | `enviar a fisicabit.com tiempo y [valor] cada [100] ms` | Toma el tiempo del micro:bit (desde 0), envía `tiempo,valor` y espera hasta la próxima muestra. Variantes de 2 y 3 valores (fisicabit.com admite hasta 3 variables). 100 ms = 10 muestras por segundo |
| Envío de datos sin tiempo | `enviar a fisicabit.com sin tiempo [valor]` | Sólo los valores, sin tiempo y sin espera: al apretar un botón, en un evento o en `para siempre` con tu propia pausa. En la página, desactivar "Micro:bit envía timestamp" |
| Sensores internos | `leer sensor interno [temperatura]` | Temperatura, acelerómetro X/Y/Z, nivel de luz, brújula, nivel de sonido (v2), fuerza G |
| Sensores externos | `leer sensor analógico en [P0]` | Potenciómetro, LDR, etc. (0 a 1023) |
| Sensores externos | `leer sensor digital en P[8]` | PIR, infrarrojo, interruptor (0 / 1) |
| Sensores externos | `temperatura NTC 10K en [P0] en [°C]` | Termistor NTC 10K con divisor de 10 kΩ |
| Ultrasonido (HC-SR04 / HY-SRF05) | `HC-SR04 distancia TRIG [P8] ECHO [P12] en [cm]` / `HY-SRF05 distancia ...` | Distancia por tiempo de vuelo (cm con 1 decimal, mm, pulgadas o **m** con 3 decimales), mediana deslizante, última válida si falla el eco; cableado visible en el simulador |
| Ultrasonido (HC-SR04 / HY-SRF05) | `enviar a fisicabit.com distancia HC-SR04 TRIG [P8] ECHO [P12] en [cm]` | Dentro de `para siempre`, sin `cada ... ms`: una línea `tiempo,distancia` por eco, a la frecuencia del sensor (≈33 Hz), con el instante real en que el sonido tocó el objeto. Variante HY-SRF05 |
| Ultrasonido (HC-SR04 / HY-SRF05) | `fijar alcance máximo ultrasónico [300] cm`, `fijar filtro ultrasónico a [suave]`, `estado del ultrasonido TRIG [P8] ECHO [P12]` | Alcance (tiempo de espera del eco), mediana de 1/3/5/7 muestras y diagnóstico en pantalla ("OK 45cm", "SIN ECO", "ECHO ALTO") |
| Ultrasonido (en "... más") | `temperatura del aire`, `frecuencia de muestreo`, `rango de ... a ... mm`, `salto máximo`, `calibrar con objeto a [300] mm`, `distancia cruda`, `¿eco válido?`, `frecuencia real`, `tiempo del último eco` | Velocidad del sonido corregida por temperatura, rechazo de saltos, calibración de offset y diagnóstico fino |
| 2. Opcional | `bucle rápido para fisicabit.com cada [20] ms` | En lugar de `para siempre`, para 50 / 100 Hz; el bloque de envío va adentro |
| 2. Opcional | `reiniciar tiempo USB a 0`, `tiempo USB (ms)` | Control del tiempo |
| Avanzado | `USB enviar tiempo del micro:bit`, `USB fijar decimales`, `USB enviar línea` | Sólo si hace falta |

## Ultrasonido HC-SR04 / HY-SRF05

Mismo sensor que la categoría **Ultrasonido** de [pxt-fisicabit](https://github.com/martinferreiraHCA/pxt-fisicabit), portado a esta extensión (sin el muestreador nativo en C++, que allá es opcional: acá todo es TypeScript y funciona en cualquier proyecto).

**Medición.** Los bloques miden exactamente como la extensión `pxt-sonar` de Microsoft: pulso de 10 µs en TRIG, `pins.pulseIn` en ECHO y distancia = tiempo del eco × velocidad del sonido / 2, con la velocidad del sonido corregida por la temperatura del aire (`fijar temperatura del aire`). El filtro es una mediana deslizante que no baja la frecuencia, con rechazo de saltos (`fijar salto máximo`) y calibración de offset contra una distancia conocida (`calibrar`).

**Frecuencia y marcas de tiempo.** El HC-SR04 ignora un disparo mientras corre su ciclo interno (≈25-30 ms): si se dispara más rápido no devuelve eco y el bloque sólo repetiría el valor anterior. Por eso los bloques nunca disparan más rápido que cada 30 ms; si se los llama antes, `distancia` devuelve el valor anterior sin bloquear. Para física usá `enviar a fisicabit.com distancia HC-SR04 ...`: espacia los disparos, omite las muestras sin eco en vez de repetir valores viejos, y marca cada línea con el instante en que el sonido tocó el objeto (disparo + 0,45 ms + medio eco), no con el instante en que se escribe la línea. La distancia se puede enviar en cm, mm, pulgadas o **metros** (3 decimales).

```blocks
FisicaBitSerial.fijarAlcanceUltrasonido(150)
basic.forever(function () {
    FisicaBitSerial.enviarDistanciaUltrasonido(DigitalPin.P8, DigitalPin.P12, UnidadDistancia.Centimetros)
})
```

En fisicabit.com: **USB → Conectar**, **Número de variables = 1**, **"Micro:bit envía timestamp" activado**, **Iniciar**. Si el gráfico queda vacío, poné `estado del ultrasonido` en un `mostrar cadena`: "SIN ECO" suele ser alimentación (muchos HC-SR04 necesitan 5 V) y "ECHO ALTO", TRIG y ECHO cruzados.

## Tutorial paso a paso

```
https://makecode.microbit.org/#tutorial:https://github.com/martinferreiraHCA/pxt-fisicabit-usb/tutorial-usb
```

## Conexiones

```
Sensor analógico:  señal → P0/P1/P2, VCC → 3V, GND → GND
Sensor digital:    OUT → P8 (o P12, P16), VCC → 3V, GND → GND
NTC 10K:           3V ─[10 kΩ]─┬─ P0    ;   NTC entre ese punto y GND
HC-SR04 / HY-SRF05: TRIG → P8, ECHO → P12, VCC → 3V (o 5V con divisor 1 kΩ / 2 kΩ en ECHO), GND → GND
                   HY-SRF05 con OUT a GND (1 cable): el mismo pin en TRIG y ECHO
                   Segundo sensor: TRIG P1 · ECHO P2. Tercero: TRIG P15 · ECHO P16
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
