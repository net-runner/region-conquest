module.exports = {

    //Module that performs mostly logic operations on lobbies array

    //Predicted array structure 
    // array : [
    //     lobby:[
    //         user1:{},user2{};
    //     ],
    //    ...
    //  ]
    login: function (lobbyList, client, instancesList, clientData, loginInfo, io, u_log, game, config, data, isGuest) {
        let nickname
        if (isGuest) {
            nickname = "[G] " + data.nickname
        }
        else {
            nickname = data.nickname
            lobinInfo.wins = data.wins
            loginInfo.loses = data.loses
            loginInfo.totalRegionsConquered = data.totalRegionsConquered
            loginInfo.totalTimeSpent = data.totalTimeSpent
        }

        loginInfo.status = "successful"
        loginInfo.id = client.id
        if (u_log.isReconnectAvailable(lobbyList, nickname)) {
            u_log.update(lobbyList, nickname, client.id)
            let opid = u_log.getOponentId(lobbyList, client.id)
            let lobbyID = u_log.getLobbyId(lobbyList, client.id)
            loginInfo.order = opid.order
            loginInfo.nickname = nickname
            loginInfo.oponent_id = opid.id
            loginInfo.oponent_nickname = opid.nick
            loginInfo.currentLobby = lobbyID
            loginInfo.status = "reconnect"
            io.sockets.to(client.id).emit("loginResponse", { loginInfo })
            io.sockets.to(opid.id).emit("updateID", { id: client.id })

            if (u_log.isEveryoneConnected(lobbyList, lobbyID)) {
                instancesList[lobbyID].isActive = true
                io.sockets.to(client.id).emit("enableKeyboard")
                io.sockets.to(opid.id).emit("enableKeyboard")
            }

        } else {
            if (u_log.isNicknameAvailable(lobbyList, nickname)) {
                let lobby = lobbyList.length - 1

                clientData.connected = true
                clientData.nick = nickname
                clientData.id = client.id
                loginInfo.currentLobby = lobby

                if (lobbyList[lobby].length == 1) {

                    loginInfo.order = 1
                    loginInfo.nickname = clientData.nick
                    loginInfo.oponent_nickname = lobbyList[lobby][0].nick
                    loginInfo.oponent_id = lobbyList[lobby][0].id
                    clientData.order = 1

                    lobbyList[lobby].push(clientData)
                    lobbyList.push([])

                    io.sockets.to(lobbyList[lobby][0].id).emit("nickname", {
                        oponent_nickname: nickname,
                        oponent_id: client.id
                    });

                    io.sockets.to(client.id).emit("loginResponse", { loginInfo })
                    instancesList.push(game.CreateConquestInstance(lobby, config.game))
                } else {
                    loginInfo.nickname = nickname
                    loginInfo.order = 0
                    clientData.order = 0

                    lobbyList[lobby].push(clientData)

                    io.sockets.to(client.id).emit("loginResponse", { loginInfo })
                }
            } else {
                io.sockets.to(client.id).emit("loginResponse")
            }
        } console.log(lobbyList)
    },
    isNicknameAvailable: function (lobbyList, nickname) {
        let found = true
        lobbyList.forEach(lobby => {
            lobby.forEach(user => {
                if (user.nick == nickname) {
                    found = false
                };
            })
        });
        return found
    },
    update: function (lobbyList, nickname, id) {
        lobbyList.forEach(lobby => {
            lobby.forEach(user => {
                if (user.nick == nickname) {
                    user.connected = !user.connected
                    user.id = id
                };
            })
        });
    },
    isReconnectAvailable: function (lobbyList, nickname) {
        let found = false
        lobbyList.forEach(lobby => {
            lobby.forEach(user => {
                if (user.nick == nickname && user.connected == false) {
                    found = true
                };
            })
        });
        return found
    },
    isInAnyLobby: function (lobbyList, id) {
        let found = false
        lobbyList.forEach(lobby => {
            lobby.forEach(user => {
                if (user.id == id) {
                    found = true
                };
            })
        });
        return found
    },
    getOponentId: function (lobbyList, id) {
        var partner_id, order, orderone, nick
        lobbyList.forEach(lobby => {
            lobby.forEach(user => {
                if (user.id == id) {
                    orderone = user.order
                    order = Math.abs(user.order - 1);
                }
            })
        });
        lobbyList.forEach(lobby => {
            lobby.forEach(user => {
                if (user.order == order) {
                    partner_id = user.id;
                    nick = user.nick
                }
            })
        });
        return { id: partner_id, order: orderone, nick: nick }
    },
    changeConnectedStatus: function (lobbyList, id) {
        lobbyList.forEach(lobby => {
            lobby.forEach(user => {
                if (user.id == id) {
                    user.connected = !user.connected
                    console.log(user.connected)
                };
            })
        });
    },
    getLobbyId: function (lobbyList, id) {
        let lobbyID
        lobbyList.forEach(lobby => {
            lobby.forEach(user => {
                if (user.id == id) {
                    lobbyID = lobbyList.indexOf(lobby)

                };
            })
        });
        return lobbyID
    },
    isEveryoneConnected: function (lobbyList, lobbyID) {
        let isConnected = true

        if (lobbyList[lobbyID][0].connected == false) isConnected = false;
        if (lobbyList[lobbyID][1]) {
            if (lobbyList[lobbyID][1].connected == false) isConnected = false;
        } else {
            return false
        }

        return isConnected
    },
    ifLastConnected: function (lobbyList, lobbyID) {
        let bool = true
        if (lobbyList[lobbyID][0].connected) bool = false
        if (lobbyList[lobbyID][1])
            if (lobbyList[lobbyID][1].connected) bool = false
        return bool
    }
}
