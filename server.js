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

// var servResponse = function (req, res) {
//     var allData = "";
//     req.on("data", function (data) {
//         allData += data
//     })
//     req.on("end", function (data) {
//         var finish = qs.parse(allData)
//         var response = {
//             status: undefined,
//         }
//         switch (finish.action) {
//             case "login":
//                 break;
//         }
//         res.writeHead(200, { "Content-Type": "text/html" });
//         res.end(JSON.stringify(response));
//     })
// }

var connections = [[]]
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
        loginInfo.currentLobby = connections.length - 1
        if (connections[connections.length - 1].length == 1) {
            loginInfo.order = 1
            clientData.order = 1
            loginInfo.oponent_nickname = connections[connections.length - 1].nick
            loginInfo.oponent_id = connections[connections.length - 1].id
            client.broadcast.emit("nickname", {
                oponent_nickname: data.nickname,
                oponent_id: client.id
            });
            let questionmark = connections.length - 1
            connections[questionmark].push(clientData)
            connections.push([])
            io.sockets.to(client.id).emit("loginResponse", { loginInfo })
        } else {
            loginInfo.order = 0
            clientData.order = 0
            //connections.push(clientData)
            connections[connections.length - 1].push(clientData)
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
    client.on("oponentXZ", function (data) {
        client.broadcast.emit("oponentXZ", {
            x: data.x,
            z: data.z,
        });
    })
    client.on("oponentRot", function (data) {
        client.broadcast.emit("oponentRot", {
            rot: data.rot
        });
    })
});
function getAndCloseAllSockets() {
    Object.keys(io.sockets.sockets).forEach(function (s) {
        io.sockets.sockets[s].disconnect(true);
    });
}
const port = 80
app.listen(port, function () {
    console.log("[" + port + "] Dzieńdobry")
});