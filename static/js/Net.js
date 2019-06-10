class Net {

    constructor() {
        console.log("Net.js loaded")
    }
    login(nickname) {

        client.emit("login", {
            nickname: nickname,
        })
    }
    performLogin(nickname, password) {
        client.emit("performLogin", {
            nickname: nickname,
            password: password
        })
    }
    handleLogin() {
        client.on("loginResponse", function (data) {
            console.log(data)
            if (data) {
                if (data.loginInfo.status == "successful" || data.loginInfo.status == "reconnect") {
                    console.log("Logged in")
                    if (data.loginInfo.wins) {
                        gameData.wins = data.loginInfo.wins
                        gameData.loses = data.loginInfo.loses
                        gameData.totalRegionsConquered = data.loginInfo.totalRegionsConquered
                        gameData.totalTimeSpent = data.loginInfo.totalTimeSpent
                    }
                    if (data.loginInfo.oponent_wins) {
                        gameData.oponent.wins = data.loginInfo.oponent_wins
                        gameData.oponent.loses = data.loginInfo.oponent_loses
                        gameData.oponent.totalRegionsConquered = data.loginInfo.totalRegionsConquered
                        gameData.oponent.totalTimeSpent = data.loginInfo.totalTimeSpent
                    }
                    if (data.loginInfo.status == "reconnect") {
                        gameData.isGameGoing = false;
                        gameData.loginStatus = "reconnect"
                    }
                    gameData.nickname = data.loginInfo.nickname
                    gameData.id = data.loginInfo.id
                    gameData.playerOrder = data.loginInfo.order
                    gameData.currentLobby = data.loginInfo.currentLobby
                    if (data.loginInfo.oponent_nickname == undefined) {
                        ui.playerStats(data.loginInfo)
                        ui.loadingOverlayOpen("Oczekiwanie na przeciwnika...")
                        document.getElementById("overlay").style.visibility = "hidden"
                    }
                    else {
                        ui.playerStats(data.loginInfo)
                        ui.oponentStats(data.loginInfo)
                        gameData.oponent.nickname = data.loginInfo.oponent_nickname
                        gameData.oponent.id = data.loginInfo.oponent_id
                        gameData.isInGame = true
                        game.loggedIn()
                        if (gameData.loginStatus == "reconnect") {
                            player.spawnPlayer(true)
                        }
                        ui.removeOverlay()
                    }
                } else {
                    if (data.loginInfo.status = "wrong-password") {
                        ui.alert("Wrong password")
                    }
                    if (data.loginInfo.status = "no-db-connection") {
                        ui.alert("No database connection. Login failed")
                    }
                }
            } else {
                ui.alert("Nickname already used")
                // window.alert()
            }
        })
        client.on("nickname", function (data) {
            // console.log(data)
            ui.loadingOverlayClose()
            ui.oponentStats(data)
            gameData.isInGame = true
            gameData.oponent.nickname = data.oponent_nickname
            gameData.oponent.id = data.oponent_id
            gameData.currentLobby = data.currentLobby
            if (data.oponent_wins) {
                gameData.oponent.wins = data.oponent_wins
                gameData.oponent.loses = data.oponent_loses
                gameData.oponent.totalRegionsConquered = data.totalRegionsConquered
                gameData.oponent.totalTimeSpent = data.totalTimeSpent
            }
            game.loggedIn()
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
            gameData.oponent.startPos.x = data.x
            gameData.oponent.startPos.z = data.z
        })
        client.on("oponent_rotation", function (data) {
            if (gameData.oponent.container) {
                gameData.oponent.container.rotation.y = data.rot
            }
        })
    }
    handleReconnect() {
        client.on("updateID", function (data) {
            // console.log(data)
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
            // console.log("position Update", data)
            if (gameData.playerContainer) {
                gameData.playerContainer.position.x = data.x
                gameData.playerContainer.position.z = data.z
                gameData.playerContainer.position.y = data.y
            }
            gameData.startPos.x = data.x
            gameData.startPos.y = data.y
            gameData.startPos.z = data.z
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
            ui.refreshTime(data.gameTime)
            addons.refreshText(0, data.blueRegions)
            addons.refreshText(1, data.redRegions)
            gameData.InstanceData = data
            gameData.board = data.regions
            if (data.winner) {
                if (gameData.nickname[0] != "[") {
                    var stats = {
                        nickname: gameData.nickname,
                        wins: 0,
                        loses: 0,
                        timeSpent: data.timeElapsed,
                    }
                    if (data.winner.player == "Red" && gameData.playerOrder == 1) {
                        stats.wins = 1
                    } else if (data.winner.player == "Blue" && gameData.playerOrder == 0) {
                        stats.wins = 1
                    } else {
                        stats.loses = 1
                    }
                    if (gameData.playerOrder == 0) {
                        stats.RegionsConquered = data.totalBlueRegions
                    } else {
                        stats.RegionsConquered = data.totalRedRegions
                    }
                    net.sendEndgameStatistics(stats)
                }
                window.alert("Winner: " + data.winner.player)
                location.reload()
            }
            // console.log(data)
        })
    }
    sendEndgameStatistics(stats) {
        client.emit("updateStatistics", stats)
    }
}
