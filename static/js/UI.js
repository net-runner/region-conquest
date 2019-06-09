class UI {

    constructor() {
        console.log("UI.js loaded")
        this.clicks()
    }
    clicks() {
        $("#login1").on("click", function () {
            const nickname = $("#nick1").val();
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
                } else if (nickname != "" && password == "") {
                    net.performLogin(nickname, password)
                }
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
