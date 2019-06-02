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
        this.SpotLight = new THREE.SpotLight(0xdddddd, 2, 1000, (Math.PI));
        this.SpotLight.position.y = 500
    }
    boardCreate() {
        for (let i = 0; i < board.score.length; i++) {
            for (let j = 0; j < board.score[i].length; j++) {
                let randomY = Math.random() * 20 + 20
                let squareGeo = new THREE.BoxGeometry(100, randomY, 100);
                let squareMaterial1 = new THREE.MeshPhongMaterial({
                    shininess: 1,
                    side: THREE.DoubleSide,
                    // map: new THREE.TextureLoader().load('/imgs/1.png')
                });
                let square = new THREE.Mesh(squareGeo, squareMaterial1)
                square.name = j + "s" + i
                square.position.z = -400 + 100 * i
                square.position.x = -400 + 100 * j
                square.position.y = 50 - (50 - randomY) / 2
                // let floorRandom = Math.floor(randomY / 2) + 40
                // let kolor = "0x" + floorRandom + floorRandom + floorRandom
                let fade = 4 * i + 4 * j
                fade < 10 ? fade = "0" + fade : fade = fade
                let kolor = "0x" + fade + fade + fade
                // console.log(kolor)
                square.material.color.setHex(kolor)
                game.scene.add(square)
            }
        }
    }
    init() {
        board.boardCreate()
        game.scene.add(board.SpotLight)
        game.playerCamera(localData.playerOrder)
    }
}