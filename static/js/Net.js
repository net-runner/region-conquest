class Net {

    constructor() {
        console.log("Net.js działa")

    }

    login(nickname) {
        $.ajax({
            data: { "action": "login", "nick": nickname },
            type: "POST",
            success: function (data) {
                var obj = JSON.parse(data)
                console.log(obj.status)
                if (obj.status == "LOGGED_IN") {
                    document.getElementById("overlay").style.visibility = "hidden"
                    game.loggedIn()
                }
            },
            error: function (xhr, status, error) {
                console.log(xhr);
            },
        });
    }
    resetNicknames() {
        $.ajax({
            data: { "action": "resetNicknames" },
            type: "POST",
            success: function (data) {
                var obj = JSON.parse(data)
                console.log(obj.status)
            },
            error: function (xhr, status, error) {
                console.log(xhr);
            },
        });
    }
}
