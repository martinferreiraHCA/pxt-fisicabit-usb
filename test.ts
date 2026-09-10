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
