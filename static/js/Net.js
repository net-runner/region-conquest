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
                    gameData.playerOrder = data.loginInfo.order
                    gameData.currentLobby = data.loginInfo.currentLobby
                    if (data.loginInfo.oponent_nickname == undefined) {
                        console.log("Awaiting oponent")
                        document.getElementById("overlay").style.visibility = "hidden"
                    }
                    else {
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
    sendData_oponentPos() {
        client.emit("current_position", {
            oponent_id: gameData.oponent.id,
            x: gameData.oponent.container.position.x,
            z: gameData.oponent.container.position.z,
            y: gameData.oponent.container.position.y
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
    handleReconnect() {
        client.on("updateID", function (data) {
            console.log(data)
            gameData.oponent.id = data.id
            net.sendData_movment()
            net.sendData_rotation()
            net.sendData_oponentPos()
            console.log("Oponent reconected")
            //I z powrotem dzierżawa klawiszy
            gameData.isGameGoing = true
        })
        client.on("positionUpdate", function (data) {
            console.log(data)
            gameData.playerContainer.position.x = data.x
            gameData.playerContainer.position.z = data.z
            gameData.playerContainer.position.y = data.y
        })
    }
    handleDisconnect() {
        client.on("disconnect", function () {
            console.log("Disconnected")
            window.alert("Disconnected")
            location.reload() //Jeśli chcesz
        })
        client.on("opdisconn", function () {
            window.alert("Oponent disconnected.")

            //Wydzierżawienie klawiszy
            //:P
            gameData.isGameGoing = false
        })
    }
}
