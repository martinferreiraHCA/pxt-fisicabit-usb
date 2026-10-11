// test.ts — Prueba funcional de FisicaBit BT
// Corre en el simulador; en hardware, abrir fisicabit.com → BLUETOOTH, elegir la
// micro:bit, 1 variable y "Micro:bit envía timestamp" activado: deben llegar
// líneas "tiempo,aceleraciónX" a 10 por segundo, con el tiempo desde 0.
FisicaBitBT.inicioRapido()
basic.forever(function () {
    FisicaBitBT.enviar1(input.acceleration(Dimension.X), 100)
})
input.onButtonPressed(Button.A, function () {
    FisicaBitBT.reiniciarTiempo()
})
