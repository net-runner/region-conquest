/**
 * @author Saurian / https://gitlab.com/net-runner
 * @author tomec / https://gitlab.com/tomec
 */

const qs = require("querystring");
const fs = require("fs");
const appS = require("https").createServer(credentials, handler)
const app = require("http").createServer(handler);
const io = require("socket.io")(app);
const u_log = require("./modules/usersLogic.js");
const game = require("./modules/gameLogic.js");
const dbops = require("./modules/dbops.js");
const config = require("./config/server_config.json")
const bcrypt = require("bcrypt")

//SSL
const pfx = fs.readFileSync('./cert/crt.pfx')
var credentials = {
    pfx: pfx,
    passphrase: "region-conquest"
}



//MongoDB
const MongoClient = require('mongodb').MongoClient;
const obID = require("mongodb").ObjectID
const assert = require('assert');
const url = 'mongodb+srv://admin-region-conquest:zdhwGkY84EO4uBYp@kgb.k7bed.mongodb.net/region-conquest?retryWrites=true&w=majority';
const mClient = new MongoClient(url, { useNewUrlParser: true });
var db, usercol
var dbConn = false
mClient.connect(function (err) {
    if (err != null) {
        console.log("For the best user experience please install and use " +
            "MongoDB on your local machine")
    } else {
        dbConn = true
        console.log("Connected successfully to Mongo Server");
        db = mClient.db(config.database);
        usercol = db.collection("users")
    }

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
            if (conquestInstances[i].winner) {
                conquestInstances[i].isActive = false
            }
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

    client.on("disconnect", function () {
        console.log("Disconnected: " + client.id)

        if (u_log.isInAnyLobby(connections, client.id)) {
            let id = u_log.getLobbyId(connections, client.id)
            if (conquestInstances[id]) {
                conquestInstances[id].isActive = false;
            }
            u_log.changeConnectedStatus(connections, client.id)
            if (u_log.ifLastConnected(connections, id)) {
                connections[id] = []
            } else {
                let opid = u_log.getOponentId(connections, client.id)
                io.sockets.to(opid.id).emit("opdisconn")
            }

        }
        io.sockets.to(client.id).emit("disconnect")

    });
    var loginInfo = {}

    var clientData = {
        id: client.id,
        nick: undefined,
    }

    client.on("login", function (data) {
        console.log("Login...")
        u_log.login(connections, client, conquestInstances, clientData, loginInfo, io, u_log, game, config, data, true)
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
    client.on("performLogin", function (info) {
        loginInfo.status = "no-db-connection"
        if (dbConn) {
            dbops.ifUserExists(usercol, info, connections, client, conquestInstances, clientData, loginInfo, io, u_log, game, config, function (data, info, connections, client, conquestInstances, clientData, loginInfo, io, u_log, game, config) {
                if (data != null) {
                    bcrypt.compare(info.password, data.hash, function (err, res) {
                        if (res) {
                            danu = {
                                nickname: info.nickname,
                                wins: data.wins,
                                loses: data.loses,
                                totalRegionsConquered: data.totalRegionsConquered,
                                totalTimeSpent: data.totalTimeSpent,
                            }
                            u_log.login(connections, client, conquestInstances, clientData, loginInfo, io, u_log, game, config, data, false)
                        } else {
                            loginInfo.status = "wrong-password"
                            io.sockets.to(client.id).emit("loginResponse", { loginInfo })
                        }
                    });
                } else {
                    bcrypt.hash(info.password, 10, function (err, hash) {
                        user = {
                            nickname: info.nickname,
                            hash: hash,
                            wins: 0,
                            loses: 0,
                            totalRegionsConquered: 0,
                            totalTimeSpent: 0,
                        }
                        data = {
                            nickname: info.nickname,
                            wins: user.wins,
                            loses: user.loses,
                            totalRegionsConquered: user.totalRegionsConquered,
                            totalTimeSpent: user.totalTimeSpent,
                        }
                        dbops.Insert(usercol, user)
                        u_log.login(connections, client, conquestInstances, clientData, loginInfo, io, u_log, game, config, data, false)
                    });

                }
            })
        } else { io.sockets.to(client.id).emit("loginResponse", { loginInfo }) }
    })
    client.on("updateStatistics", function (stats) {
        dbops.updateStats(usercol, stats)
    })
});
function getAndCloseAllSockets() {
    Object.keys(io.sockets.sockets).forEach(function (s) {
        io.sockets.sockets[s].disconnect(true);
    });
}
app.listen(config.port, function () {
    console.log("HTTP:[" + config.port + "] Dzieńdobry")
});
// appS.listen(config.https_port, "localhost", function () {
//     console.log("HTTPS: [" + config.https_port + "] Dzieńdobry")
// });