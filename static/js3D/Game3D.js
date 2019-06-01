class Game3D {

    constructor() {
        console.log("Game3D.js działa")
        this.scene = new THREE.Scene();
        // this.scene.background = new THREE.TextureLoader().load("imgs/background.png");
        this.camera = new THREE.PerspectiveCamera(45, $("#root").width() / $("#root").height(), 1, 10000)
        this.camera.position.set(0, 0, 1500)
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setClearColor(0x222222, 1)
        this.renderer.setSize($("#root").width(), $("#root").height());
        this.axes = new THREE.AxesHelper(1000)
        // this.scene.add(this.axes)
        $("#root").append(this.renderer.domElement);

        this.raycaster = new THREE.Raycaster()
        this.mouseVector = new THREE.Vector2()

        this.loadingScreenGroup = new THREE.Group()
        this.sceneLight = new THREE.DirectionalLight(0xffffff, 0.5);
        this.sceneLight.position.set(0, 0, 1);
        this.loadingScreenGroup.add(this.sceneLight);
        this.clock = new THREE.Clock();
        this.portalLight = new THREE.PointLight(0x062d89, 30, 600, 1.7);
        this.portalLight.position.set(0, 0, 250);
        this.loadingScreenGroup.add(this.portalLight);
        this.scene.add(this.loadingScreenGroup);
    }

    render() {
        requestAnimationFrame(game.render);
        game.renderer.render(game.scene, game.camera);
    }

    orbitControls() {
        game.orbitControl = new THREE.OrbitControls(game.camera, game.renderer.domElement);
        game.orbitControl.addEventListener('change', function () {
            game.renderer.render(game.scene, game.camera)
        });
    }
    windowResize() {
        window.addEventListener('resize', function () {
            game.camera.aspect = $("#root").innerWidth() / $("#root").innerHeight();
            game.camera.updateProjectionMatrix();
            game.renderer.setSize($("#root").innerWidth(), $("#root").innerHeight());
        })
    }
    playerCamera(player) {
        if (player == "first") {
            console.log("camera first")
            game.camera.position.set(0, 1500, 1000)
            game.orbitControl = new THREE.OrbitControls(game.camera, game.renderer.domElement);
        }
        else if (player == "second") {
            game.camera.position.set(0, 1500, -1000)
            game.orbitControl = new THREE.OrbitControls(game.camera, game.renderer.domElement);
        }
    }
    click(event) {
        this.mouseVector.x = (event.clientX / $(window).width()) * 2 - 1;
        this.mouseVector.y = -(event.clientY / $(window).height()) * 2 + 1;
        this.raycaster.setFromCamera(this.mouseVector, this.camera);
        let intersects = this.raycaster.intersectObject(game.scene, true); //true - mozliwosc "klikania" dzieci dzieci sceny
        if (intersects.length > 0) {
            console.log(intersects[0].object)

        }
    }
    initRaycast() {
        const that = this
        $(document).off("mousedown")
        $(document).on("mousedown", function () {
            that.click(event)
        })
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
            game.animateLoadingScreen();

        });
    }
    animateLoadingScreen() {
        let delta = game.clock.getDelta();
        localData.portalParticles.forEach(p => {
            p.rotation.z -= delta * 1.5;
        });
        if (Math.random() > 0.9) {
            game.portalLight.power = 350 + Math.random() * 500;
        }
        game.renderer.render(game.scene, game.camera);
        requestAnimationFrame(game.animateLoadingScreen);
        // setTimeout(function () {
        //     requestAnimationFrame(game.animateLoadingScreen);
        // }, 1000 / 20);
    }
    init() {
        game.render()
        game.windowResize()
        game.loadingScreenSetup()
    }
    loggedIn() {
        board.init()
        game.scene.remove(game.loadingScreenGroup)
        game.orbitControls()
        game.initRaycast()
    }
}