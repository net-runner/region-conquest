class Player extends THREE.Mesh {
    constructor(name) {
        super()
        this.geometry = new THREE.OctahedronGeometry(40, 1)
        this.material = new THREE.MeshStandardMaterial({

        });
        this._name = name
    }
    set kolor(val) {
        this.material.color.setHex(val);
    }
    get kolor() {
        return this.material.color
    }
    set name2(val) {
        this._name = val
    }
    get name2() {
        return this._name
    }
}