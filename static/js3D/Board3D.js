class Board3D {

    constructor() {
        console.log("Board3D.js działa")

        this.squareGeo = new THREE.BoxGeometry(100, 100, 100);
        this.squareMaterial1 = new THREE.MeshPhongMaterial({
            shininess: 20,
            side: THREE.DoubleSide,
            // map: new THREE.TextureLoader().load('/imgs/1.png')
        });
        this.squareMaterial2 = new THREE.MeshPhongMaterial({
            shininess: 20,
            side: THREE.DoubleSide,
            // map: new THREE.TextureLoader().load('/imgs/2.png')
        });
        this.checkerGeo = new THREE.CylinderGeometry(40, 40, 20, 32);
        this.defaultBoard = [
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
        ];
        this.checkers = [
            [0, 2, 0, 2, 0, 2, 0, 2],
            [2, 0, 2, 0, 2, 0, 2, 0],
            [0, 2, 0, 4, 0, 2, 0, 2],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [1, 0, 3, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0],
        ];
    }
    boardCreate() {
        for (let i = 0; i < board.defaultBoard.length; i++) {
            for (let j = 0; j < board.defaultBoard[i].length; j++) {

            }
        }
    }
    checkersCreate() {
        for (let i = 0; i < board.checkers.length; i++) {
            for (let j = 0; j < board.checkers[i].length; j++) {

            }
        }
    }
}