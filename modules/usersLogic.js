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
                if (user.nick == nickname && !user.connected) {
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
        var partner_id, order
        lobbyList.forEach(lobby => {
            lobby.forEach(user => {
                if (user.id == id) {
                    order = Math.abs(user.order - 1);
                }
            })
        });
        lobbyList.forEach(lobby => {
            lobby.forEach(user => {
                if (user.order == order) {
                    partner_id = user.id;
                }
            })
        });
        return partner_id
    },
    changeConnectedStatus: function (lobbyList, id) {
        lobbyList.forEach(lobby => {
            lobby.forEach(user => {
                if (user.id == id) {
                    user.connected = !user.connected
                };
            })
        });
    }
}
