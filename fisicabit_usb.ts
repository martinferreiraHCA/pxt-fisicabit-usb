// =============================================================================
//  fisicabit_usb.ts — "FisicaBit USB": datos a fisicabit.com por USB + sensores
// =============================================================================
//  Proyecto: FisicaBit.com
//  Versión reducida de pxt-fisicabit: una sola categoría con
//    1. Envío a fisicabit.com por USB (tiempo + valores, un solo bloque)
//    2. Envío sin tiempo (sólo valores, sin espera)
//    3. Sensores internos del micro:bit
//    4. Sensores externos (analógico, digital, NTC 10K, HC-SR04)
//
//  SECUENCIA MÍNIMA:
//    por siempre:
//      [enviar a fisicabit.com tiempo y (leer sensor interno (acelerómetro X)) cada (100) ms]
//
//  En fisicabit.com: conexión USB (Chrome/Edge), número de variables = cantidad
//  de valores del bloque y "Micro:bit envía timestamp" activado.
// =============================================================================

//% weight=100
//% color=#5C6BC0
//% icon="\uf287"
//% block="FisicaBit USB"
//% groups='["1. Send (inside forever)", "Send without time", "Internal sensors", "External sensors", "2. Optional", "Advanced"]'
namespace FisicaBitSerial {

    let _m: FisicaBitDatos.Muestreador = null
    let _iniciado = false

    function _asegurar(): FisicaBitDatos.Muestreador {
        if (!_m) _m = new FisicaBitDatos.Muestreador()
        if (!_iniciado) {
            _iniciado = true
            // fisicabit.com abre el puerto a 115200 baudios
            serial.setBaudRate(BaudRate.BaudRate115200)
            _m.reiniciarTiempo()
        }
        return _m
    }

    function _enviar(valores: number[], ms: number): void {
        const m = _asegurar()
        m.fijarPeriodo(ms)
        serial.writeLine(m.linea(valores))
        m.esperar()
    }

    function _enviarSinTiempo(valores: number[]): void {
        const m = _asegurar()
        serial.writeLine(m.linea(valores, false))
    }

    // =========================================================================
    // PASO 1: ENVIAR — un solo bloque dentro de "para siempre"
    // =========================================================================

    /**
     * Envía a fisicabit.com el tiempo (ms) y un valor medido, y espera hasta
     * la próxima muestra. Colocar dentro de "para siempre".
     * Línea enviada: tiempo,valor
     *
     * Ejemplo: [enviar a fisicabit.com tiempo y (aceleración x) cada (100) ms]
     *   → 10 muestras por segundo con el tiempo del micro:bit desde 0.
     * En fisicabit.com: USB, 1 variable, "Micro:bit envía timestamp" activado.
     *
     * @param valor Valor medido (sensor, variable o cálculo)
     * @param ms Tiempo entre muestras en ms (100 = 10 por segundo), eg: 100
     */
    //% block="send to fisicabit.com time and %valor every %ms ms"
    //% blockId=fisicabit_usb_enviar_1
    //% group="1. Send (inside forever)"
    //% weight=100
    //% ms.min=5 ms.max=60000 ms.defl=100
    //% inlineInputMode=inline
    export function enviar1(valor: number, ms: number): void {
        _enviar([valor], ms)
    }

    /**
     * Envía a fisicabit.com el tiempo (ms) y dos valores medidos, y espera
     * hasta la próxima muestra. Colocar dentro de "para siempre".
     * Línea enviada: tiempo,valor1,valor2
     *
     * Ejemplo: [enviar a fisicabit.com tiempo, (aceleración x) y (aceleración y) cada (100) ms]
     * En fisicabit.com: USB, 2 variables, "Micro:bit envía timestamp" activado.
     *
     * @param valor1 Primer valor medido
     * @param valor2 Segundo valor medido
     * @param ms Tiempo entre muestras en ms, eg: 100
     */
    //% block="send to fisicabit.com time, %valor1 and %valor2 every %ms ms"
    //% blockId=fisicabit_usb_enviar_2
    //% group="1. Send (inside forever)"
    //% weight=95
    //% ms.min=5 ms.max=60000 ms.defl=100
    //% inlineInputMode=inline
    export function enviar2(valor1: number, valor2: number, ms: number): void {
        _enviar([valor1, valor2], ms)
    }

    /**
     * Envía a fisicabit.com el tiempo (ms) y tres valores medidos, y espera
     * hasta la próxima muestra. Colocar dentro de "para siempre".
     * Línea enviada: tiempo,valor1,valor2,valor3
     *
     * Ejemplo: aceleración x, y, z cada 100 ms.
     * En fisicabit.com: USB, 3 variables, "Micro:bit envía timestamp" activado.
     *
     * @param valor1 Primer valor medido
     * @param valor2 Segundo valor medido
     * @param valor3 Tercer valor medido
     * @param ms Tiempo entre muestras en ms, eg: 100
     */
    //% block="send to fisicabit.com time, %valor1 , %valor2 and %valor3 every %ms ms"
    //% blockId=fisicabit_usb_enviar_3
    //% group="1. Send (inside forever)"
    //% weight=90
    //% ms.min=5 ms.max=60000 ms.defl=100
    //% inlineInputMode=inline
    export function enviar3(valor1: number, valor2: number, valor3: number, ms: number): void {
        _enviar([valor1, valor2, valor3], ms)
    }

    /**
     * Envía a fisicabit.com el tiempo (ms) y cuatro valores medidos, y espera
     * hasta la próxima muestra. Colocar dentro de "para siempre".
     * Línea enviada: tiempo,valor1,valor2,valor3,valor4
     *
     * En fisicabit.com: USB, 4 variables, "Micro:bit envía timestamp" activado.
     *
     * @param valor1 Primer valor medido
     * @param valor2 Segundo valor medido
     * @param valor3 Tercer valor medido
     * @param valor4 Cuarto valor medido
     * @param ms Tiempo entre muestras en ms, eg: 100
     */
    //% block="send to fisicabit.com time, %valor1 , %valor2 , %valor3 and %valor4 every %ms ms"
    //% blockId=fisicabit_usb_enviar_4
    //% group="1. Send (inside forever)"
    //% weight=85
    //% ms.min=5 ms.max=60000 ms.defl=100
    //% inlineInputMode=inline
    export function enviar4(valor1: number, valor2: number, valor3: number, valor4: number, ms: number): void {
        _enviar([valor1, valor2, valor3, valor4], ms)
    }

    // =========================================================================
    // ENVÍO DE DATOS SIN TIEMPO — sólo los valores medidos, sin espera
    // =========================================================================

    /**
     * Envía a fisicabit.com por USB SOLO un valor medido, sin el tiempo del
     * micro:bit y sin esperar: se manda en el momento en que se ejecuta el
     * bloque. Usalo al presionar un botón, en cualquier evento, o dentro de
     * "para siempre" con la pausa que quieras. Línea enviada: valor
     * La página pone el tiempo con el reloj del navegador.
     *
     * Ejemplo: [al presionar botón A] → [enviar a fisicabit.com sin tiempo (temperatura)]
     * En fisicabit.com: USB, 1 variable, "Micro:bit envía timestamp" DESACTIVADO.
     *
     * @param valor Valor medido
     */
    //% block="send to fisicabit.com without time %valor"
    //% blockId=fisicabit_usb_enviar_st_1
    //% group="Send without time"
    //% weight=83
    //% inlineInputMode=inline
    export function enviarSinTiempo1(valor: number): void {
        _enviarSinTiempo([valor])
    }

    /**
     * Envía a fisicabit.com por USB SOLO dos valores medidos, sin el tiempo del
     * micro:bit y sin esperar: se manda en el momento en que se ejecuta el
     * bloque. Usalo al presionar un botón, en cualquier evento, o dentro de
     * "para siempre" con la pausa que quieras. Línea enviada: valor1,valor2
     * La página pone el tiempo con el reloj del navegador.
     *
     * Ejemplo: [para siempre] → [enviar a fisicabit.com sin tiempo (aceleración x) y (aceleración y)] + [pausa 200 ms]
     * En fisicabit.com: USB, 2 variables, "Micro:bit envía timestamp" DESACTIVADO.
     *
     * @param valor1 Primer valor medido
     * @param valor2 Segundo valor medido
     */
    //% block="send to fisicabit.com without time %valor1 and %valor2"
    //% blockId=fisicabit_usb_enviar_st_2
    //% group="Send without time"
    //% weight=82
    //% inlineInputMode=inline
    export function enviarSinTiempo2(valor1: number, valor2: number): void {
        _enviarSinTiempo([valor1, valor2])
    }

    /**
     * Envía a fisicabit.com por USB SOLO tres valores medidos, sin el tiempo del
     * micro:bit y sin esperar: se manda en el momento en que se ejecuta el
     * bloque. Usalo al presionar un botón, en cualquier evento, o dentro de
     * "para siempre" con la pausa que quieras. Línea enviada: valor1,valor2,valor3
     * La página pone el tiempo con el reloj del navegador.
     *
     * Ejemplo: [para siempre] → [enviar ... sin tiempo (aceleración x), (y) y (z)] + [pausa 100 ms]
     * En fisicabit.com: USB, 3 variables, "Micro:bit envía timestamp" DESACTIVADO.
     *
     * @param valor1 Primer valor medido
     * @param valor2 Segundo valor medido
     * @param valor3 Tercer valor medido
     */
    //% block="send to fisicabit.com without time %valor1 , %valor2 and %valor3"
    //% blockId=fisicabit_usb_enviar_st_3
    //% group="Send without time"
    //% weight=81
    //% inlineInputMode=inline
    export function enviarSinTiempo3(valor1: number, valor2: number, valor3: number): void {
        _enviarSinTiempo([valor1, valor2, valor3])
    }

    /**
     * Envía a fisicabit.com por USB SOLO cuatro valores medidos, sin el tiempo del
     * micro:bit y sin esperar: se manda en el momento en que se ejecuta el
     * bloque. Usalo al presionar un botón, en cualquier evento, o dentro de
     * "para siempre" con la pausa que quieras. Línea enviada: valor1,valor2,valor3,valor4
     * La página pone el tiempo con el reloj del navegador.
     *
     * Ejemplo: cuatro sensores en un evento o en "para siempre" con pausa
     * En fisicabit.com: USB, 4 variables, "Micro:bit envía timestamp" DESACTIVADO.
     *
     * @param valor1 Primer valor medido
     * @param valor2 Segundo valor medido
     * @param valor3 Tercer valor medido
     * @param valor4 Cuarto valor medido
     */
    //% block="send to fisicabit.com without time %valor1 , %valor2 , %valor3 and %valor4"
    //% blockId=fisicabit_usb_enviar_st_4
    //% group="Send without time"
    //% weight=80
    //% inlineInputMode=inline
    export function enviarSinTiempo4(valor1: number, valor2: number, valor3: number, valor4: number): void {
        _enviarSinTiempo([valor1, valor2, valor3, valor4])
    }

    // =========================================================================
    // SENSORES INTERNOS Y EXTERNOS
    // =========================================================================

    /**
     * Lee un sensor interno del micro:bit y devuelve su valor numérico.
     *
     * EJEMPLO DE USO EN BLOQUES:
     *   [leer sensor interno (temperatura)] → 23
     *   [enviar a fisicabit.com tiempo y (leer sensor interno (nivel de luz)) cada (100) ms]
     *
     * EJEMPLO EN TYPESCRIPT:
     *   let temp = FisicaBitSerial.leerSensorInterno(TipoSensorInterno.Temperatura)
     *   basic.showNumber(temp)
     *
     * @param sensor El tipo de sensor interno a leer (ver enum TipoSensorInterno)
     * @returns Valor numérico del sensor (la unidad depende del sensor)
     */
    //% block="read internal sensor %sensor"
    //% blockId=fisicabit_leer_sensor_interno
    //% group="Internal sensors"
    //% weight=100
    //% sensor.defl=TipoSensorInterno.Temperatura
    export function leerSensorInterno(sensor: TipoSensorInterno): number {
        switch (sensor) {
            // ── Temperatura ──────────────────────────────────────────
            // Lee el termistor integrado en el chip nRF52833.
            // Precisión: ±4°C (no es un termómetro de laboratorio)
            // Rango: -40°C a +105°C
            // Nota: mide la temperatura del CHIP, no del ambiente.
            //       Puede estar 2-4°C por encima de la temp. real.
            case TipoSensorInterno.Temperatura:
                return input.temperature()

            // ── Acelerómetro (3 ejes) ────────────────────────────────
            // Mide la aceleración en mili-g (1g = 1000 mili-g)
            // Rango: ±2g por defecto (configurable a ±4g, ±8g)
            // Ejes: X = izquierda/derecha
            //       Y = adelante/atrás
            //       Z = arriba/abajo (en reposo ≈ -1024 por gravedad)
            case TipoSensorInterno.AcelerometroX:
                return input.acceleration(Dimension.X)
            case TipoSensorInterno.AcelerometroY:
                return input.acceleration(Dimension.Y)
            case TipoSensorInterno.AcelerometroZ:
                return input.acceleration(Dimension.Z)

            // ── Nivel de Luz ─────────────────────────────────────────
            // Usa los LEDs de la matriz 5x5 como fotodetectores
            // Rango: 0 (oscuridad total) a 255 (luz intensa)
            // Truco: los LEDs pueden detectar fotones cuando están
            //        en modo "reverso". MakeCode lo hace automáticamente.
            case TipoSensorInterno.NivelLuz:
                return input.lightLevel()

            // ── Brújula (heading) ────────────────────────────────────
            // Devuelve la dirección en grados (0-359)
            // 0° = Norte, 90° = Este, 180° = Sur, 270° = Oeste
            // IMPORTANTE: requiere calibración la primera vez
            //             (aparece el juego "TILT TO FILL SCREEN")
            case TipoSensorInterno.Brujula:
                return input.compassHeading()

            // ── Nivel de Sonido (solo micro:bit v2) ──────────────────
            // Micrófono MEMS integrado en micro:bit v2
            // Rango: 0 (silencio) a 255 (sonido fuerte)
            // Nota: en micro:bit v1 devuelve 0 siempre
            case TipoSensorInterno.NivelSonido:
                return input.soundLevel()

            // ── Fuerza G (magnitud total) ────────────────────────────
            // Calcula: √(x² + y² + z²) usando los 3 ejes
            // En reposo ≈ 1024 (≈1g de gravedad)
            // Útil para detectar caídas, golpes, vibración
            case TipoSensorInterno.FuerzaG:
                return input.acceleration(Dimension.Strength)

            default:
                return 0
        }
    }


    // NOTE: All acceleration-related code (constants, state, filters and
    // blocks) lives in the FisicaBitCinematica namespace below — this
    // keeps the orange "FisicaBit Sensors" category focused on raw
    // sensor reads and moves the derived kinematic magnitudes (a⃗, v⃗)
    // to their own blue category.

    // =========================================================================
    // GRUPO 2: SENSORES EXTERNOS (conectados a los pines GPIO)
    // =========================================================================
    //
    // MAPA DE PINES DEL MICRO:BIT (borde inferior):
    // ┌──────────────────────────────────────────────────┐
    // │  Pin   │ Tipo       │ Notas                      │
    // ├──────────────────────────────────────────────────┤
    // │  P0    │ Analógico  │ Táctil (v2), DAC           │
    // │  P1    │ Analógico  │ Táctil                     │
    // │  P2    │ Analógico  │ Táctil                     │
    // │  P3-P4 │ Digital    │ Columnas LED (compartido)  │
    // │  P5-P11│ Digital    │ Filas/Col LED (compartido)  │
    // │  P8    │ Digital    │ Libre, sin conflicto        │
    // │  P12   │ Digital    │ Libre, sin conflicto        │
    // │  P13   │ Digital    │ SPI (SCK)                   │
    // │  P14   │ Digital    │ SPI (MISO)                  │
    // │  P15   │ Digital    │ SPI (MOSI)                  │
    // │  P16   │ Digital    │ Libre, sin conflicto        │
    // │  P19   │ I2C        │ SCL (compartido)            │
    // │  P20   │ I2C        │ SDA (compartido)            │
    // └──────────────────────────────────────────────────┘
    //
    // PINES RECOMENDADOS PARA SENSORES EXTERNOS:
    //   - Analógicos: P0, P1, P2 (los únicos con ADC)
    //   - Digitales libres: P8, P12, P16
    //   - I2C: P19+P20 (bus compartido con sensores internos)
    // =========================================================================

    /**
     * Lee un sensor analógico conectado a un pin.
     *
     * CABLEADO:
     *   Sensor → Pin analógico (P0, P1 o P2)
     *   VCC    → 3V del micro:bit
     *   GND    → GND del micro:bit
     *
     * EJEMPLO — Potenciómetro en P0:
     *   ┌─────────────────┐
     *   │  Potenciómetro   │
     *   │  ┌───┐          │
     *   │  │   │──── P0   │  (señal analógica)
     *   │  │   │──── 3V   │  (alimentación)
     *   │  │   │──── GND  │  (tierra)
     *   │  └───┘          │
     *   └─────────────────┘
     *
     * @param pin Pin analógico donde está conectado el sensor
     * @returns Valor entre 0 y 1023 (resolución ADC de 10 bits)
     */
    //% block="read analog sensor on %pin"
    //% blockId=fisicabit_leer_analogico
    //% group="External sensors"
    //% weight=90
    //% pin.defl=PinAnalogico.P0
    export function leerSensorAnalogico(pin: PinAnalogico): number {
        // El ADC del nRF52833 es de 12 bits internamente,
        // pero MakeCode lo escala a 10 bits (0-1023) por compatibilidad
        switch (pin) {
            case PinAnalogico.P0: return pins.analogReadPin(AnalogPin.P0)
            case PinAnalogico.P1: return pins.analogReadPin(AnalogPin.P1)
            case PinAnalogico.P2: return pins.analogReadPin(AnalogPin.P2)
            default: return 0
        }
    }


    /**
     * Lee un sensor digital (HIGH/LOW) conectado a un pin.
     *
     * Útil para sensores como:
     *   - PIR (movimiento): HIGH = movimiento detectado
     *   - Interruptores/botones: HIGH/LOW según estado
     *   - Sensor infrarrojo: HIGH = obstáculo detectado
     *
     * CABLEADO — Sensor PIR en P8:
     *   ┌─────────────────┐
     *   │  Sensor PIR      │
     *   │  ┌───────┐      │
     *   │  │  OUT  │──── P8   (señal digital)
     *   │  │  VCC  │──── 3V   (alimentación)
     *   │  │  GND  │──── GND  (tierra)
     *   │  └───────┘      │
     *   └─────────────────┘
     *
     * @param pin Número del pin digital (ej: 8 para P8, 12 para P12)
     * @returns 0 (LOW) o 1 (HIGH)
     */
    //% block="read digital sensor on P%pin"
    //% blockId=fisicabit_leer_digital
    //% group="External sensors"
    //% weight=85
    //% pin.defl=8
    export function leerSensorDigital(pin: number): number {
        return pins.digitalReadPin(pin as any)
    }


    // =========================================================================
    // GRUPO 2b: SENSOR DE TEMPERATURA NTC 10K 3950
    // =========================================================================
    //
    // CÓMO FUNCIONA:
    //   El NTC (Negative Temperature Coefficient) es una resistencia cuyo
    //   valor DISMINUYE al aumentar la temperatura. A 25°C vale 10kΩ.
    //
    //   Se conecta en un divisor de tensión con una resistencia fija de
    //   10kΩ. El micro:bit lee el voltaje en el punto medio y calcula
    //   la temperatura usando la ecuación Beta (Steinhart-Hart simplificada):
    //
    //     1/T = 1/T₀ + (1/β) × ln(R_ntc / R₀)
    //
    //   donde T₀ = 298.15 K (25°C), R₀ = 10000 Ω, β = 3950
    //
    // CABLEADO:
    //   ┌─────────────────────────────────────────────┐
    //   │                                             │
    //   │  3V ─── [10kΩ fijo] ───┬─── Pin analógico   │
    //   │                        │    (P0, P1 o P2)   │
    //   │                   [NTC 10kΩ]                │
    //   │                        │                    │
    //   │                       GND                   │
    //   │                                             │
    //   └─────────────────────────────────────────────┘
    //
    //   ⚠ El NTC tiene 2 cables (sin polaridad), no importa cuál
    //     va a GND y cuál al punto medio del divisor.
    //
    // PRECISIÓN:
    //   El ADC de 10 bits (0-1023) da ~0.15°C de resolución en el
    //   rango 0-50°C. Suficiente para experimentos de física.
    // =========================================================================

    /**
     * Lee la temperatura de un sensor NTC 10K 3950 conectado a un pin
     * analógico con una resistencia fija de 10kΩ como divisor de tensión.
     *
     * Devuelve la temperatura con 1 decimal de precisión.
     *
     * @param pin Pin analógico donde está conectado el NTC
     * @param unidad Unidad de temperatura deseada
     * @returns Temperatura medida (con 1 decimal)
     */
    //% block="NTC 10K temperature on %pin in %unidad"
    //% blockId=fisicabit_ntc_10k
    //% group="External sensors"
    //% weight=88
    //% pin.defl=PinAnalogico.P0
    //% unidad.defl=UnidadTemperatura.Celsius
    export function leerTemperaturaNTC(pin: PinAnalogico, unidad: UnidadTemperatura): number {
        let lectura: number
        switch (pin) {
            case PinAnalogico.P0: lectura = pins.analogReadPin(AnalogPin.P0); break
            case PinAnalogico.P1: lectura = pins.analogReadPin(AnalogPin.P1); break
            case PinAnalogico.P2: lectura = pins.analogReadPin(AnalogPin.P2); break
            default: lectura = 0
        }

        // Proteger contra lecturas extremas (divisor de tensión saturado)
        if (lectura <= 0) lectura = 1
        if (lectura >= 1023) lectura = 1022

        // Divisor de tensión: R_ntc = R_fija × lectura / (1023 - lectura)
        let rNtc = 10000.0 * lectura / (1023 - lectura)

        // Ecuación Beta: 1/T = 1/T₀ + (1/β) × ln(R_ntc / R₀)
        // T₀ = 298.15 K (25°C), β = 3950, R₀ = 10000 Ω
        let invT = 1.0 / 298.15 + (1.0 / 3950) * Math.log(rNtc / 10000)
        let tempC = 1.0 / invT - 273.15

        // Convertir a la unidad solicitada (1 decimal de precisión)
        switch (unidad) {
            case UnidadTemperatura.Celsius:
                return Math.round(tempC * 10) / 10
            case UnidadTemperatura.Fahrenheit:
                return Math.round((tempC * 9 / 5 + 32) * 10) / 10
            case UnidadTemperatura.Kelvin:
                return Math.round((tempC + 273.15) * 10) / 10
            default:
                return Math.round(tempC * 10) / 10
        }
    }



    // ── HC-SR04 (ultrasónico) ────────────────────────────────────────────────
    let _usUltimoValido = 0     // Último valor válido (respaldo si falla la lectura)

    function _usLecturaCrudaMm(pinTrig: DigitalPin, pinEcho: DigitalPin): number {
        pins.digitalWritePin(pinTrig, 0)
        control.waitMicros(2)
        pins.digitalWritePin(pinTrig, 1)
        control.waitMicros(10)
        pins.digitalWritePin(pinTrig, 0)

        let duracion = pins.pulseIn(pinEcho, PulseValue.High, 25000)

        if (duracion <= 0) return -1

        let distMm = Math.idiv(duracion * 343, 2000)

        if (distMm < 20 || distMm > 4000) return -1


        return distMm
    }

    /**
     * Insertion sort para arrays pequeños (eficiente para N ≤ 7).
     */
    function _usOrdenar(arr: number[], len: number): void {
        for (let i = 1; i < len; i++) {
            let clave = arr[i]
            let j = i - 1
            while (j >= 0 && arr[j] > clave) {
                arr[j + 1] = arr[j]
                j--
            }
            arr[j + 1] = clave
        }
    }

    /**
     * Convierte una distancia en mm a la unidad solicitada.
     */
    function _usConvertir(mm: number, unidad: UnidadDistancia): number {
        switch (unidad) {
            case UnidadDistancia.Milimetros:
                return mm
            case UnidadDistancia.Centimetros:
                return Math.idiv(mm, 10)
            case UnidadDistancia.Pulgadas:
                return Math.idiv(mm * 10, 254)
            default:
                return Math.idiv(mm, 10)
        }
    }

    /**
     * Configura el filtro del sensor ultrasónico.
     *
     * Para MRU/MRUV: filtro "suave" (mediana de 3) da buen equilibrio.
     * Para caída libre: filtro "ninguno" si necesitas máxima frecuencia.
     *
     * @param filtro Intensidad del filtro (más muestras = más suave pero más lento)

    /**
     * Mide la distancia con un sensor ultrasónico HC-SR04 (2 a 400 cm).
     * Usa la mediana de 3 lecturas para eliminar picos espurios (~12 Hz máx.).
     *
     * Ejemplo: [enviar a fisicabit.com tiempo y (HC-SR04 distancia TRIG P8 ECHO P12 en cm) cada (100) ms]
     *   → posición de un carrito o un péndulo en función del tiempo.
     *
     * Conexión física HC-SR04 → micro:bit:
     *   VCC  → 3V (o 5V según módulo)
     *   GND  → GND
     *   TRIG → P8
     *   ECHO → P12
     *
     * @param pinTrig Pin conectado a TRIG (disparo)
     * @param pinEcho Pin conectado a ECHO (respuesta)
     * @param unidad Unidad de medida deseada
     * @returns Distancia medida en la unidad seleccionada
     */
    //% block="HC-SR04 distance TRIG %pinTrig ECHO %pinEcho in %unidad"
    //% blockId=fisicabit_ultrasonido
    //% group="External sensors"
    //% weight=70
    //% pinTrig.defl=DigitalPin.P8
    //% pinEcho.defl=DigitalPin.P12
    //% unidad.defl=UnidadDistancia.Centimetros
    export function medirDistanciaUltrasonido(
        pinTrig: DigitalPin,
        pinEcho: DigitalPin,
        unidad: UnidadDistancia
    ): number {
        let n = 3   // mediana de 3 lecturas: buen equilibrio entre ruido y velocidad

        if (n <= 1) {
            let mm = _usLecturaCrudaMm(pinTrig, pinEcho)
            if (mm > 0) {
                _usUltimoValido = mm
                return _usConvertir(mm, unidad)
            }
            return _usConvertir(_usUltimoValido, unidad)
        }

        let lecturas: number[] = []
        let validas = 0

        for (let i = 0; i < n; i++) {
            let mm = _usLecturaCrudaMm(pinTrig, pinEcho)
            if (mm > 0) {
                lecturas.push(mm)
                validas++
            }
            if (i < n - 1) {
                control.waitMicros(2500)
            }
        }

        if (validas === 0) {
            return _usConvertir(_usUltimoValido, unidad)
        }

        _usOrdenar(lecturas, validas)
        let medianaMm = lecturas[Math.idiv(validas, 2)]

        _usUltimoValido = medianaMm
        return _usConvertir(medianaMm, unidad)
    }

    /**
     * Mide la distancia con el HC-SR04 sin ningún filtro.
     * Máxima velocidad de muestreo (~40 Hz).
     *
     * @param pinTrig Pin conectado a TRIG (disparo)
     * @param pinEcho Pin conectado a ECHO (respuesta)
     * @param unidad Unidad de medida deseada

    // =========================================================================
    // PASO 2: OPCIONAL — velocidad alta y control del tiempo
    // =========================================================================

    /**
     * Bucle rápido para fisicabit.com: ejecuta el código interior cada
     * X ms con temporización precisa, sin el retardo oculto de
     * "para siempre". Usar en lugar de "para siempre" para 50-100 Hz
     * (caída libre, choques, resortes). Adentro va el bloque "enviar a
     * fisicabit.com"; su tiempo "cada ... ms" se ignora dentro del bucle.
     *
     * Ejemplo: [bucle rápido cada (20) ms] con [enviar a fisicabit.com tiempo y (aceleración z) cada (20) ms] → 50 Hz.
     *
     * @param ms Tiempo entre muestras en ms (20 = 50 por segundo, 10 = 100 por segundo), eg: 20
     * @param cuerpo Código a ejecutar en cada muestra
     */
    //% block="fisicabit.com fast loop every %ms ms"
    //% blockId=fisicabit_usb_bucle
    //% group="2. Optional"
    //% weight=80
    //% ms.min=5 ms.max=60000 ms.defl=20
    //% blockAllowMultiple=0
    export function bucleMuestreo(ms: number, cuerpo: () => void): void {
        const m = _asegurar()
        m.fijarPeriodo(ms)
        m.bucle(cuerpo)
    }

    /**
     * Vuelve el tiempo a 0. Útil para empezar una nueva medición al apretar
     * un botón: la próxima línea enviada arranca en tiempo 0.
     *
     * Ejemplo: [al presionar botón A] → [reiniciar tiempo USB a 0]
     */
    //% block="reset USB time to 0"
    //% blockId=fisicabit_usb_reiniciar_tiempo
    //% group="2. Optional"
    //% weight=75
    export function reiniciarTiempo(): void {
        _asegurar().reiniciarTiempo()
    }

    /**
     * Tiempo en milisegundos desde que se inició el envío por USB (arranca
     * en 0). Es el mismo tiempo que viaja en cada línea. Sirve para
     * mostrarlo en la pantalla o para cálculos propios.
     */
    //% block="USB time (ms)"
    //% blockId=fisicabit_serial_tiempo
    //% group="2. Optional"
    //% weight=70
    export function tiempoSerial(): number {
        return _asegurar().tiempo()
    }

    // =========================================================================
    // AVANZADO
    // =========================================================================

    /**
     * Activa o desactiva el envío del tiempo del micro:bit como primera
     * columna. Debe coincidir con la opción "Micro:bit envía timestamp"
     * de fisicabit.com (activada por defecto). Si la desactivás, la página
     * usa el reloj del navegador.
     * @param activar true = enviar tiempo (por defecto), false = sólo valores
     */
    //% block="USB send micro:bit timestamp %activar"
    //% blockId=fisicabit_usb_timestamp
    //% group="Advanced"
    //% weight=50
    //% activar.shadow=toggleOnOff
    //% activar.defl=true
    //% advanced=true
    export function enviarTimestamp(activar: boolean): void {
        _asegurar().enviarTiempo = activar
    }

    /**
     * Cantidad de decimales con que se envían los valores no enteros.
     * @param decimales Decimales (0 a 6). Por defecto 2.
     */
    //% block="USB set decimals %decimales"
    //% blockId=fisicabit_usb_decimales
    //% group="Advanced"
    //% weight=45
    //% decimales.min=0 decimales.max=6 decimales.defl=2
    //% advanced=true
    export function fijarDecimales(decimales: number): void {
        _asegurar().decimales = Math.round(decimales)
    }

    /**
     * Envía una línea de texto libre por USB (sin tiempo ni espera).
     * @param texto Texto a enviar
     */
    //% block="USB send line %texto"
    //% blockId=fisicabit_usb_linea
    //% group="Advanced"
    //% weight=40
    //% advanced=true
    export function enviarLinea(texto: string): void {
        _asegurar()
        serial.writeLine(texto)
    }

}
