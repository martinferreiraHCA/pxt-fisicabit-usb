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
    Milimetros = 2
}

declare const enum PinAnalogico {
    //% block="P0"
    P0 = 0,
    //% block="P1"
    P1 = 1,
    //% block="P2"
    P2 = 2
}
