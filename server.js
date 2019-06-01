var qs = require("querystring");
var fs = require("fs")
var app = require("http").createServer(handler)
var io = require("socket.io")(app);

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
var connections = []
io.on("connection", function (client) {
    console.log("Connected: " + client.id)
    var loginInfo = {}

    var clientData = {
        id: client.id,
        nick: undefined,
    }

    client.emit("onconnect", { loginInfo });
    client.on("disconnect", function () {
        console.log("Disconnected: " + client.id)
        io.sockets.to(client.id).emit("disconnect")
    });
    client.on("login", function (data) {
        clientData.nick = data.nickname
        loginInfo.status = "successful"
        loginInfo.id = client.id
        if (connections.length == 1) {
            loginInfo.oponent_nickname = connections[connections.length - 1].nick
            loginInfo.oponent_id = connections[connections.length - 1].id
            client.broadcast.emit("nickname", {
                oponent_nickname: data.nickname,
                oponent_id: client.id
            });
            connections.push(clientData)
            io.sockets.to(client.id).emit("loginResponse", { loginInfo })
        } else if (connections.length == 2) {
            loginInfo.status = "lobby_full"
            console.log("Lobby full")
        } else {
            connections.push(clientData)
            io.sockets.to(client.id).emit("loginResponse", { loginInfo })
        }
        console.log(connections)
    })
    client.on("end", function () {
        console.log("END")
        client.disconnect(true);
        for (let i = 0; i < connections.length; i++)
            if (connections[i].id == client.id)
                connections.splice(i, 1)
    });
    client.on("reset", function () {
        getAndCloseAllSockets()
        connections = []
    });
});
function getAndCloseAllSockets() {
    Object.keys(io.sockets.sockets).forEach(function (s) {
        io.sockets.sockets[s].disconnect(true);
    });
}
const port = 4000
app.listen(port, function () {
    console.log("[" + port + "] Dzieńdobry")
});