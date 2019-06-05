class Board3D {

    constructor() {
        console.log("Board3D.js loaded")
        this.score = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
        ];
        this.SpotLight = new THREE.SpotLight(0xededed, 2, 1500, (Math.PI));
        this.SpotLight.position.x = 450
        this.SpotLight.position.y = 800
        this.SpotLight.position.z = 450
        game.scene.add(this.SpotLight)
    }
    boardCreate() {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                gameData.borderPos = i * 100 + 80
                if (i == 8 && j == 8 && gameData.playerOrder == 0) {
                    gameData.startPos.x = 50 + 100 * j
                    gameData.startPos.y = 100
                    gameData.startPos.z = 50 + 100 * i
                    gameData.oponent.startPos = {
                        x: 50,
                        y: 100,
                        z: 50,
                    }
                }
                if (i == 0 && j == 0 && gameData.playerOrder == 1) {
                    gameData.startPos.x = 50 + 100 * j
                    gameData.startPos.y = 100
                    gameData.startPos.z = 50 + 100 * i
                    gameData.oponent.startPos = {
                        x: 50 + 100 * 8,
                        y: 100,
                        z: 50 + 100 * 8,
                    }
                }
                let randomY = Math.random() * 20 + 210
                let squareGeo = new THREE.BoxGeometry(100, randomY, 100);
                let squareMaterial1 = new THREE.MeshPhongMaterial({
                    shininess: 1,
                    side: THREE.DoubleSide,
                });
                let square = new THREE.Mesh(squareGeo, squareMaterial1)
                square.name = j + "s" + i
                square.position.z = 50 + 100 * i
                square.position.x = 50 + 100 * j
                square.position.y = -170 - (50 - randomY) / 2
                let floorRandom = (Math.floor((randomY - 30) / 3)).toString(16);
                let kolor = "0x" + floorRandom + floorRandom + floorRandom
                square.material.color.setHex(kolor)
                game.scene.add(square)
            }
        }
    }
    init() {
        board.SpotLight.distance = 1700
        board.boardCreate()
        game.playerCamera(gameData.playerOrder)
        player.spawnPlayer(false)
    }
}