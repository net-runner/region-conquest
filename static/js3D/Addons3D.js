class Addons3D {

    constructor() {
        console.log("Addons3D.js loaded")
    }
    loadingScreenSetup() {
        game.scene.add(game.loadingScreenGroup);
        addons.particlesAnimate()
    }
    boardAddons() {
        // var starsMaterial = new THREE.PointsMaterial({ color: 0x888888 });
        // var starsGeometry = new THREE.Geometry();;
        // for (let i = 0; i < 12000; i++) {
        //     if (i % 2000 == 0) {
        //         starsGeometry = new THREE.Geometry();
        //         let starField = new THREE.Points(starsGeometry, starsMaterial);
        //         localData.starParticles.push(starField)
        //         // console.log(localData.starParticles)
        //         starField.position.y = -localData.starParticles.length * 300 + 1000
        //         starField.position.x = 450
        //         starField.position.z = 450
        //         starField.name = i.toString()[0]
        //         game.scene.add(starField);
        //     }
        //     let star = new THREE.Vector3();
        //     star.x = THREE.Math.randFloatSpread(2000);
        //     star.y = THREE.Math.randFloatSpread(2000);
        //     star.z = THREE.Math.randFloatSpread(2000);
        //     starsGeometry.vertices.push(star);
        // }
    }
    particlesAnimate() {
        var delta = game.clock.getDelta();
        // console.log(delta)
        if (localData.starParticles) {
            localData.starParticles.forEach(p => {
                p.position.y -= delta * 180;
                if (p.position.y < -800) {
                    p.position.y = 1000
                }
                if (parseInt(p.name) % 4 == 0) {
                    p.rotation.y -= delta * 0.05;
                    p.rotation.x -= delta * 0.05;
                }
                else {
                    p.rotation.y += delta * 0.05;
                    p.rotation.z += delta * 0.05;
                }
            });
        }
        if (localData.portalParticles) {
            localData.portalParticles.forEach(p => {
                p.rotation.z -= delta * 1.5;
            });
            if (Math.random() > 0.9) {
                game.portalLight.power = 350 + Math.random() * 500;
            }
        }
        if (localData.movingBackground) {
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
        if (gameData.oponent.lastPos.x != undefined || gameData.oponent.lastPos.z != undefined) {
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
        if (gameData.board) {
            for (let i = 0; i < gameData.board.length; i++) {
                for (let j = 0; j < gameData.board.length; j++) {
                    let kolorDefault = localData.startColors[i][j].split(",")
                    if (gameData.board[i][j].redPoints < gameData.board[i][j].bluePoints) {
                        var owner1 = Math.floor(gameData.board[i][j].bluePoints)
                        var kolor = parseInt(kolorDefault[2].split(")")[0]) + parseInt(owner1)
                        localData.board3D[i][j].material.color.setStyle(kolorDefault[0] + "," + kolorDefault[1] + "," + kolor + ")")
                    }
                    if (gameData.board[i][j].redPoints > gameData.board[i][j].bluePoints) {
                        var owner1 = Math.floor(gameData.board[i][j].redPoints)
                        var kolor = parseInt(kolorDefault[0].split("(")[1]) + parseInt(owner1)
                        localData.board3D[i][j].material.color.setStyle("rgb(" + kolor + "," + kolorDefault[1] + "," + kolorDefault[2])
                    }
                }
            }
        }
        requestAnimationFrame(addons.particlesAnimate);
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
                    game.loadingScreenGroup.add(square);
                }
            }
        }
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
}