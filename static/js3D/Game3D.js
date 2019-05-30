class Game3D {

    constructor() {
        console.log("Game3D.js działa")
        this.scene = new THREE.Scene();
        // this.scene.background = new THREE.TextureLoader().load("imgs/background.png");
        this.camera = new THREE.PerspectiveCamera(45, $("#root").width() / $("#root").height(), 0.1, 10000)
        this.camera.position.set(800, 800, 800)
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setClearColor(0x222222, 1)
        this.renderer.setSize($("#root").width(), $("#root").height());
        this.orbitControl = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.axes = new THREE.AxesHelper(1000)
        this.scene.add(this.axes)
        $("#root").append(this.renderer.domElement);

        this.raycaster = new THREE.Raycaster()
        this.mouseVector = new THREE.Vector2()
    }

    render() {
        requestAnimationFrame(game.render);
        game.renderer.render(game.scene, game.camera);
    }

    orbitControls() {
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
    // playerCamera(player) {
    //     if (player == "first") {
    //         game.camera.position.set(0, 1500, 1000)
    //         game.orbitControl = new THREE.OrbitControls(game.camera, game.renderer.domElement);
    //     }
    //     else if (player == "second") {
    //         game.camera.position.set(0, 1500, -1000)
    //         game.orbitControl = new THREE.OrbitControls(game.camera, game.renderer.domElement);
    //     }
    // }
    // click(event) {
    //     this.mouseVector.x = (event.clientX / $(window).width()) * 2 - 1;
    //     this.mouseVector.y = -(event.clientY / $(window).height()) * 2 + 1;
    //     this.raycaster.setFromCamera(this.mouseVector, this.camera);
    //     let intersects = this.raycaster.intersectObjects(localData.intersectObjects); //true - mozliwosc "klikania" dzieci dzieci sceny
    //     if (intersects.length > 0) {
    //         console.log(intersects[0].object)

    //     }
    // }
    // initRaycast() {
    //     const that = this
    //     $(document).off("mousedown")
    //     $(document).on("mousedown", function () {
    //         that.click(event)
    //     })
    // }
    init() {
        game.render()
        game.orbitControls()
        game.windowResize()
    }
}
