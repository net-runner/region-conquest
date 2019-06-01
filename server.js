var qs = require("querystring");
var fs = require("fs")
var app = require("http").createServer(handler)
var socketio = require("socket.io")(app);

function handler(req, res) {
    switch (req.method) {
        case "GET":
            if (req.url == "/") {
                fs.readFile("static/index.html", function (error, data) {
                    res.writeHead(200, { "Content-Type": "text/html" });
                    res.write(data);
                    res.end();
                })
            }
            else if (req.url.indexOf(".css") != -1) {
                fs.readFile("static/" + decodeURI(req.url), function (error, data) {
                    res.writeHead(200, { "Content-Type": "text/css" });
                    res.write(data);
                    res.end();
                })
            }
            else if (req.url.indexOf(".js") != -1) {
                fs.readFile("static/" + decodeURI(req.url), function (error, data) {
                    res.writeHead(200, { "Content-type": "application/javascript" });
                    res.write(data);
                    res.end();
                })
            }
            else if (req.url.indexOf(".mp3") != -1) {
                fs.readFile("static/" + decodeURI(req.url), function (error, data) {
                    res.writeHead(200, { "Content-type": "audio/mp3" });
                    res.write(data);
                    res.end();
                })
            }
            else if (req.url.indexOf(".jpg") != -1) {
                fs.readFile("static/" + decodeURI(req.url), function (error, data) {
                    res.writeHead(200, { "Content-type": "image/jpg" });
                    res.write(data);
                    res.end();
                })
            }
            else if (req.url.indexOf(".png") != -1) {
                fs.readFile("static/" + decodeURI(req.url), function (error, data) {
                    res.writeHead(200, { "Content-type": "image/png" });
                    res.write(data);
                    res.end();
                })
            }
            else if (req.url.indexOf(".gif") != -1) {
                fs.readFile("static/" + decodeURI(req.url), function (error, data) {
                    res.writeHead(200, { "Content-type": "image/gif" });
                    res.write(data);
                    res.end();
                })
            }
            else if (req.url.indexOf(".ttf") != -1) {
                fs.readFile("static/" + decodeURI(req.url), function (error, data) {
                    res.writeHead(200, { "Content-type": "application/octet-stream" });
                    res.write(data);
                    res.end();
                })
            }
            break;
        case "POST":
            servResponse(req, res)
            break;
    }
}

var players = []

var servResponse = function (req, res) {
    var allData = "";
    req.on("data", function (data) {
        allData += data
    })
    req.on("end", function (data) {
        var finish = qs.parse(allData)
        var response = {
            status: undefined,
        }
        switch (finish.action) {
            case "login":
                if (players.length < 2) {
                    if (players[0] != finish.nick) {
                        players.push(finish.nick)
                        response.status = "LOGGED_IN"
                        if (players.length == 2) { }
                    }
                    else {
                        response.status = "USER_EXISTS"
                    }
                }
                else {
                    response.status = "LOBBY_FULL"
                }
                break;
            case "resetNicknames":
                players.pop()
                response.status = "LOBBY_POP()"
                break;
        }
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(JSON.stringify(response));
    })
}

socketio.on("connection", function (client) {
    console.log("połączono: " + client.id)
    client.emit("onconnect", { dzien: "dobry" });
    client.on("disconnect", function () {
        console.log("rozłączono: " + client.id)
    });

});

const port = 4000
app.listen(port, function () {
    console.log("[" + port + "] Dzieńdobry")
});