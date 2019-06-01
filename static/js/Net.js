class Net {

    constructor() {
        console.log("Net.js loaded")
    }
    login(nickname) {
        // $.ajax({
        //     data: { "action": "login", "nick": nickname },
        //     type: "POST",
        //     success: function (data) {
        //         var obj = JSON.parse(data)
        //         console.log(obj.status)
        //         if (obj.status == "LOGGED_IN") {
        //             document.getElementById("overlay").style.visibility = "hidden"
        //             game.loggedIn()
        //         }
        //     },
        //     error: function (xhr, status, error) {
        //         console.log(xhr);
        //     },
        // });
        gameData.nickname = nickname
        client.emit("login", {
            nickname: nickname,
        })
        client.on("loginResponse", function (data) {
            console.log(data)
            if (data) {
                if (data.loginInfo.status == "successful") {
                    console.log("Logged in")
                    gameData.id = data.loginInfo.id
                    if (data.loginInfo.oponent_nickname == undefined) {
                        console.log("Awaiting oponent")
                    } else {
                        gameData.oponent.nickname = data.loginInfo.oponent_nickname
                        game.init()
                    }
                } else {
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
        })
    }
    resetNicknames() {
        // $.ajax({
        //     data: { "action": "resetNicknames" },
        //     type: "POST",
        //     success: function (data) {
        //         var obj = JSON.parse(data)
        //         console.log(obj.status)
        //     },
        //     error: function (xhr, status, error) {
        //         console.log(xhr);
        //     },
        // });
        client.emit("reset")
    }
    handleDisconnect() {
        client.on("disconnect", function () {
            console.log("Disconnected")
            window.alert("Disconnected")
            //location.reload() Jeśli chcesz
        })
    }
}
