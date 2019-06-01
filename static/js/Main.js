var net,
    ui,
    game,
    board
$(document).ready(function () {
    var client = io();
    client.on("onconnect", function (data) {
        net = new Net()
        ui = new UI()
        game = new Game3D()
        board = new Board3D()
        game.init()



    })
})
localData = {
    portalParticles: [],
}