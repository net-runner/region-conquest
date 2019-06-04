class Game3D {

    constructor() {
        console.log("Game3D.js loaded")
        this.scene = new THREE.Scene();
        // this.scene.background = new THREE.TextureLoader().load("imgs/background.png");
        this.camera = new THREE.PerspectiveCamera(45, $("#root").width() / $("#root").height(), 1, 10000)
        this.camera.position.set(0, 0, 1500)
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
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
        // this.delta = this.clock.getDelta();
        this.portalLight = new THREE.PointLight(0x062d89, 30, 600, 1.7);
        this.portalLight.position.set(0, 0, 250);
        this.loadingScreenGroup.add(this.portalLight);
        this.scene.add(this.loadingScreenGroup);
    }
    render() {
        requestAnimationFrame(game.render);
        game.renderer.render(game.scene, game.camera);
        if (gameData.playerContainer) { player.movement() }
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
    playerCamera() {
        if (gameData.playerOrder == 0) {
            console.log("camera first")
            game.camera.position.set(0, 1500, 950)
            game.orbitControl = new THREE.OrbitControls(game.camera, game.renderer.domElement);
        }
        else if (gameData.playerOrder == 1) {
            game.camera.position.set(0, 1500, -950)
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
    init() {
        game.render()
        game.windowResize()
        addons.loadingScreenSetup()
    }
    loggedIn() {
        board.init()
        game.scene.remove(game.loadingScreenGroup)
        game.orbitControls()
        game.initRaycast()
        // game.scene.add(game.axes)
    }
}