// test.ts — Prueba funcional de FisicaBit USB
// Corre en el simulador; en hardware, abrir fisicabit.com por USB con 2 variables
// y "Micro:bit envía timestamp" activado: deben llegar líneas "tiempo,luz,temperatura".
basic.showIcon(IconNames.Yes)
basic.forever(function () {
    FisicaBitSerial.enviar2(
        FisicaBitSerial.leerSensorInterno(TipoSensorInterno.NivelLuz),
        FisicaBitSerial.leerSensorInterno(TipoSensorInterno.Temperatura),
        100
    )
})
input.onButtonPressed(Button.A, function () {
    FisicaBitSerial.reiniciarTiempo()
    FisicaBitSerial.enviarSinTiempo1(FisicaBitSerial.leerSensorAnalogico(PinAnalogico.P0))
})
// Ultrasonido HC-SR04 en TRIG P8 / ECHO P12: con el botón B muestra el estado y,
// mientras se mantiene apretado A+B, envía "tiempo,distancia" a la frecuencia del sensor.
input.onButtonPressed(Button.B, function () {
    FisicaBitSerial.fijarAlcanceUltrasonido(150)
    FisicaBitSerial.fijarFiltroUltrasonido(FiltroUltrasonido.Suave)
    basic.showString(FisicaBitSerial.estadoUltrasonido(DigitalPin.P8, DigitalPin.P12))
    basic.showNumber(FisicaBitSerial.medirDistanciaUltrasonido(DigitalPin.P8, DigitalPin.P12, UnidadDistancia.Centimetros))
})
input.onButtonPressed(Button.AB, function () {
    for (let i = 0; i < 100; i++) {
        FisicaBitSerial.enviarDistanciaUltrasonido(DigitalPin.P8, DigitalPin.P12, UnidadDistancia.Metros)
    }
})
