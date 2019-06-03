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
                    game.init() //ekran oczekiwania na drugiego gracza wkleić tutaj potem
                    console.log("Logged in")
                    gameData.id = data.loginInfo.id
                    if (data.loginInfo.oponent_nickname == undefined) {
                        localData.playerOrder = "first"
                        console.log("Awaiting oponent")
                        document.getElementById("overlay").style.visibility = "hidden"
                    }
                    else {
                        localData.playerOrder = "second"
                        gameData.oponent.nickname = data.loginInfo.oponent_nickname
                        // game.init()
                        game.loggedIn()
                        player.spawnPlayer(true)
                        document.getElementById("overlay").style.visibility = "hidden"
                    }
                }
                else {
                    window.alert("Lobby full. Try again later")
                    client.emit("end")
                }
            }
        })
        client.on("nickname", function (data) {
            console.log(data)
            gameData.oponent.nickname = data.oponent_nickname
            gameData.oponent.id = data.oponent_id
            game.init()
            game.loggedIn()
            player.spawnPlayer(true)
            document.getElementById("overlay").style.visibility = "hidden"
        })
        client.on("oponentXZ", function (data) {
            if (gameData.oponent.container) {
                gameData.oponent.container.position.x = data.x
                gameData.oponent.container.position.z = data.z
            }
        })
        client.on("oponentRot", function (data) {
            if (gameData.oponent.container) {
                gameData.oponent.container.rotation.y = data.rot
            }
        })
    }
    resetNicknames() {
        client.emit("reset")
    }
    handleDisconnect() {
        client.on("disconnect", function () {
            console.log("Disconnected")
            window.alert("Disconnected")
            location.reload() //Jeśli chcesz
        })
    }
}
