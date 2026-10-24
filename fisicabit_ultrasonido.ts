// =============================================================================
//  fisicabit_ultrasonido.ts — Sensores ultrasónicos HC-SR04 y HY-SRF05
// =============================================================================
//  Proyecto: FisicaBit.com
//  Portado de pxt-fisicabit (ultrasonic.ts, versión 1.2.0) a la extensión
//  reducida "FisicaBit USB". Mismos bloques y la misma medición; sin el
//  muestreador nativo en C++ (opcional allá), para que esta extensión siga
//  siendo sólo TypeScript y compatible con cualquier proyecto.
//
//  Sensores: HC-SR04 (4 pines) y HY-SRF05 (5 pines; con OUT libre se comporta
//            como el HC-SR04; con OUT a GND usa un solo cable TRIG/ECHO).
//  Alcance: 2 cm – 400 cm (≈1,5–2 m alimentado a 3 V). Frecuencia: 40 kHz.
//
//  CÓMO FUNCIONA:
//    1. Se manda un pulso ALTO de 10 µs por TRIG.
//    2. El módulo emite 8 pulsos a 40 kHz y pone ECHO en alto hasta que
//       vuelve el rebote: ancho del pulso = tiempo de ida y vuelta.
//    3. distancia = ancho × velocidad del sonido / 2 (la velocidad depende
//       de la temperatura del aire: 331,3 + 0,606·T m/s).
//
//  CABLEADO (igual para ambos; el simulador dibuja el sensor y los cables):
//    VCC → 3V · GND → GND · TRIG → P8 · ECHO → P12   (HY-SRF05: OUT libre)
//    Con 5 V en VCC, divisor 1 kΩ / 2 kΩ en ECHO (el micro:bit tolera 3,3 V).
//    Segundo sensor: TRIG P1 · ECHO P2. Tercero: TRIG P15 · ECHO P16.
//
//  MEDICIÓN:
//    Ping clásico, idéntico al pxt-sonar de Microsoft: TRIG bajo 2 µs, alto
//    10 µs, bajo; pins.pulseIn en ECHO; distancia = eco µs × velocidad del
//    sonido / 2 (la fórmula "eco / 2000000 × 343"). Una medición por llamada
//    al bloque, probada en módulos HC-SR04 / HY-SRF05 reales.
//    El HC-SR04 ignora un disparo mientras corre su ciclo interno (≈25-30 ms):
//    los bloques nunca disparan más rápido que cada 30 ms; si se los llama
//    antes devuelven el valor anterior sin bloquear.
//    Filtro: mediana deslizante (no baja la frecuencia) + rechazo de saltos
//    + calibración de offset. El bloque "enviar a fisicabit.com distancia"
//    marca cada línea con el instante físico en que el sonido tocó el objeto.
// =============================================================================

namespace FisicaBitSerial {

    // ── Configuración global ──
    let _usFiltroN = 3          // mediana deslizante de N lecturas
    let _usMinMm = 20
    let _usMaxMm = 3000         // alcance máximo: define el tiempo de espera del eco y la frecuencia
    let _usPeriodoMs = 0        // 0 = automático según el alcance
    let _usSaltoMaxMm = 0       // rechazo de saltos (0 = desactivado)
    let _usTempC = 20           // temperatura del aire para la velocidad del sonido

    function _usVelocidadMmPorS(): number {
        return Math.round((331.3 + 0.606 * _usTempC) * 1000)
    }

    class SensorUltrasonico {
        trig: DigitalPin
        echo: DigitalPin
        unCable: boolean
        ultimoPingMs: number        // instante del último ping (espaciado)
        ultimaMuestraMs: number     // instante físico del último eco válido (ms, 1 decimal)
        ultimoCrudoMm: number       // última distancia cruda (sin filtro), -1 = sin eco
        hist: number[]
        ultimoValor: number         // última distancia válida (mm, con offset)
        ultimoOk: boolean
        offsetMm: number
        constructor(trig: DigitalPin, echo: DigitalPin) {
            this.trig = trig
            this.echo = echo
            this.unCable = (trig == echo)
            this.ultimoPingMs = -100000
            this.ultimaMuestraMs = 0
            this.ultimoCrudoMm = -1
            this.hist = []
            this.ultimoValor = 0
            this.ultimoOk = false
            this.offsetMm = 0
        }
    }
    let _usSensores: SensorUltrasonico[] = []

    function _usObtener(trig: DigitalPin, echo: DigitalPin): SensorUltrasonico {
        for (let i = 0; i < _usSensores.length; i++) {
            const t = _usSensores[i]
            if (t.trig == trig && t.echo == echo) return t
        }
        const s = new SensorUltrasonico(trig, echo)
        _usSensores.push(s)
        return s
    }

    /**
     * Una medición clásica, exactamente como `sonar.ping` del pxt-sonar de
     * Microsoft: TRIG bajo 2 µs, alto 10 µs, bajo; después pins.pulseIn en ECHO.
     * Distancia (mm) = eco µs × velocidad del sonido (mm/s) / 2 000 000, o sea
     * la fórmula "eco / 2000000 × 343" en metros. Devuelve -1 si no llega eco
     * dentro del tiempo de vuelo del alcance configurado.
     */
    function _usPing(s: SensorUltrasonico): number {
        pins.setPull(s.trig, PinPullMode.PullNone)
        const t0 = input.runningTimeMicros()
        pins.digitalWritePin(s.trig, 0)
        control.waitMicros(2)
        pins.digitalWritePin(s.trig, 1)
        control.waitMicros(10)
        pins.digitalWritePin(s.trig, 0)
        // pxt-sonar usa maxCm × 58 µs; el mismo valor a partir del alcance y la temperatura
        const limite = Math.idiv(_usMaxMm * 2 * 1000000, _usVelocidadMmPorS()) + 3000
        const dur = pins.pulseIn(s.echo, PulseValue.High, limite)
        s.ultimoPingMs = control.millis()
        if (dur <= 0) { s.ultimoCrudoMm = -1; return -1 }
        // Instante físico de la medición: el módulo emite la ráfaga ≈0,45 ms
        // después del disparo y el sonido llega al objeto a mitad del eco
        // (resolución 0,1 ms: a 10 m/s un objeto se mueve 1 mm en 0,1 ms).
        s.ultimaMuestraMs = Math.round((t0 + 12 + 450 + dur / 2) / 100) / 10
        s.ultimoCrudoMm = Math.idiv(dur * _usVelocidadMmPorS(), 2000000)
        return s.ultimoCrudoMm
    }

    // Separación mínima entre pings. El HC-SR04 ignora un disparo mientras
    // corre su ciclo interno (≈25-30 ms): un disparo más rápido no produce
    // eco, pulseIn espera todo el tiempo límite y el bloque sólo repetiría el
    // valor anterior (medido: pidiendo 10 ms → 36 ms reales con 80 % de
    // muestras repetidas; pidiendo 30 ms → 30 ms reales, todas nuevas).
    const US_PERIODO_MIN_MS = 30

    /** Período entre pings (ms): el pedido por el usuario, o tiempo de vuelo + 8 ms, nunca menor que el ciclo del módulo. */
    function _usPeriodoClasicoMs(): number {
        let p = _usPeriodoMs > 0 ? _usPeriodoMs : Math.idiv(_usMaxMm * 2 * 1000, _usVelocidadMmPorS()) + 8
        if (p < US_PERIODO_MIN_MS) p = US_PERIODO_MIN_MS
        if (p > 500) p = 500
        return p
    }

    /**
     * Lee UNA muestra nueva. -2 = todavía no toca (respeta el ciclo del
     * módulo); -1 = eco inválido; ≥0 = distancia cruda en mm.
     */
    function _usLeerCrudo(s: SensorUltrasonico): number {
        // Nunca disparar más rápido que el ciclo del módulo. Si se llama
        // antes, el bloque devuelve el valor anterior sin bloquear.
        if (control.millis() - s.ultimoPingMs < _usPeriodoClasicoMs()) return -2
        return _usPing(s)
    }

    /** Insertion sort para arreglos chicos (N ≤ 7). */
    function _usOrdenar(arr: number[], len: number): void {
        for (let i = 1; i < len; i++) {
            let clave = arr[i]
            let j = i - 1
            while (j >= 0 && arr[j] > clave) { arr[j + 1] = arr[j]; j-- }
            arr[j + 1] = clave
        }
    }

    /** Distancia filtrada (mm): mediana deslizante + rechazo de saltos + offset. */
    function _usLeerFiltrado(s: SensorUltrasonico): number {
        let d = _usLeerCrudo(s)
        if (d == -2) return s.ultimoValor
        if (d >= 0) d += s.offsetMm
        if (d < _usMinMm || d > _usMaxMm) d = -1
        if (d >= 0 && _usSaltoMaxMm > 0 && s.ultimoOk && Math.abs(d - s.ultimoValor) > _usSaltoMaxMm) d = -1
        if (d < 0) {
            s.ultimoOk = false
            return s.ultimoValor
        }
        s.ultimoOk = true
        if (_usFiltroN <= 1) {
            s.ultimoValor = d
            return d
        }
        s.hist.push(d)
        while (s.hist.length > _usFiltroN) s.hist.shift()
        let copia: number[] = []
        for (let i = 0; i < s.hist.length; i++) copia.push(s.hist[i])
        _usOrdenar(copia, copia.length)
        s.ultimoValor = copia[Math.idiv(copia.length, 2)]
        return s.ultimoValor
    }

    function _usConvertir(mm: number, unidad: UnidadDistancia): number {
        switch (unidad) {
            case UnidadDistancia.Milimetros: return mm
            case UnidadDistancia.Pulgadas: return Math.round(mm / 25.4 * 100) / 100
            case UnidadDistancia.Metros: return Math.round(mm) / 1000     // m con 3 decimales
            default: return Math.round(mm) / 10         // cm con 1 decimal
        }
    }

    function _usDecimales(unidad: UnidadDistancia): number {
        if (unidad == UnidadDistancia.Milimetros) return 0
        if (unidad == UnidadDistancia.Pulgadas) return 2
        if (unidad == UnidadDistancia.Metros) return 3
        return 1
    }

    /**
     * Envía por USB una línea "tiempo,distancia" (o sólo "distancia" si el
     * envío del tiempo está desactivado) con el instante físico de la muestra
     * en la base de tiempo de fisicabit.com. Si el ping no tuvo eco no envía
     * nada, en vez de repetir un valor viejo.
     */
    function _usEnviar(s: SensorUltrasonico, unidad: UnidadDistancia): void {
        const m = _asegurar()
        // Respetar el período entre pings (pxt-sonar recomienda ≥ 60 ms entre
        // pings a largo alcance) para que un eco nunca se superponga al siguiente.
        const espera = _usPeriodoClasicoMs() - (control.millis() - s.ultimoPingMs)
        if (espera > 0) basic.pause(espera)
        const mm = _usLeerFiltrado(s)
        if (!s.ultimoOk) return
        const dist = FisicaBitDatos.formatear(_usConvertir(mm, unidad), _usDecimales(unidad))
        if (!m.enviarTiempo) {
            serial.writeLine(dist)
            return
        }
        // Tiempo de la muestra = instante en que el sonido tocó el objeto, en
        // la base de tiempo del envío USB (no el instante en que se escribe la línea)
        const origenMs = input.runningTime() - m.tiempo()
        let tMs = s.ultimaMuestraMs - origenMs
        if (tMs < 0) tMs = 0
        serial.writeLine(FisicaBitDatos.formatear(tMs, 1) + "," + dist)
    }

    // =========================================================================
    // MEDICIÓN
    // =========================================================================

    /**
     * Distancia medida con un HC-SR04 (2 a 400 cm). Se inicializa solo: un
     * pulso de 10 µs en TRIG, se mide el eco y la distancia sale del tiempo
     * de vuelo con la velocidad del sonido corregida por temperatura. El
     * bloque devuelve la última medición filtrada (mediana deslizante); si
     * falla el eco, devuelve la última válida. Nunca dispara más rápido que
     * el ciclo del módulo (30 ms).
     *
     * Cableado: VCC → 3V, GND → GND, TRIG → P8, ECHO → P12 (el simulador lo
     * muestra). Con 5 V en VCC, divisor 1 kΩ / 2 kΩ en ECHO.
     *
     * Ejemplo (MRU): [para siempre] → [enviar a fisicabit.com tiempo y
     * (HC-SR04 distancia TRIG P8 ECHO P12 en cm) cada 50 ms]
     * @param pinTrig Pin conectado a TRIG (disparo)
     * @param pinEcho Pin conectado a ECHO (respuesta)
     * @param unidad Unidad: cm (1 decimal), mm, pulgadas o m (3 decimales)
     */
    //% block="HC-SR04 distancia TRIG %pinTrig ECHO %pinEcho en %unidad"
    //% blockId=fisicabit_ultrasonido
    //% group="Ultrasonido (HC-SR04 / HY-SRF05)"
    //% weight=100
    //% parts="hcsr04" trackArgs=0,1
    //% pinTrig.defl=DigitalPin.P8
    //% pinEcho.defl=DigitalPin.P12
    //% unidad.defl=UnidadDistancia.Centimetros
    export function medirDistanciaUltrasonido(pinTrig: DigitalPin, pinEcho: DigitalPin, unidad: UnidadDistancia): number {
        return _usConvertir(_usLeerFiltrado(_usObtener(pinTrig, pinEcho)), unidad)
    }

    /**
     * Distancia medida con un HY-SRF05. Con OUT libre (modo 4 cables) se
     * cablea igual que el HC-SR04: VCC → 3V, GND → GND, TRIG → P8,
     * ECHO → P12. Modo de un solo cable (OUT a GND): poné el MISMO pin en
     * TRIG y ECHO. El resto funciona igual que el bloque del HC-SR04.
     * @param pinTrig Pin conectado a TRIG (disparo)
     * @param pinEcho Pin conectado a ECHO (o el mismo que TRIG en modo 1 cable)
     * @param unidad Unidad: cm (1 decimal), mm, pulgadas o m (3 decimales)
     */
    //% block="HY-SRF05 distancia TRIG %pinTrig ECHO %pinEcho en %unidad"
    //% blockId=fisicabit_us_srf05
    //% group="Ultrasonido (HC-SR04 / HY-SRF05)"
    //% weight=99
    //% parts="hysrf05" trackArgs=0,1
    //% pinTrig.defl=DigitalPin.P8
    //% pinEcho.defl=DigitalPin.P12
    //% unidad.defl=UnidadDistancia.Centimetros
    export function medirDistanciaSRF05(pinTrig: DigitalPin, pinEcho: DigitalPin, unidad: UnidadDistancia): number {
        return _usConvertir(_usLeerFiltrado(_usObtener(pinTrig, pinEcho)), unidad)
    }

    /**
     * Envía a fisicabit.com por USB cada eco del HC-SR04 con el instante real
     * en que el sonido tocó el objeto: una línea "tiempo,distancia" por
     * muestra, a la frecuencia del sensor (≈33 Hz; con alcances largos, la
     * que permite el tiempo de vuelo). Omite las muestras sin eco en vez de
     * repetir valores viejos. Poner dentro de "para siempre"; no hace falta
     * "cada ... ms". En fisicabit.com: 1 variable, "Micro:bit envía
     * timestamp" activado.
     *
     * Ejemplo (carrito en riel): [para siempre] → [enviar a fisicabit.com
     * distancia HC-SR04 TRIG P8 ECHO P12 en cm]
     * @param pinTrig Pin conectado a TRIG
     * @param pinEcho Pin conectado a ECHO
     * @param unidad Unidad: cm (1 decimal), mm, pulgadas o m (3 decimales)
     */
    //% block="enviar a fisicabit.com distancia HC-SR04 TRIG %pinTrig ECHO %pinEcho en %unidad"
    //% blockId=fisicabit_us_enviar_hcsr04
    //% group="Ultrasonido (HC-SR04 / HY-SRF05)"
    //% weight=98
    //% inlineInputMode=inline
    //% parts="hcsr04" trackArgs=0,1
    //% pinTrig.defl=DigitalPin.P8
    //% pinEcho.defl=DigitalPin.P12
    //% unidad.defl=UnidadDistancia.Centimetros
    export function enviarDistanciaUltrasonido(pinTrig: DigitalPin, pinEcho: DigitalPin, unidad: UnidadDistancia): void {
        _usEnviar(_usObtener(pinTrig, pinEcho), unidad)
    }

    /**
     * Envía a fisicabit.com por USB cada eco del HY-SRF05 con el instante
     * real en que el sonido tocó el objeto (una línea por muestra, a la
     * frecuencia del sensor). Modo 1 cable: el mismo pin en TRIG y ECHO.
     * @param pinTrig Pin conectado a TRIG
     * @param pinEcho Pin conectado a ECHO
     * @param unidad Unidad: cm (1 decimal), mm, pulgadas o m (3 decimales)
     */
    //% block="enviar a fisicabit.com distancia HY-SRF05 TRIG %pinTrig ECHO %pinEcho en %unidad"
    //% blockId=fisicabit_us_enviar_srf05
    //% group="Ultrasonido (HC-SR04 / HY-SRF05)"
    //% weight=97
    //% inlineInputMode=inline
    //% parts="hysrf05" trackArgs=0,1
    //% pinTrig.defl=DigitalPin.P8
    //% pinEcho.defl=DigitalPin.P12
    //% unidad.defl=UnidadDistancia.Centimetros
    export function enviarDistanciaSRF05(pinTrig: DigitalPin, pinEcho: DigitalPin, unidad: UnidadDistancia): void {
        _usEnviar(_usObtener(pinTrig, pinEcho), unidad)
    }

    // =========================================================================
    // CONFIGURACIÓN
    // =========================================================================

    /**
     * Alcance máximo que te interesa medir. Define cuánto se espera el eco
     * (y, con alcances largos, la frecuencia de muestreo). Para un carrito en
     * un riel de 1,5 m usá 150 cm.
     * @param cm Alcance máximo en cm (20 a 600)
     */
    //% block="fijar alcance máximo ultrasónico %cm cm"
    //% blockId=fisicabit_us_alcance
    //% group="Ultrasonido (HC-SR04 / HY-SRF05)"
    //% weight=90
    //% cm.min=20 cm.max=600 cm.defl=300
    export function fijarAlcanceUltrasonido(cm: number): void {
        _usMaxMm = Math.max(200, Math.min(6000, Math.round(cm * 10)))
    }

    /**
     * Suavizado: mediana de las últimas 3, 5 o 7 muestras. No baja la
     * frecuencia de muestreo; agrega un retardo de 1, 2 o 3 muestras.
     * Para MRU/MRUV: suave. Para choques o caída libre: ninguno.
     * @param filtro Intensidad del filtro
     */
    //% block="fijar filtro ultrasónico a %filtro"
    //% blockId=fisicabit_us_configurar
    //% group="Ultrasonido (HC-SR04 / HY-SRF05)"
    //% weight=88
    //% filtro.defl=FiltroUltrasonido.Suave
    export function fijarFiltroUltrasonido(filtro: FiltroUltrasonido): void {
        _usFiltroN = filtro
        for (let i = 0; i < _usSensores.length; i++) _usSensores[i].hist = []
    }

    /**
     * Estado del sensor en pocas palabras, para mostrar en pantalla y saber
     * al instante qué pasa: "OK 45cm" = mide bien; "SIN ECO" = el sensor no
     * responde (revisar VCC: muchos HC-SR04 necesitan 5 V; GND; y que haya
     * un objeto a menos del alcance); "ECHO ALTO" = el pin ECHO quedó en
     * alto (TRIG y ECHO cruzados o módulo sin alimentación).
     * @param pinTrig Pin conectado a TRIG
     * @param pinEcho Pin conectado a ECHO
     */
    //% block="estado del ultrasonido TRIG %pinTrig ECHO %pinEcho"
    //% blockId=fisicabit_us_estado
    //% group="Ultrasonido (HC-SR04 / HY-SRF05)"
    //% weight=86
    //% parts="hcsr04" trackArgs=0,1
    //% pinTrig.defl=DigitalPin.P8
    //% pinEcho.defl=DigitalPin.P12
    export function estadoUltrasonido(pinTrig: DigitalPin, pinEcho: DigitalPin): string {
        const s = _usObtener(pinTrig, pinEcho)
        const d = _usPing(s)
        if (d > 0) return "OK " + Math.idiv(d, 10) + "cm"
        return pins.digitalReadPin(pinEcho) == 1 ? "ECHO ALTO" : "SIN ECO"
    }

    /**
     * Temperatura del aire para calcular la velocidad del sonido
     * (331,3 + 0,606·T m/s). A 20 °C son 343,4 m/s; cada 5 °C cambian ≈1 %
     * las distancias. Podés conectar aquí la lectura de un sensor de temperatura.
     * @param gradosC Temperatura del aire en °C
     */
    //% block="fijar temperatura del aire para ultrasonido %gradosC °C"
    //% blockId=fisicabit_us_temperatura
    //% group="Ultrasonido (HC-SR04 / HY-SRF05)"
    //% weight=70
    //% gradosC.min=-20 gradosC.max=50 gradosC.defl=20
    //% advanced=true
    export function fijarTemperaturaAireUltrasonido(gradosC: number): void {
        _usTempC = gradosC
    }

    /**
     * Frecuencia de muestreo fija en Hz (0 = automática según el alcance).
     * El ciclo del HC-SR04 limita la frecuencia a ≈33 Hz (30 ms). Si pedís
     * más de lo que permite el alcance, el eco de una medición puede
     * contaminar la siguiente: usalo con alcances cortos.
     * @param hz Muestras por segundo (0 = automático, máx. 33)
     */
    //% block="fijar frecuencia de muestreo ultrasónica %hz Hz (0 = auto)"
    //% blockId=fisicabit_us_frecuencia
    //% group="Ultrasonido (HC-SR04 / HY-SRF05)"
    //% weight=68
    //% hz.min=0 hz.max=60 hz.defl=0
    //% advanced=true
    export function fijarFrecuenciaUltrasonido(hz: number): void {
        _usPeriodoMs = hz <= 0 ? 0 : Math.max(15, Math.round(1000 / hz))
    }

    /**
     * Rango válido: las lecturas fuera se descartan y se mantiene la última
     * válida. El máximo también fija el alcance (tiempo de espera del eco).
     * @param minMm Distancia mínima válida en mm (defecto 20)
     * @param maxMm Distancia máxima válida en mm (defecto 3000)
     */
    //% block="fijar rango ultrasónico de %minMm a %maxMm mm"
    //% blockId=fisicabit_us_rango
    //% group="Ultrasonido (HC-SR04 / HY-SRF05)"
    //% weight=66
    //% minMm.defl=20 minMm.min=10
    //% maxMm.defl=3000 maxMm.min=50 maxMm.max=6000
    //% inlineInputMode=inline
    //% advanced=true
    export function fijarRangoUltrasonido(minMm: number, maxMm: number): void {
        _usMinMm = Math.max(10, minMm)
        _usMaxMm = Math.max(50, Math.min(6000, maxMm))
    }

    /**
     * Rechazo de saltos: si una muestra difiere de la anterior en más de
     * este valor se descarta (rebotes laterales, otra persona que cruza).
     * 0 = desactivado. Para un carrito a 1 m/s a 33 Hz el salto real es de
     * 30 mm por muestra: poné 100 mm.
     * @param saltoMaxMm Salto máximo permitido en mm (0 = desactivado)
     */
    //% block="fijar salto máximo ultrasónico %saltoMaxMm mm"
    //% blockId=fisicabit_us_max_cambio
    //% group="Ultrasonido (HC-SR04 / HY-SRF05)"
    //% weight=64
    //% saltoMaxMm.defl=0 saltoMaxMm.min=0
    //% advanced=true
    export function fijarSaltoMaximoUltrasonido(saltoMaxMm: number): void {
        _usSaltoMaxMm = saltoMaxMm
    }

    /**
     * Calibra el offset del sensor: poné una superficie plana a una distancia
     * conocida (por ejemplo 300 mm medidos con cinta), ejecutá el bloque y
     * la extensión corrige todas las lecturas siguientes. Tarda ~1 s y
     * muestra ✓ o ✗ en la pantalla.
     * @param pinTrig Pin conectado a TRIG
     * @param pinEcho Pin conectado a ECHO
     * @param distanciaMm Distancia real al objeto en mm
     */
    //% block="calibrar ultrasonido TRIG %pinTrig ECHO %pinEcho con objeto a %distanciaMm mm"
    //% blockId=fisicabit_us_calibrar
    //% group="Ultrasonido (HC-SR04 / HY-SRF05)"
    //% weight=62
    //% inlineInputMode=inline
    //% parts="hcsr04" trackArgs=0,1
    //% pinTrig.defl=DigitalPin.P8
    //% pinEcho.defl=DigitalPin.P12
    //% distanciaMm.min=50 distanciaMm.max=4000 distanciaMm.defl=300
    //% advanced=true
    export function calibrarUltrasonido(pinTrig: DigitalPin, pinEcho: DigitalPin, distanciaMm: number): void {
        const s = _usObtener(pinTrig, pinEcho)
        const anterior = s.offsetMm
        s.offsetMm = 0
        let suma = 0, n = 0
        for (let i = 0; i < 40 && n < 20; i++) {
            const d = _usPing(s)
            if (d >= 0) { suma += d; n++ }
            basic.pause(40)
        }
        if (n >= 5) {
            s.offsetMm = Math.round(distanciaMm - suma / n)
            s.hist = []
            basic.showIcon(IconNames.Yes)
        } else {
            s.offsetMm = anterior
            basic.showIcon(IconNames.No)
        }
        basic.pause(500)
        basic.clearScreen()
    }

    // =========================================================================
    // DIAGNÓSTICO
    // =========================================================================

    /**
     * Última distancia cruda (sin filtro ni offset) en la unidad elegida;
     * 0 si no hubo eco. Para ver el ruido real del sensor.
     * @param pinTrig Pin conectado a TRIG
     * @param pinEcho Pin conectado a ECHO
     * @param unidad Unidad de medida
     */
    //% block="HC-SR04 distancia cruda TRIG %pinTrig ECHO %pinEcho en %unidad"
    //% blockId=fisicabit_ultrasonido_crudo
    //% group="Ultrasonido (HC-SR04 / HY-SRF05)"
    //% weight=58
    //% parts="hcsr04" trackArgs=0,1
    //% pinTrig.defl=DigitalPin.P8
    //% pinEcho.defl=DigitalPin.P12
    //% unidad.defl=UnidadDistancia.Milimetros
    //% advanced=true
    export function medirDistanciaUltrasonidoCruda(pinTrig: DigitalPin, pinEcho: DigitalPin, unidad: UnidadDistancia): number {
        const s = _usObtener(pinTrig, pinEcho)
        let d = _usLeerCrudo(s)
        if (d == -2) d = s.ultimoCrudoMm
        if (d < 0) return 0
        return _usConvertir(d, unidad)
    }

    /**
     * Verdadero si la última muestra tuvo un eco válido (objeto dentro del
     * alcance y sin salto rechazado).
     */
    //% block="¿eco ultrasónico válido?"
    //% blockId=fisicabit_us_valido
    //% group="Ultrasonido (HC-SR04 / HY-SRF05)"
    //% weight=56
    //% advanced=true
    export function ecoUltrasonidoValido(): boolean {
        for (let i = 0; i < _usSensores.length; i++) if (_usSensores[i].ultimoOk) return true
        return false
    }

    /**
     * Frecuencia real de muestreo del sensor (Hz), medida durante 1 segundo
     * disparándolo tan seguido como permite su ciclo (≈33 Hz; menos con
     * alcances largos o si falla el eco).
     * @param pinTrig Pin conectado a TRIG
     * @param pinEcho Pin conectado a ECHO
     */
    //% block="frecuencia real de muestreo ultrasónica (Hz) TRIG %pinTrig ECHO %pinEcho"
    //% blockId=fisicabit_us_hz
    //% group="Ultrasonido (HC-SR04 / HY-SRF05)"
    //% weight=54
    //% parts="hcsr04" trackArgs=0,1
    //% pinTrig.defl=DigitalPin.P8
    //% pinEcho.defl=DigitalPin.P12
    //% advanced=true
    export function frecuenciaRealUltrasonido(pinTrig: DigitalPin, pinEcho: DigitalPin): number {
        const s = _usObtener(pinTrig, pinEcho)
        const t0 = control.millis()
        let n = 0
        while (control.millis() - t0 < 1000) {
            if (_usLeerCrudo(s) != -2) n++
            basic.pause(1)
        }
        return n
    }

    /**
     * Instante (ms desde el encendido, 1 decimal) en que el sonido tocó el
     * objeto en la última muestra válida.
     * @param pinTrig Pin conectado a TRIG
     * @param pinEcho Pin conectado a ECHO
     */
    //% block="tiempo del último eco ultrasónico (ms) TRIG %pinTrig ECHO %pinEcho"
    //% blockId=fisicabit_us_tiempo
    //% group="Ultrasonido (HC-SR04 / HY-SRF05)"
    //% weight=52
    //% parts="hcsr04" trackArgs=0,1
    //% pinTrig.defl=DigitalPin.P8
    //% pinEcho.defl=DigitalPin.P12
    //% advanced=true
    export function tiempoUltimoEcoUltrasonido(pinTrig: DigitalPin, pinEcho: DigitalPin): number {
        return _usObtener(pinTrig, pinEcho).ultimaMuestraMs
    }
}
