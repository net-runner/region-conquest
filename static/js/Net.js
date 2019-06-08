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
                if (data.loginInfo.status == "successful" || data.loginInfo.status == "reconnect") {
                    if (data.loginInfo.status == "reconnect") {
                        gameData.isGameGoing = false;
                    }
                    console.log("Logged in")
                    gameData.id = data.loginInfo.id
                    gameData.playerOrder = data.loginInfo.order
                    gameData.currentLobby = data.loginInfo.currentLobby
                    if (data.loginInfo.oponent_nickname == undefined) {
                        ui.loadingOverlayOpen("Oczekiwanie na przeciwnika...")
                        document.getElementById("overlay").style.visibility = "hidden"
                    }
                    else {
                        gameData.oponent.nickname = data.loginInfo.oponent_nickname
                        gameData.oponent.id = data.loginInfo.oponent_id
                        // game.init()
                        game.loggedIn()
                        player.spawnPlayer(true)
                        ui.removeOverlay()
                    }
                }
            } else {
                ui.alert("Nickname already used")
                // window.alert()
            }
        })
        client.on("nickname", function (data) {
            console.log(data)
            ui.loadingOverlayClose()
            gameData.oponent.nickname = data.oponent_nickname
            gameData.oponent.id = data.oponent_id
            gameData.currentLobby = data.currentLobby
            game.loggedIn()
            player.spawnPlayer(true)
            ui.removeOverlay()
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
    sendData_regionChange(lastPos, currPos) {
        client.emit("region_change", {
            currPos: currPos,
            lastPos: lastPos,
            player: gameData.playerOrder
        })
    }
    handleMovmentData() {
        client.on("oponent_movment", function (data) {
            if (gameData.oponent.container) {
                gameData.oponent.container.position.x = data.x
                gameData.oponent.container.position.z = data.z
                gameData.oponent.lastPos = {
                    x: Math.floor(gameData.oponent.container.clone().position.x / 100),
                    z: Math.floor(gameData.oponent.container.clone().position.z / 100),
                }
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
            ui.loadingOverlayClose()
            console.log("Oponent reconected")
        })
        client.on("enableKeyboard", function () {
            gameData.isGameGoing = true
        })
        client.on("positionUpdate", function (data) {
            console.log("position Update", data)
            gameData.playerContainer.position.x = data.x
            gameData.playerContainer.position.z = data.z
            gameData.playerContainer.position.y = data.y
        })
    }
    handleDisconnect() {
        client.on("disconnect", function () {
            console.log("Disconnected")
            ui.alert("Disconnected")
            // window.alert("Disconnected")
            location.reload() //Jeśli chcesz
        })
        client.on("opdisconn", function () {
            ui.alert("Oponent disconnected")
            ui.loadingOverlayOpen("Oczekiwanie na ponowne połączenie przeciwnika...")
            gameData.isGameGoing = false
        })
    }
    handleMapData() {
        client.on("mapdata", function (data) {
            // console.log("DATA")
            addons.refreshText(0, data.blueRegions)
            addons.refreshText(1, data.redRegions)
            gameData.InstanceData = data
            gameData.board = data.regions
            if (data.winner) {
                window.alert("Winner: " + data.winner.player)
                location.reload()
            }
            // console.log(data)
        })
    }
}
