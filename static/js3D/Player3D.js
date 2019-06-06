class Player extends THREE.Mesh {
    constructor() {
        super()
        this.geometry = new THREE.OctahedronGeometry(40, 0)
        this.material = new THREE.MeshStandardMaterial({
            color: 0xffdddd,
        });
    }
    spawnClone() {
        return this.clone()
    }
    spawnPlayer(oponent) { //test
        let container = new THREE.Object3D()
        let playerClone = player.spawnClone()
        container.add(playerClone)
        gameData.playerOrder == 0 ? container.rotation.y -= Math.PI / 2 : container.rotation.y += Math.PI / 2
        if (oponent) {
            gameData.playerOrder == 0 ? playerClone.material.color.setHex(0xdd9999) : playerClone.material.color.setHex(0x9999dd)
            console.log("oponent spawned")
            container.position.x = gameData.oponent.startPos.x
            container.position.y = gameData.oponent.startPos.y
            container.position.z = gameData.oponent.startPos.z
            gameData.oponent.container = container
            game.scene.add(gameData.oponent.container)
            gameData.oponent.lastPos = {
                x: Math.floor(gameData.oponent.container.clone().position.x / 100),
                z: Math.floor(gameData.oponent.container.clone().position.z / 100),
            }
        }
        else if (!oponent) {
            gameData.playerOrder == 0 ? playerClone.material.color.setHex(0x9999dd) : playerClone.material.color.setHex(0xdd9999)
            console.log("player spawned")
            container.position.x = gameData.startPos.x
            container.position.y = gameData.startPos.y
            container.position.z = gameData.startPos.z
            gameData.playerContainer = container
            game.scene.add(gameData.playerContainer)
            gameData.lastPos = {
                x: Math.floor(gameData.playerContainer.clone().position.x / 100),
                z: Math.floor(gameData.playerContainer.clone().position.z / 100),
            }
        }
    }
    set kolor(val) {
        this.material.color.setHex(val);
    }
    get kolor() {
        return this.material.color
    }
    set name2(val) {
        this._name = val
    }
    get name2() {
        return this._name
    }

    movement() {
        let playerX = 0;
        var currPos = {
            x: Math.floor(gameData.playerContainer.clone().position.x / 100),
            z: Math.floor(gameData.playerContainer.clone().position.z / 100),
        }
        //Region change system
        if (currPos.x != gameData.lastPos.x || currPos.z != gameData.lastPos.z) {
            gameData.lastPos.x = currPos.x
            gameData.lastPos.z = currPos.z
            console.log("Region changed to: " + currPos.x + " & " + currPos.z)
            net.sendData_regionChange(game.lastpos, currPos)
        }

        if (gameData.isGameGoing) {
            if (gameData.buttons.upButton == true) {
                let posAfterMove = gameData.playerContainer.clone().translateX(playerX - 2).position
                //blokada gracza przed wyjsciem za mapę
                if (posAfterMove.x < gameData.borderPos && posAfterMove.z < gameData.borderPos) {
                    if (posAfterMove.x > 0 && posAfterMove.z > 0) {
                        gameData.playerContainer.translateX(playerX - 2);
                        net.sendData_movment()
                    }
                }
            }
            if (gameData.buttons.downButton == true) {
                let posAfterMove = gameData.playerContainer.clone().translateX(playerX + 2).position
                //blokada gracza przed wyjsciem za mapę
                if (posAfterMove.x < gameData.borderPos && posAfterMove.z < gameData.borderPos) {
                    if (posAfterMove.x > 0 && posAfterMove.z > 0) {
                        gameData.playerContainer.translateX(playerX + 2);
                        net.sendData_movment()
                    }
                }
            }
            if (gameData.buttons.leftButton == true) {
                gameData.playerContainer.rotation.y += Math.PI * 2 * (4 / 360)
                net.sendData_rotation()
            }
            if (gameData.buttons.rightButton == true) {
                gameData.playerContainer.rotation.y -= Math.PI * 2 * (4 / 360)
                net.sendData_rotation()
            }
        }
    }
}