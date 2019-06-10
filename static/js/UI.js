class UI {

    constructor() {
        console.log("UI.js loaded")
        this.clicks()
    }
    clicks() {
        $("#login1").on("click", function () {
            const userCheck = /^[a-zA-Z0-9\-]+$/
            const nickname = $("#nick1").val();
            if (nickname.match(userCheck) != null) {
                const password = $("#pass1").val();
                const alert1 = $("#maxChar")
                if (nickname.length > 10) {
                    console.log(alert1)
                    alert1.css("visibility", "visible")
                    setTimeout(() => {
                        alert1.css("visibility", "hidden")
                    }, 2000);
                } else {
                    if (nickname != "" && password == "") {
                        net.login(nickname)
                    } else if (nickname != "" && password != "") {
                        net.performLogin(nickname, password)
                    }
                }
            } else {
                ui.alert("Nickname is invalid. Use only letters, numbers and '-'  ")
            }

        })
        $("#reset1").on("click", function () {
            net.resetNicknames()
        })
        $("#pass1").on("input", function () {
            const password = $("#pass1").val();
            if (password == "")
                document.getElementById("login1").value = "PLAY"
            if (password != "")
                document.getElementById("login1").value = "LOGIN"
        })
    }
    removeOverlay() {
        document.getElementById("overlay").remove()
        document.getElementById("gameTime").style.top = "0px"
        if (gameData.loginStatus != "reconnect") {
            document.getElementById("rightSide").style.right = "0px"
            document.getElementById("leftSide").style.left = "0px"
            setTimeout(() => {
                document.getElementById("rightSide").style.right = "-20vw"
                document.getElementById("leftSide").style.left = "-20vw"
            }, 10000);
        }
    }
    playerStats(x) {
        console.log(x)
        if (x.nickname) document.getElementsByClassName("nickInfo")[1].innerHTML = x.nickname
        if (x.wins) document.getElementsByClassName("winsInfo")[1].innerHTML = x.wins
        if (x.loses) document.getElementsByClassName("losesInfo")[1].innerHTML = x.loses
        if (x.totalRegionsConquered) document.getElementsByClassName("regsConqInfo")[1].innerHTML = x.totalRegionsConquered
        if (x.totalTimeSpent) document.getElementsByClassName("timeSpentInfo")[1].innerHTML = x.totalTimeSpent
    }
    oponentStats(x) {
        console.log(x)
        if (x.oponent_nickname) document.getElementsByClassName("nickInfo")[0].innerHTML = x.oponent_nickname
        if (x.oponent_wins) document.getElementsByClassName("winsInfo")[0].innerHTML = x.oponent_wins
        if (x.oponent_loses) document.getElementsByClassName("losesInfo")[0].innerHTML = x.oponent_loses
        if (x.oponent_totalRegionsConquered) document.getElementsByClassName("regsConqInfo")[0].innerHTML = x.oponent_totalRegionsConquered
        if (x.oponent_totalTimeSpent) document.getElementsByClassName("timeSpentInfo")[0].innerHTML = x.oponent_totalTimeSpent
    }
    refreshTime(time) {
        document.getElementById("gameTime")
    }
    alert(alercik) {
        document.getElementById("alert").style.visibility = "visible"
        document.getElementById("alert").innerHTML = alercik
        // window.alert("Oponent disconnected.")
        setTimeout(() => {
            document.getElementById("alert").style.visibility = "hidden"
        }, 5000);
    }
    loadingOverlayOpen(alercik) {
        let wait = document.getElementById("awaiting")
        let waitBox = document.getElementsByClassName("smallBox")[0]
        gameData.playerOrder == 0 ? wait.style.backgroundColor = "#0000ff23" : wait.style.backgroundColor = "#ff000023"
        gameData.playerOrder == 0 ? waitBox.style.backgroundColor = "#0003c062" : waitBox.style.backgroundColor = "#ff000066"
        wait.style.visibility = "visible"
        document.getElementById("awaitingText").innerHTML = alercik
    }
    loadingOverlayClose() {
        document.getElementById("awaiting").style.visibility = "hidden"
    }
    loadLoggingScreen() {
        let overl = document.getElementById("overlayContainer")
        overl.style.display = "flex"
        setTimeout(() => {
            overl.style.top = "50vh"
        }, 1000);
    }
}
