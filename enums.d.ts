// Enumeraciones de la extensión FisicaBit USB

declare const enum TipoSensorInterno {
    //% block="temperature"
    Temperatura = 0,
    //% block="accelerometer X"
    AcelerometroX = 1,
    //% block="accelerometer Y"
    AcelerometroY = 2,
    //% block="accelerometer Z"
    AcelerometroZ = 3,
    //% block="light level"
    NivelLuz = 4,
    //% block="compass (heading)"
    Brujula = 5,
    //% block="sound level (v2)"
    NivelSonido = 6,
    //% block="force G"
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
    //% block="inches"
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
