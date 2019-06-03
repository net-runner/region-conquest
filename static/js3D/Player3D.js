class Player extends THREE.Mesh {
    constructor() {
        super()
        this.geometry = new THREE.OctahedronGeometry(40, 0)
        this.material = new THREE.MeshStandardMaterial({
            color: 0xffdddd,
        });
        // this._name = name
    }
    spawnClone() {
        return this.clone()
    }
    spawnPlayer() { //test
        let container = new THREE.Object3D()
        let playerClone = player.spawnClone()
        container.add(playerClone)
        container.position.x = gameData.startPos.x
        container.position.y = gameData.startPos.y
        container.position.z = gameData.startPos.z
        localData.playerOrder == "first" ? container.rotation.y -= Math.PI / 2 : container.rotation.y += Math.PI / 2
        localData.testPlayer = container
        console.log("player spawned")
        game.scene.add(localData.testPlayer)
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
        var playerX = 0;
        if (gameData.buttons.upButton == true) {
            localData.testPlayer.translateX(playerX - 1);
        }
        if (gameData.buttons.downButton == true) {
            localData.testPlayer.translateX(playerX + 1);
        }
        if (gameData.buttons.leftButton == true) {
            localData.testPlayer.rotation.y += Math.PI * 2 * (2 / 360)
        }
        if (gameData.buttons.rightButton == true) {
            localData.testPlayer.rotation.y -= Math.PI * 2 * (2 / 360)
        }
    }
}