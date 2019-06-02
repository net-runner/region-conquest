class Player extends THREE.Mesh {
    constructor(name) {
        super()
        this.geometry = new THREE.OctahedronGeometry(40, 0)
        this.material = new THREE.MeshNormalMaterial({
            color: 0xffdddd,
        });
        // this._name = name
    }
    spawnPlayer() {
        return this.clone()
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