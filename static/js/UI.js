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
}
