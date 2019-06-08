class UI {

    constructor() {
        console.log("UI.js loaded")
        this.clicks()
    }
    clicks() {
        $("#login1").on("click", function () {
            const nickname = $("#nick1").val();
            if (nickname != "") {
                net.login(nickname)
            }
        })
        $("#reset1").on("click", function () {
            net.resetNicknames()
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
        gameData.playerOrder == 0 ? wait.style.backgroundColor = "#0000ff23" : wait.style.backgroundColor = "#ff000023"
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
