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
}
