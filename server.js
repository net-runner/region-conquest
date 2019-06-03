var qs = require("querystring");
var fs = require("fs")
var app = require("http").createServer(handler)
var io = require("socket.io")(app);
var u_log = require("./modules/usersLogic.js")
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
var connections = [[]]
io.on("connection", function (client) {
    console.log("Connected: " + client.id)
    var loginInfo = {}

    var clientData = {
        id: client.id,
        nick: undefined,
    }

    client.on("disconnect", function () {
        console.log("Disconnected: " + client.id)
        io.sockets.to(client.id).emit("disconnect")
        if (u_log.isInAnyLobby(connections, client.id)) {
            console.log(connections)
            u_log.changeConnectedStatus(connections, client.id)
            let opid = u_log.getOponentId(connections, client.id)
            io.sockets.to(opid).emit("opdisconn")
        }
        console.log(connections)
    });
    client.on("login", function (data) {
        let nickname = data.nickname
        if (u_log.isReconnectAvailable(connections, nickname)) {
            u_log.update(connections, nickname, client.id)
        } else {
            if (u_log.isNicknameAvailable(connections, nickname)) {
                let lobby = connections.length - 1

                clientData.connected = true
                clientData.nick = nickname
                loginInfo.status = "successful"
                loginInfo.id = client.id
                loginInfo.currentLobby = lobby

                if (connections[lobby].length == 1) {

                    loginInfo.order = 1
                    loginInfo.oponent_nickname = clientData.nick
                    loginInfo.oponent_id = connections[lobby][0].id
                    clientData.order = 1

                    connections[lobby].push(clientData)
                    connections.push([])

                    io.sockets.to(connections[lobby][0].id).emit("nickname", {
                        oponent_nickname: data.nickname,
                        oponent_id: client.id
                    });

                    io.sockets.to(client.id).emit("loginResponse", { loginInfo })

                } else {

                    loginInfo.order = 0
                    clientData.order = 0

                    connections[lobby].push(clientData)

                    io.sockets.to(client.id).emit("loginResponse", { loginInfo })
                }
            } else {
                io.sockets.to(client.id).emit("loginResponse")
            }
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
    client.on("oponent_movment", function (data) {
        io.sockets.to(data.oponent_id).emit("oponent_movment", {
            x: data.x,
            z: data.z,
        })
    })
    client.on("oponent_rotation", function (data) {
        io.sockets.to(data.oponent_id).emit("oponent_rotation", {
            rot: data.rot
        })
    })
});
function getAndCloseAllSockets() {
    Object.keys(io.sockets.sockets).forEach(function (s) {
        io.sockets.sockets[s].disconnect(true);
    });
}
const port = 3000
app.listen(port, function () {
    console.log("[" + port + "] Dzieńdobry")
});