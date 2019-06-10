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
    ui.loadLoggingScreen()
    game.init()
    net.handleLogin()
    net.handleDisconnect()
    net.handleMovmentData()
    net.handleReconnect()
    net.handleMapData()
    ui.keyBinding()
})

var gameData = {
    loginStatus: undefined,
    board: [],
    isGameGoing: true,
    isInGame: false,
    nickname: undefined,
    oponent: {
        nickname: undefined,
        container: undefined,
        startPos: {
            x: undefined,
            y: 100,
            z: undefined,
        },
        lastPos: {
            x: undefined,
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
        y: 100,
        z: undefined,
    },
    lastPos: {
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
    board3D: [],
    startYpos: [],
    startColors: [],
    scores: [
        undefined,
        undefined
    ],
    globalFont: undefined,
    startOut: [],
    startIn: [],
    startInDone: [],
    startOutDone: [],
    readyToStartIn: true,
    readyToStartOut: true,
    startInCount: 0,
    startOutCount: 0,
    fieldTimeout: undefined,
}