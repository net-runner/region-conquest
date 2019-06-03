class Net {

    constructor() {
        console.log("Net.js loaded")
    }
    login(nickname) {
        gameData.nickname = nickname
        client.emit("login", {
            nickname: nickname,
        })
        client.on("loginResponse", function (data) {
            console.log(data)
            if (data) {
                if (data.loginInfo.status == "successful") {
                    // game.init() //ekran oczekiwania na drugiego gracza wkleić tutaj potem
                    console.log("Logged in")
                    gameData.id = data.loginInfo.id
                    gameData.order = data.loginInfo.order
                    gameData.currentLobby = data.loginInfo.currentLobby
                    if (data.loginInfo.oponent_nickname == undefined) {
                        localData.playerOrder = "first"
                        console.log("Awaiting oponent")
                        document.getElementById("overlay").style.visibility = "hidden"
                    }
                    else {
                        localData.playerOrder = "second"
                        gameData.oponent.nickname = data.loginInfo.oponent_nickname
                        gameData.oponent.id = data.loginInfo.oponent_id
                        game.init()
                        game.loggedIn()
                        player.spawnPlayer(true)
                        document.getElementById("overlay").style.visibility = "hidden"
                    }
                }
            } else {
                window.alert("Nickname already used")
            }
        })
        client.on("nickname", function (data) {
            console.log(data)
            gameData.oponent.nickname = data.oponent_nickname
            gameData.oponent.id = data.oponent_id
            gameData.order = data.order
            gameData.currentLobby = data.currentLobby
            game.init()
            game.loggedIn()
            player.spawnPlayer(true)
            document.getElementById("overlay").style.visibility = "hidden"
        })
    }
    resetNicknames() {
        client.emit("reset")
    }
    sendData_rotation() {
        client.emit("oponent_rotation", {
            oponent_id: gameData.oponent.id,
            rot: gameData.playerContainer.rotation.y,
        })
    }
    sendData_movment() {
        client.emit("oponent_movment", {
            oponent_id: gameData.oponent.id,
            x: gameData.playerContainer.position.x,
            z: gameData.playerContainer.position.z,
        })
    }
    handleMovmentData() {
        client.on("oponent_movment", function (data) {
            if (gameData.oponent.container) {
                gameData.oponent.container.position.x = data.x
                gameData.oponent.container.position.z = data.z
            }
        })
        client.on("oponent_rotation", function (data) {
            if (gameData.oponent.container) {
                gameData.oponent.container.rotation.y = data.rot
            }
        })
    }
    handleDisconnect() {
        client.on("disconnect", function () {
            console.log("Disconnected")
            window.alert("Disconnected")
            location.reload() //Jeśli chcesz
        })
    }
}
