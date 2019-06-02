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
    playerMovement()
})

var gameData = {
    nickname: undefined,
    oponent: {
        nickname: undefined,
    },
    buttons: {
        upButton: false,
        downButton: false,
        leftButton: false,
        rightButton: false,
    }
}

var localData = {
    portalParticles: [],
    starParticles: [],
    playerOrder: undefined,
    testPlayer: undefined,
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