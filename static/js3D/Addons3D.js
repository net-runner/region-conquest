class Addons3D {

    constructor() {
        console.log("Addons3D.js loaded")
    }
    loadingScreenSetup() {
        let loader = new THREE.TextureLoader();
        loader.load("imgs/smoke.png", function (texture) {
            let portalGeo = new THREE.PlaneBufferGeometry(350, 350);
            let portalMaterial = new THREE.MeshStandardMaterial({
                map: texture,
                transparent: true
            });
            let smokeGeo = new THREE.PlaneBufferGeometry(1000, 1000);
            let smokeMaterial = new THREE.MeshStandardMaterial({
                map: texture,
                transparent: true
            });
            let particle = new THREE.Mesh(portalGeo, portalMaterial);
            for (let p = 880; p > 250; p--) {
                let particleClone = particle.clone()
                particleClone.position.set(
                    0.5 * p * Math.cos((4 * p * Math.PI) / 180),
                    0.5 * p * Math.sin((4 * p * Math.PI) / 180),
                    0.1 * p
                );
                particleClone.rotation.z = Math.random() * 360;
                localData.portalParticles.push(particleClone);
                game.loadingScreenGroup.add(particleClone);
            }
            let particle2 = new THREE.Mesh(smokeGeo, smokeMaterial);
            for (let p = 0; p < 40; p++) {
                let particleClone2 = particle2.clone()
                particleClone2.position.set(
                    Math.random() * 1000 - 500,
                    Math.random() * 400 - 200,
                    25
                );
                particleClone2.rotation.z = Math.random() * 360;
                particleClone2.material.opacity = 0.6;
                localData.portalParticles.push(particleClone2);
                game.loadingScreenGroup.add(particleClone2);
            }
            addons.particlesAnimate()

        });
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
                    // if (i < 0) { square.position.y = -250 - (begin - i) * 50 }
                    // if (i > 8) { square.position.y = 1150 - (end + i) * 50 }
                    // if (j < 0 && i < 0) { square.position.y = square.clone().position.y + (-250 - (begin - j) * 50) / 2 }
                    // if (j > 8 && i < 0) { square.position.y = square.clone().position.y + (1150 - (end + j) * 50) / 2 }
                    // let floorRandom = Math.floor(randomY / 2) + 40
                    // let kolor = "0x" + floorRandom + floorRandom + floorRandom
                    let fade = Math.floor(Math.random() * 38) + 50
                    let kolor = "0x" + fade + fade + fade
                    square.material.color.setHex(kolor)
                    game.scene.add(square)
                }
            }
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