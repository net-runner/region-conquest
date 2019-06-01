class Net {

    constructor() {
        console.log("Net.js działa")

    }

    addNickname(nickname) {
        $.ajax({
            data: { "action": "addNickname", "nick": nickname },
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
