var net,
    ui,
    game,
    board,
    client,
    addons,
    player

$(document).ready(function () {
    client = io();
    net = new Net()
    ui = new UI()
    game = new Game3D()
    board = new Board3D()
    addons = new Addons3D()
    player = new Player()
    console.log("Main.js loaded and ready")
    client.on("onconnect", function (data) {
        console.log("Connected")
    })
    net.handleDisconnect()
})

var gameData = {
    nickname: undefined,
    oponent: {
        nickname: undefined,
    },
}

var localData = {
    portalParticles: [],
    starParticles: [],
    playerOrder: undefined,
}