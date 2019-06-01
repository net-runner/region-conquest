class UI {

    constructor() {
        console.log("UI.js działa")
        this.clicks()
    }

    clicks() {
        $("#login1").on("click", function () {
            const nickname = $("#nick1").val();
            if (nickname != "") {
                net.addNickname(nickname)
            }
        })
        $("#reset1").on("click", function () {
            net.resetNicknames()
        })
    }
}
