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
    game.init()
    net.handleDisconnect()
    net.handleMovmentData()
    net.handleReconnect()
    net.handleMapData()
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
    currPos: {
        x: undefined,
        z: undefined,
    },
    playerContainer: undefined,
    borderPos: undefined,
    playerOrder: undefined,
}

var localData = {
    starParticles: [],
    movingBackground: [],
    testAngles: [
        Math.floor(Math.random() * 3),
        Math.floor(Math.random() * 3),
        Math.floor(Math.random() * 3)
    ],
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