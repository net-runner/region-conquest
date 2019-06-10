class Game3D {

    constructor() {
        console.log("Game3D.js loaded")
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(45, $("#root").width() / $("#root").height(), 1, 10000)
        this.camera.position.set(450, 1500, 1350)
        this.camera.lookAt(new THREE.Vector3(450, 0, 450))
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setClearColor(0x222222, 1)
        this.renderer.setSize($("#root").width(), $("#root").height());
        this.axes = new THREE.AxesHelper(1000)
        // this.scene.add(this.axes)
        $("#root").append(this.renderer.domElement);
        this.raycaster = new THREE.Raycaster()
        this.mouseVector = new THREE.Vector2()
        this.clock = new THREE.Clock();

        this.loadingScreenGroup = new THREE.Group()
    }
    render() {
        game.camera.lookAt(new THREE.Vector3(450, 0, 450))
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
            game.camera.position.set(450, 1500, 1250)
            game.orbitControl = new THREE.OrbitControls(game.camera, game.renderer.domElement);
        }
        else if (gameData.playerOrder == 1) {
            game.camera.position.set(450, 1500, -350)
            game.orbitControl = new THREE.OrbitControls(game.camera, game.renderer.domElement);
        }
        game.camera.lookAt(new THREE.Vector3(450, 0, 450))
    }
    click(event) {
        this.mouseVector.x = (event.clientX / $(window).width()) * 2 - 1;
        this.mouseVector.y = -(event.clientY / $(window).height()) * 2 + 1;
        this.raycaster.setFromCamera(this.mouseVector, this.camera);
        let intersects = this.raycaster.intersectObject(game.scene, true);
        if (intersects[0].object.name[1] == "s") { //zeby nie wychwytywało gracza
            let coords = intersects[0].object.name
            coords = coords.split("s")
            console.log("BLUE: " + gameData.InstanceData.blueRegions + " || RED: " + gameData.InstanceData.redRegions)
            console.log(gameData.board[coords[0]][coords[1]])
        }
        if (intersects.length > 0) {
            console.log(intersects[0].object.name)
            // console.log(intersects[0].object.position)
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
        // addons.boardAddons()
        addons.boardSurroundings()
        addons.loadingScreenSetup()
        addons.loadFont()
    }
    loggedIn() {
        board.init()
        if (gameData.loginStatus == "reconnect") {
            game.scene.remove(game.loadingScreenGroup)
        }
        game.orbitControls()
        game.initRaycast()
    }
}