class Net {

    constructor() {
        console.log("Net.js działa")

    }

    cokolwiek(x) {
        $.ajax({
            data: { "action": "cokolwiek" },
            type: "POST",
            success: function (data) {
                var obj = JSON.parse(data)

            },
            error: function (xhr, status, error) {
                console.log(xhr);
            },
        });
    }
}
