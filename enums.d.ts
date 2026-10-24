// Enumeraciones de la extensión FisicaBit USB

declare const enum TipoSensorInterno {
    //% block="Temperatura"
    Temperatura = 0,
    //% block="Acelerómetro X"
    AcelerometroX = 1,
    //% block="Acelerómetro Y"
    AcelerometroY = 2,
    //% block="Acelerómetro Z"
    AcelerometroZ = 3,
    //% block="Nivel de Luz"
    NivelLuz = 4,
    //% block="Brújula (heading)"
    Brujula = 5,
    //% block="Nivel Sonido (v2)"
    NivelSonido = 6,
    //% block="Fuerza G"
    FuerzaG = 7
}

declare const enum UnidadTemperatura {
    //% block="°C (Celsius)"
    Celsius = 0,
    //% block="°F (Fahrenheit)"
    Fahrenheit = 1,
    //% block="K (Kelvin)"
    Kelvin = 2
}

declare const enum UnidadDistancia {
    //% block="cm"
    Centimetros = 0,
    //% block="pulgadas"
    Pulgadas = 1,
    //% block="mm"
    Milimetros = 2,
    //% block="m"
    Metros = 3
}

/** Intensidad del filtro de mediana para el ultrasonido (valor = tamaño de la ventana). */
declare const enum FiltroUltrasonido {
    //% block="ninguno (1 lectura)"
    Ninguno = 1,
    //% block="suave (mediana de 3)"
    Suave = 3,
    //% block="medio (mediana de 5)"
    Medio = 5,
    //% block="fuerte (mediana de 7)"
    Fuerte = 7
}

declare const enum PinAnalogico {
    //% block="P0"
    P0 = 0,
    //% block="P1"
    P1 = 1,
    //% block="P2"
    P2 = 2
}
