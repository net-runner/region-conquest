class Addons3D {

    constructor() {
        console.log("Addons3D.js loaded")
    }
    loadingScreenSetup() {
        game.scene.add(game.loadingScreenGroup);
        addons.particlesAnimate()
    }
    boardSurroundings() {
        let begin = -10
        let end = 19
        let squareGeo = new THREE.BoxGeometry(100, 300, 100);
        let squareMaterial1 = new THREE.MeshPhongMaterial({
            shininess: 1,
            side: THREE.DoubleSide,
        });
        let square1 = new THREE.Mesh(squareGeo, squareMaterial1)
        for (let i = begin; i < end; i++) {
            for (let j = begin - 7; j < end + 7; j++) {
                if ((i < 0 || i > 8) || (i > 0 || i < 8) && (j < 0 || j > 8)) {
                    let square = square1.clone()
                    let randomY = Math.random() * 220// + 220
                    square.position.z = 50 + 100 * i
                    square.position.x = 50 + 100 * j
                    square.position.y = -250 - (50 - randomY) / 2
                    let fade = Math.floor(Math.random() * 38) + 50
                    let kolor = "0x" + fade + fade + fade
                    square.material.color.setHex(kolor)
                    game.scene.add(square)
                    localData.movingBackground.push(square)
                }
                else {
                    let square = square1.clone()
                    let randomY = Math.random() * 220// + 220
                    square.position.z = 50 + 100 * i
                    square.position.x = 50 + 100 * j
                    square.position.y = -250 - (50 - randomY) / 2
                    let fade = Math.floor(Math.random() * 38) + 50
                    let kolor = "0x" + fade + fade + fade
                    square.material.color.setHex(kolor)
                    game.scene.add(square)
                    localData.movingBackground.push(square)
                    localData.startOut.push(square)
                    game.loadingScreenGroup.add(square)
                }
            }
        }
        localData.startOut.sort(() => Math.random() - 0.5);
        localData.movingBackground.sort(() => Math.random() - 0.5);
        for (let i = 0; i < localData.movingBackground.length; i++) {
            if (i < localData.movingBackground.length / 3)
                localData.movingBackground[i].position.y += 40;
        }

        let SpotLightRed = new THREE.SpotLight(0xdd4234, 2, 2000, (Math.PI));
        SpotLightRed.position.y = -200
        SpotLightRed.position.z = -200
        SpotLightRed.position.x = -600
        game.scene.add(SpotLightRed)
        let SpotLightRed2 = new THREE.SpotLight(0xdd4234, 2, 1000, (Math.PI));
        SpotLightRed2.position.y = -200
        SpotLightRed2.position.z = -600
        SpotLightRed2.position.x = 700
        game.scene.add(SpotLightRed2)
        let SpotLightBlue = new THREE.SpotLight(0x4234dd, 2, 2000, (Math.PI));
        SpotLightBlue.position.y = -200
        SpotLightBlue.position.z = 1200
        SpotLightBlue.position.x = 1400
        game.scene.add(SpotLightBlue)
        let SpotLightBlue2 = new THREE.SpotLight(0x4234dd, 2, 1000, (Math.PI));
        SpotLightBlue2.position.y = -200
        SpotLightBlue2.position.z = 1400
        SpotLightBlue2.position.x = 100
        game.scene.add(SpotLightBlue2)
    }
    loadFont() {
        let loader = new THREE.FontLoader();
        loader.load("fonts/ubuntu_regular.typeface.json", function (response) {
            localData.globalFont = response;
        });
    }
    createText(order, type, value) {
        if (type == "nick") {
            let text = value
            let textGeo = new THREE.TextGeometry(text, {
                font: localData.globalFont,
                size: 60,
                height: 10,
            });
            textGeo = new THREE.BufferGeometry().fromGeometry(textGeo);
            let material = new THREE.MeshLambertMaterial()
            let textMesh1 = new THREE.Mesh(textGeo, material);
            textMesh1.position.y = 370;
            if (gameData.playerOrder == 0) {
                textMesh1.position.z = 0;
                if (order == 0) {
                    textMesh1.position.x = 700;
                    textMesh1.material.color.setHex(0x9999ff)
                }
                else {
                    textMesh1.position.x = -200;
                    textMesh1.material.color.setHex(0xff9999)
                }
            }
            else {
                textMesh1.position.z = 900;
                textMesh1.rotation.y = Math.PI
                if (order == 0) {
                    textMesh1.position.x = 200;
                    textMesh1.material.color.setHex(0xff9999)
                }
                else {
                    textMesh1.position.x = 1100;
                    textMesh1.material.color.setHex(0x9999ff)
                }
            }
            game.scene.add(textMesh1)
        }
        if (type == "regions") {
            let text = "Regions:"
            let textGeo = new THREE.TextGeometry(text, {
                font: localData.globalFont,
                size: 60,
                height: 10,
            });
            textGeo = new THREE.BufferGeometry().fromGeometry(textGeo);
            let material = new THREE.MeshLambertMaterial()
            let textMesh1 = new THREE.Mesh(textGeo, material);
            textMesh1.position.y = 270;
            if (gameData.playerOrder == 0) {
                textMesh1.position.z = 0;
                if (order == 0) {
                    textMesh1.position.x = 700;
                    textMesh1.material.color.setHex(0x9999ff)
                }
                else {
                    textMesh1.position.x = -200;
                    textMesh1.material.color.setHex(0xff9999)
                }
            }
            else {
                textMesh1.position.z = 900;
                textMesh1.rotation.y = Math.PI
                if (order == 0) {
                    textMesh1.position.x = 1100;
                    textMesh1.material.color.setHex(0x9999ff)
                }
                else {
                    textMesh1.position.x = 200;
                    textMesh1.material.color.setHex(0xff9999)
                }

            }
            game.scene.add(textMesh1)
        }
        if (type == "score") {
            let text = value.toString()
            let textGeo = new THREE.TextGeometry(text, {
                font: localData.globalFont,
                size: 60,
                height: 10,
            });
            textGeo = new THREE.BufferGeometry().fromGeometry(textGeo);
            let material = new THREE.MeshLambertMaterial()
            let textMesh1 = new THREE.Mesh(textGeo, material);
            textMesh1.position.y = 270;
            if (gameData.playerOrder == 0) {
                textMesh1.position.z = 0;
                if (order == 0) {
                    textMesh1.position.x = 1040;
                    textMesh1.material.color.setHex(0x9999ff)
                }
                else {
                    textMesh1.position.x = 140;
                    textMesh1.material.color.setHex(0xff9999)
                }
            }
            else {
                textMesh1.position.z = 900;
                textMesh1.rotation.y = Math.PI
                if (order == 0) {
                    textMesh1.position.x = 750;
                    textMesh1.material.color.setHex(0x9999ff)
                }
                else {
                    textMesh1.position.x = -150;
                    textMesh1.material.color.setHex(0xff9999)
                }

            }
            localData.scores[order] = textMesh1;
            game.scene.add(localData.scores[order])
        }
    }
    refreshText(order, value) {
        game.scene.remove(localData.scores[order]);
        addons.createText(order, "score", value);
    }
    particlesAnimate() {
        if (localData.startIn[0] && localData.readyToStartIn && gameData.loginStatus != "reconnect") {//game starting - board spawn animation
            for (let i = 0; i < localData.startIn.length; i++) {
                for (let j = 0; j < localData.startIn[i].length; j++) {
                    if (localData.startIn[i][j].position.y > localData.startYpos[i][j]) {
                        localData.startIn[i][j].translateY(-20)
                    }
                    else {
                        localData.startIn[i][j].translateY(localData.startYpos[i][j] - localData.startIn[i][j].position.y)
                        if (localData.startInDone[i][j] == false) {
                            localData.startInCount++
                            if (localData.startInCount >= 81) {
                                localData.readyToStartIn = false
                                game.scene.remove(game.loadingScreenGroup)
                                player.spawnPlayer(true)
                                player.spawnPlayer(false)
                            }
                            localData.startInDone[i][j] = true
                        }
                    }
                }
            }
            for (let i = 0; i < localData.startOut.length; i++) {
                if (i <= localData.startOutCount) {
                    localData.startOut[i].translateY(-20)
                    if (localData.startOut[i].position.y < -180) {
                        if (localData.startOutDone[i] == false) {
                            localData.startOutCount++
                        }
                        localData.startOutDone[i] = true
                    }
                }
            }
        }
        if (localData.movingBackground) {//background animation
            localData.testAngles[0] += 0.01
            localData.testAngles[1] += 0.01
            localData.testAngles[2] += 0.01
            if (localData.testAngles[0] > Math.PI * 2) localData.testAngles[0] = 0
            if (localData.testAngles[1] > Math.PI * 2) localData.testAngles[1] = 0
            if (localData.testAngles[2] > Math.PI * 2) localData.testAngles[2] = 0
            for (let i = 0; i < localData.movingBackground.length; i++) {
                if (i < localData.movingBackground.length / 3)
                    localData.movingBackground[i].position.y -= 0.45 * Math.sin(localData.testAngles[0]);
                else if (i > localData.movingBackground.length / 3 && i < localData.movingBackground.length / 3 * 2)
                    localData.movingBackground[i].position.y += 0.35 * Math.sin(localData.testAngles[1]);
                else
                    localData.movingBackground[i].position.y += 0.4 * Math.sin(localData.testAngles[2]);
            }
        }
        if (gameData.oponent.lastPos.x != undefined || gameData.oponent.lastPos.z != undefined) {//animation of 5 blocks near player
            let xz = gameData.oponent.lastPos

            let b3D = localData.board3D

            let b3D_center = b3D[xz.z][xz.x]
            let b3D_right = b3D[xz.z][xz.x + 1]
            let b3D_left = b3D[xz.z][xz.x - 1]
            let b3D_top
            if (b3D[xz.z + 1]) b3D_top = b3D[xz.z + 1][xz.x]
            let b3D_down
            if (b3D[xz.z - 1]) b3D_down = b3D[xz.z - 1][xz.x]

            if (b3D_center != undefined)
                if (b3D_center.position.y < localData.startYpos[xz.z][xz.x] + 40)
                    b3D_center.position.y += 1
            if (b3D_right != undefined)
                if (b3D_right.position.y < localData.startYpos[xz.z][xz.x + 1] + 20)
                    b3D_right.position.y += 1
            if (b3D[xz.z + 1] != undefined)
                if (b3D_top != undefined)
                    if (b3D_top.position.y < localData.startYpos[xz.z + 1][xz.x] + 20)
                        b3D_top.position.y += 1
            if (b3D_left != undefined)
                if (b3D_left.position.y < localData.startYpos[xz.z][xz.x - 1] + 20)
                    b3D_left.position.y += 1
            if (b3D[xz.z - 1] != undefined)
                if (b3D_down != undefined)
                    if (b3D_down.position.y < localData.startYpos[xz.z - 1][xz.x] + 20)
                        b3D_down.position.y += 1
        }
        if (gameData.lastPos.x != undefined || gameData.lastPos.z != undefined) {
            let xz = gameData.lastPos

            let b3D = localData.board3D
            let b3D_center = b3D[xz.z][xz.x]
            let b3D_right = b3D[xz.z][xz.x + 1]
            let b3D_left = b3D[xz.z][xz.x - 1]
            let b3D_top
            if (b3D[xz.z + 1]) b3D_top = b3D[xz.z + 1][xz.x]
            let b3D_down
            if (b3D[xz.z - 1]) b3D_down = b3D[xz.z - 1][xz.x]

            let xzOp = gameData.oponent.lastPos
            if (b3D_center != undefined)
                if (b3D_center.position.y < localData.startYpos[xz.z][xz.x] + 40)
                    b3D_center.position.y += 1
            if (b3D_right != undefined)
                if (b3D_right.position.y < localData.startYpos[xz.z][xz.x + 1] + 20)
                    b3D_right.position.y += 1
            if (b3D[xz.z + 1] != undefined)
                if (b3D_top != undefined)
                    if (b3D_top.position.y < localData.startYpos[xz.z + 1][xz.x] + 20)
                        b3D_top.position.y += 1
            if (b3D_left != undefined)
                if (b3D_left.position.y < localData.startYpos[xz.z][xz.x - 1] + 20)
                    b3D_left.position.y += 1
            if (b3D[xz.z - 1] != undefined)
                if (b3D_down != undefined)
                    if (b3D_down.position.y < localData.startYpos[xz.z - 1][xz.x] + 20)
                        b3D_down.position.y += 1

            for (let i = 0; i < b3D.length; i++) {
                for (let j = 0; j < b3D[i].length; j++) {
                    if (i + "" + j != xz.z + "" + xz.x) {
                        if (i + "" + j != xzOp.z + "" + xzOp.x) {
                            if (b3D[i][j].position.y > localData.startYpos[i][j]) localData.board3D[i][j].position.y -= 0.5
                        }
                    }
                }
            }
        }
        if (gameData.board) {//board coloring animation
            for (let i = 0; i < gameData.board.length; i++) {
                for (let j = 0; j < gameData.board.length; j++) {
                    let kolorDefault = localData.startColors[i][j].split(",")
                    if (gameData.board[i][j].redPoints < gameData.board[i][j].bluePoints) { //blue owner
                        let owner1 = Math.floor(gameData.board[i][j].bluePoints)
                        let kolor = parseInt(kolorDefault[2].split(")")[0]) + parseInt(owner1)
                        let typeColor
                        gameData.board[i][j].type == "conquered" ? typeColor = parseInt(kolorDefault[1]) + 10 : typeColor = kolorDefault[1]
                        gameData.board[i][j].type == "conqueror" ? typeColor = parseInt(kolorDefault[1]) - 20 : typeColor = kolorDefault[1]
                        localData.board3D[i][j].material.color.setStyle(kolorDefault[0] + "," + typeColor + "," + kolor + ")")
                    }
                    if (gameData.board[i][j].redPoints > gameData.board[i][j].bluePoints) { //red owner
                        let owner1 = Math.floor(gameData.board[i][j].redPoints)
                        let kolor = parseInt(kolorDefault[0].split("(")[1]) + parseInt(owner1)
                        let typeColor
                        gameData.board[i][j].type == "conquered" ? typeColor = parseInt(kolorDefault[1]) + 10 : typeColor = kolorDefault[1]
                        gameData.board[i][j].type == "conqueror" ? typeColor = parseInt(kolorDefault[1]) - 20 : typeColor = kolorDefault[1]
                        localData.board3D[i][j].material.color.setStyle("rgb(" + kolor + "," + typeColor + "," + kolorDefault[2])
                    }
                }
            }
        }
        if (gameData.playerContainer) { player.movement() }
        requestAnimationFrame(addons.particlesAnimate);
    }
}