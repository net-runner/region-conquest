class UI {

    constructor() {
        console.log("UI.js loaded")
        $("#login1").on("click", function () {
            const userCheck = /^[a-zA-Z0-9\-]+$/
            const nickname = $("#nick1").val();
            if (nickname.match(userCheck) != null) {
                const password = $("#pass1").val();
                if (nickname.length > 10) {
                    ui.logScreenAlert("Max. number of characters: 10")
                } else {
                    if (nickname != "" && password == "") {
                        net.login(nickname)
                    } else if (nickname != "" && password != "") {
                        net.performLogin(nickname, password)
                    }
                }
            } else {
                ui.logScreenAlert("Invalid nickname. Use only letters, numbers and '-'")
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
        $("#controls1").on("click", function (e) {
            e.stopPropagation();
            document.getElementById("controlsPanel").style.visibility = "visible"
        })
        $("#overlay").on("click", function () {
            document.getElementById("controlsPanel").style.visibility = "hidden"
        })
    }
    removeOverlay() {
        document.getElementById("overlay").remove()
        document.getElementById("gameTime").style.top = "0px"
        if (gameData.loginStatus != "reconnect") {
            ui.showStats()
        }
    }
    showStats() {
        document.getElementById("rightSide").style.right = "0px"
        document.getElementById("leftSide").style.left = "0px"
        setTimeout(() => {
            document.getElementById("rightSide").style.right = "-20vw"
            document.getElementById("leftSide").style.left = "-20vw"
        }, 10000);
    }
    statsTabOn() {
        document.getElementById("rightSide").style.right = "0px"
        document.getElementById("leftSide").style.left = "0px"
    }
    statsTabOff() {
        document.getElementById("rightSide").style.right = "-20vw"
        document.getElementById("leftSide").style.left = "-20vw"
    }
    playerStats(x) {
        if (x.nickname) document.getElementsByClassName("nickInfo")[1].innerHTML = x.nickname
        if (x.wins) document.getElementsByClassName("winsInfo")[1].innerHTML = x.wins
        if (x.loses) document.getElementsByClassName("losesInfo")[1].innerHTML = x.loses
        if (x.totalRegionsConquered) document.getElementsByClassName("regsConqInfo")[1].innerHTML = x.totalRegionsConquered
        if (x.totalTimeSpent) {
            let mins = Math.floor(x.totalTimeSpent / 60)
            let secs = Math.floor(x.totalTimeSpent - 60 * mins)
            secs < 10 ? secs = "0" + secs : secs
            document.getElementsByClassName("timeSpentInfo")[1].innerHTML = mins + ":" + secs
        }
    }
    oponentStats(x) {
        if (x.oponent_nickname) document.getElementsByClassName("nickInfo")[0].innerHTML = x.oponent_nickname
        if (x.oponent_wins) document.getElementsByClassName("winsInfo")[0].innerHTML = x.oponent_wins
        if (x.oponent_loses) document.getElementsByClassName("losesInfo")[0].innerHTML = x.oponent_loses
        if (x.oponent_totalRegionsConquered) document.getElementsByClassName("regsConqInfo")[0].innerHTML = x.oponent_totalRegionsConquered
        if (x.oponent_totalTimeSpent) {
            let mins = Math.floor(x.oponent_totalTimeSpent / 60)
            let secs = Math.floor(x.oponent_totalTimeSpent - 60 * mins)
            secs < 10 ? secs = "0" + secs : secs
            document.getElementsByClassName("timeSpentInfo")[0].innerHTML = mins + ":" + secs
        }
    }
    refreshTime(time) {
        let mins = Math.floor(time / 60)
        let secs = Math.floor(time - 60 * mins)
        secs < 10 ? secs = "0" + secs : secs
        document.getElementById("gameTime").innerHTML = mins + ":" + secs
    }
    alert(alercik) {
        document.getElementById("alert").style.opacity = "1"
        document.getElementById("alert").innerHTML = alercik
        setTimeout(() => {
            document.getElementById("alert").style.opacity = "0"
        }, 3000);
    }
    logScreenAlert(text) {
        const alert1 = $("#maxChar")
        alert1.html(text)
        alert1.css("visibility", "visible")
        setTimeout(() => {
            alert1.css("visibility", "hidden")
        }, 3000);
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
    endGameAlert(userWon) {
        console.log("KURWAMAĆ")
        let overlay = document.createElement("div")
        let overlayContainer = document.createElement("div")
        overlay.id = "overlay"
        overlayContainer.id = "overlayContainer"
        let h1 = document.createElement("h1")
        let h12 = document.createElement("h1")
        overlayContainer.appendChild(h1)
        overlayContainer.appendChild(h12)
        h1.innerText = "You"
        if (userWon) {
            h12.style.color = "green"
            h12.innerText = "won!"
        } else {
            h12.style.color = "red"
            h12.innerText = "lost!"
        }
        let bt = document.createElement('button')
        bt.classList.add("ovPart")
        bt.innerText = "OK"
        bt.addEventListener("click", function () {
            location.reload()
        })
        console.log(overlay)
        overlayContainer.style.display = "flex"
        overlayContainer.style.visibility = "visible"
        overlayContainer.appendChild(bt)
        overlay.appendChild(overlayContainer)
        document.getElementById("main").appendChild(overlay)
    }
    keyBinding() {
        $(window).keydown(function (e) {
            if (e.which == "87") {
                gameData.buttons.upButton = true;
            }
            else if (e.which == "83") {
                gameData.buttons.downButton = true;
            }
            else if (e.which == "65") {
                gameData.buttons.leftButton = true;
            }
            else if (e.which == "68") {
                gameData.buttons.rightButton = true;
            }
            else if (e.which == "9") {
                e.preventDefault()
                if (gameData.isInGame)
                    ui.statsTabOn()
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
            else if (e.which == "9") {
                e.preventDefault()
                if (gameData.isInGame)
                    ui.statsTabOff()
            }
        })
    }
}
