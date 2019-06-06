module.exports = {

    //Module that performs mostly logic operations on lobbies array

    //Predicted array structure 
    // array : [
    //     lobby:[
    //         user1:{},user2{};
    //     ],
    //    ...
    //  ]
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
        if (lobbyList[lobbyID][1].connected == false) isConnected = false;
        return isConnected
    }
}
