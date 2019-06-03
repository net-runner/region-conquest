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
        localData.playerOrder == "first" ? container.rotation.y -= Math.PI / 2 : container.rotation.y += Math.PI / 2
        if (oponent) {
            localData.playerOrder == "first" ? playerClone.material.color.setHex(0xdd9999) : playerClone.material.color.setHex(0x9999dd)
            console.log("oponent spawned")
            container.position.x = gameData.oponent.startPos.x
            container.position.y = gameData.oponent.startPos.y
            container.position.z = gameData.oponent.startPos.z
            gameData.oponent.container = container
            game.scene.add(gameData.oponent.container)
        }
        else if (!oponent) {
            localData.playerOrder == "first" ? playerClone.material.color.setHex(0x9999dd) : playerClone.material.color.setHex(0xdd9999)
            console.log("player spawned")
            container.position.x = gameData.startPos.x
            container.position.y = gameData.startPos.y
            container.position.z = gameData.startPos.z
            gameData.playerContainer = container
            game.scene.add(gameData.playerContainer)
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
        if (gameData.buttons.upButton == true) {
            let posAfterMove = gameData.playerContainer.clone().translateX(playerX - 2).position
            //blokada gracza przed wyjsciem za mapę
            if (Math.abs(posAfterMove.x) < gameData.borderPos && Math.abs(posAfterMove.z) < gameData.borderPos) {
                gameData.playerContainer.translateX(playerX - 2);
                client.emit("oponentXZ", {
                    x: gameData.playerContainer.position.x,
                    z: gameData.playerContainer.position.z,
                })
            }
        }
        if (gameData.buttons.downButton == true) {
            let posAfterMove = gameData.playerContainer.clone().translateX(playerX + 2).position
            //blokada gracza przed wyjsciem za mapę
            if (Math.abs(posAfterMove.x) < gameData.borderPos && Math.abs(posAfterMove.z) < gameData.borderPos) {
                gameData.playerContainer.translateX(playerX + 2);
                client.emit("oponentXZ", {
                    x: gameData.playerContainer.position.x,
                    z: gameData.playerContainer.position.z,
                })
            }
        }
        if (gameData.buttons.leftButton == true) {
            gameData.playerContainer.rotation.y += Math.PI * 2 * (4 / 360)
            client.emit("oponentRot", {
                rot: gameData.playerContainer.rotation.y,
            })
        }
        if (gameData.buttons.rightButton == true) {
            gameData.playerContainer.rotation.y -= Math.PI * 2 * (4 / 360)
            client.emit("oponentRot", {
                rot: gameData.playerContainer.rotation.y,
            })
        }
    }
}