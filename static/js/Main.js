var net,
    ui,
    game,
    board,
    client

var gameData = {
    nickname: undefined,
    oponent: {
        nickname: undefined,
    },

}

var localData = {
    portalParticles: [],
    playerOrder: undefined,
}

$(document).ready(function () {

    client = io();
    net = new Net()
    ui = new UI()
    game = new Game3D()
    board = new Board3D()
    console.log("Main.js loaded and ready")

    client.on("onconnect", function (data) {
        console.log("Connected")
    })
    net.handleDisconnect()
})