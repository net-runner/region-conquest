const qs = require("querystring");
const fs = require("fs");
var app = require("http").createServer(handler);
var io = require("socket.io")(app);
var u_log = require("./modules/usersLogic.js");
var game = require("./modules/gameLogic.js");
const config = require("./config/server_config.json")

//MongoDB
const MongoClient = require('mongodb').MongoClient;
const obID = require("mongodb").ObjectID
const assert = require('assert');
const url = 'mongodb://localhost:27017';
const mClient = new MongoClient(url, { useNewUrlParser: true });

mClient.connect(function (err) {
    assert.equal(null, err);
    if (err != null) {
        console.log("For the best user experience please install and use " +
            "MongoDB on your local machine")
    }
    console.log("Connected successfully to Mongo Server");
    const db = mClient.db(config.database);
    mClient.close();
});
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
            else if (req.url.indexOf(".json") != -1) {
                fs.readFile("static/" + decodeURI(req.url), function (error, data) {
                    res.writeHead(200, { "Content-type": "application/json" });
                    res.write(data);
                    res.end();
                })
            }
            else if (req.url.indexOf(".gltf") != -1) {
                fs.readFile("static/" + decodeURI(req.url), function (error, data) {
                    res.writeHead(200, { "Content-type": "application/object" });
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
var conquestInstances = []
var connections = [[]]
function computeAndSend() {
    game.computeRegionPoints(conquestInstances, config.game)
    for (var i = 0; i < conquestInstances.length; i++) {
        if (conquestInstances[i].isActive) {
            let lobbyID = conquestInstances[i].lobby

            for (var j = 0; j < connections[lobbyID].length; j++) {

                let id = connections[lobbyID][j].id
                io.sockets.to(id).volatile.emit("mapdata", conquestInstances[i])

            }
        }

    }
}
var computeInterval = setInterval(computeAndSend, config.game.interval)
io.on("connection", function (client) {
    console.log("Connected: " + client.id)
    var loginInfo = {}

    var clientData = {
        id: client.id,
        nick: undefined,
    }

    client.on("disconnect", function () {
        console.log("Disconnected: " + client.id)

        if (u_log.isInAnyLobby(connections, client.id)) {
            let id = u_log.getLobbyId(connections, client.id)
            if (conquestInstances[id]) {
                conquestInstances[id].isActive = false;
            }
            u_log.changeConnectedStatus(connections, client.id)
            let opid = u_log.getOponentId(connections, client.id)
            io.sockets.to(opid.id).emit("opdisconn")
        }
        io.sockets.to(client.id).emit("disconnect")

    });
    client.on("login", function (data) {
        let nickname = data.nickname
        loginInfo.status = "successful"
        loginInfo.id = client.id
        if (u_log.isReconnectAvailable(connections, nickname)) {
            u_log.update(connections, nickname, client.id)
            let opid = u_log.getOponentId(connections, client.id)
            let lobbyID = u_log.getLobbyId(connections, client.id)
            loginInfo.order = opid.order
            loginInfo.nickname = nickname
            loginInfo.oponent_id = opid.id
            loginInfo.oponent_nickname = opid.nick
            loginInfo.currentLobby = lobbyID
            loginInfo.status = "reconnect"
            io.sockets.to(client.id).emit("loginResponse", { loginInfo })
            io.sockets.to(opid.id).emit("updateID", { id: client.id })

            if (u_log.isEveryoneConnected(connections, lobbyID)) {
                conquestInstances[lobbyID].isActive = true
                io.sockets.to(client.id).emit("enableKeyboard")
                io.sockets.to(opid.id).emit("enableKeyboard")
            }

        } else {
            if (u_log.isNicknameAvailable(connections, nickname)) {
                let lobby = connections.length - 1

                clientData.connected = true
                clientData.nick = nickname
                clientData.id = client.id
                loginInfo.currentLobby = lobby

                if (connections[lobby].length == 1) {

                    loginInfo.order = 1
                    loginInfo.nickname = clientData.nick
                    loginInfo.oponent_nickname = connections[lobby][0].nick
                    loginInfo.oponent_id = connections[lobby][0].id
                    clientData.order = 1

                    connections[lobby].push(clientData)
                    connections.push([])

                    io.sockets.to(connections[lobby][0].id).emit("nickname", {
                        oponent_nickname: data.nickname,
                        oponent_id: client.id
                    });

                    io.sockets.to(client.id).emit("loginResponse", { loginInfo })
                    conquestInstances.push(game.CreateConquestInstance(lobby, config.game))
                } else {

                    loginInfo.order = 0
                    clientData.order = 0

                    connections[lobby].push(clientData)

                    io.sockets.to(client.id).emit("loginResponse", { loginInfo })
                }
            } else {
                io.sockets.to(client.id).emit("loginResponse")
            }
        } console.log(connections)
    })
    client.on("region_change", function (data) {
        let lobbyID = u_log.getLobbyId(connections, client.id)
        game.changePlayerRegion(conquestInstances, lobbyID, data)
    })
    client.on("current_position", function (data) {
        io.sockets.to(data.oponent_id).emit("positionUpdate", data)
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
        connections = [[]]
        conquestInstances = []
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
app.listen(config.port, function () {
    console.log("[" + config.port + "] Dzieńdobry")
});