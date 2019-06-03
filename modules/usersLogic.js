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
