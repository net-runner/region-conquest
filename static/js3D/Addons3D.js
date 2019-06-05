class Addons3D {

    constructor() {
        console.log("Addons3D.js loaded")
    }
    loadingScreenSetup() {
        game.scene.add(game.loadingScreenGroup);
        addons.particlesAnimate()
    }
    boardAddons() {
        var starsMaterial = new THREE.PointsMaterial({ color: 0x888888 });
        var starsGeometry = new THREE.Geometry();;
        for (let i = 0; i < 12000; i++) {
            if (i % 2000 == 0) {
                starsGeometry = new THREE.Geometry();
                let starField = new THREE.Points(starsGeometry, starsMaterial);
                localData.starParticles.push(starField)
                // console.log(localData.starParticles)
                starField.position.y = -localData.starParticles.length * 300 + 1000
                starField.name = i.toString()[0]
                game.scene.add(starField);
            }
            let star = new THREE.Vector3();
            star.x = THREE.Math.randFloatSpread(2000);
            star.y = THREE.Math.randFloatSpread(2000);
            star.z = THREE.Math.randFloatSpread(2000);
            starsGeometry.vertices.push(star);
        }
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
        // game.renderer.render(game.scene, game.camera);
        requestAnimationFrame(addons.particlesAnimate);
        // setTimeout(function () {
        //     requestAnimationFrame(game.boardAddonsAnimate);
        // }, 1000 / 20);
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
                    square.position.z = -400 + 100 * i
                    square.position.x = -400 + 100 * j
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
                    square.position.z = -400 + 100 * i
                    square.position.x = -400 + 100 * j
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
        SpotLightRed.position.z = -600
        SpotLightRed.position.x = -1000
        game.scene.add(SpotLightRed)
        let SpotLightRed2 = new THREE.SpotLight(0xdd4234, 2, 1000, (Math.PI));
        SpotLightRed2.position.y = -200
        SpotLightRed2.position.z = -1000
        SpotLightRed2.position.x = 300
        game.scene.add(SpotLightRed2)
        let SpotLightBlue = new THREE.SpotLight(0x4234dd, 2, 2000, (Math.PI));
        SpotLightBlue.position.y = -200
        SpotLightBlue.position.z = 800
        SpotLightBlue.position.x = 1000
        game.scene.add(SpotLightBlue)
        let SpotLightBlue2 = new THREE.SpotLight(0x4234dd, 2, 1000, (Math.PI));
        SpotLightBlue2.position.y = -200
        SpotLightBlue2.position.z = 1000
        SpotLightBlue2.position.x = -300
        game.scene.add(SpotLightBlue2)
    }
}