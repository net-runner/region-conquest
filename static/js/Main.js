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
    net.handleMovmentData()
    net.handleReconnect()
    playerMovement()
})

var gameData = {
    isGameGoing: true,
    nickname: undefined,
    oponent: {
        nickname: undefined,
        container: undefined,
        startPos: {
            x: undefined,
            y: undefined,
            z: undefined,
        },
    },
    buttons: {
        upButton: false,
        downButton: false,
        leftButton: false,
        rightButton: false,
    },
    startPos: {
        x: undefined,
        y: undefined,
        z: undefined,
    },
    playerContainer: undefined,
    borderPos: undefined,
    playerOrder: undefined,
}

var localData = {
    portalParticles: [],
    starParticles: [],
}

function playerMovement() {
    $(window).keydown(function (e) {
        if (e.which == "87") {
            gameData.buttons.upButton = true;
            // mixer.clipAction("run").play();
        }
        else if (e.which == "83") {
            gameData.buttons.downButton = true;
            // mixer.clipAction("crwalk").play();
        }
        else if (e.which == "65") {
            gameData.buttons.leftButton = true;
        }
        else if (e.which == "68") {
            gameData.buttons.rightButton = true;
        }
    })
    $(window).keyup(function (e) {
        if (e.which == "87") {
            gameData.buttons.upButton = false;
        }
        else if (e.which == "83") {
            gameData.buttons.downButton = false;
        }
        else if (e.which == "65") {
            gameData.buttons.leftButton = false;
        }
        else if (e.which == "68") {
            gameData.buttons.rightButton = false;
        }
    })
}