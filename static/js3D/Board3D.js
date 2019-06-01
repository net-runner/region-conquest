class Board3D {

    constructor() {
        console.log("Board3D.js działa")
        // this.squareMaterial2 = new THREE.MeshPhongMaterial({
        //     shininess: 20,
        //     side: THREE.DoubleSide,
        //     // map: new THREE.TextureLoader().load('/imgs/2.png')
        // });
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
                let randomY = Math.random() * 30 + 20
                let squareGeo = new THREE.BoxGeometry(100, randomY, 100);
                let squareMaterial1 = new THREE.MeshPhongMaterial({
                    shininess: 1,
                    side: THREE.DoubleSide,
                    // map: new THREE.TextureLoader().load('/imgs/1.png')
                });
                let square = new THREE.Mesh(squareGeo, squareMaterial1)
                square.name = i + "s" + j
                square.position.z = 350 - 100 * i + 50
                square.position.x = 350 - 100 * j + 50
                square.position.y = 50 - (50 - randomY) / 2
                game.scene.add(square)
            }
        }
    }
    init() {
        board.boardCreate()
        game.scene.add(board.SpotLight)
        game.playerCamera("first")
    }
}