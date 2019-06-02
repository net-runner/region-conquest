class Addons3D {

    constructor() {
        console.log("Addons3D.js loaded")
    }
    loadingScreenSetup() {
        let loader = new THREE.TextureLoader();
        loader.load("imgs/smoke.png", function (texture) {
            console.log("loaded")
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
            // addons.animateLoadingScreen();
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
                console.log(localData.starParticles)
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
        var delta = game.delta;
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
        localData.portalParticles.forEach(p => {
            p.rotation.z -= delta * 1.5;
        });
        if (Math.random() > 0.9) {
            game.portalLight.power = 350 + Math.random() * 500;
        }
        game.renderer.render(game.scene, game.camera);
        requestAnimationFrame(addons.boardAddonsAnimate);
        // setTimeout(function () {
        //     requestAnimationFrame(game.boardAddonsAnimate);
        // }, 1000 / 20);
    }
}