module.exports = {

    CreateConquestInstance: function (lobby) {
        let instance = {
            isActive: true,
            lobby: lobby,
            playerLocations: [{ x: 0, y: 0 }, { x: 8, y: 8 }]
        }
        let regions = []
        function Region() {
            this.redPoints = 0
            this.bluePoints = 0
            this.isControlled = false
            this.owner = undefined
            this.capacity = 100
        }
        for (var i = 0; i < 9; i++) {
            regions.push([])
            for (var j = 0; j < 9; j++) {
                let region = new Region()
                if (i == 0 && j == 0) {
                    region.owner = 0
                    region.isControlled = true
                    region.redPoints = 200
                    region.capacity = 200

                } else if (i == 8 && j == 8) {
                    region.owner = 1
                    region.bluePoints = 200
                    region.isControlled = true
                    region.capacity = 200
                }
                regions[i][j] = region
            }
        }
        instance.regions = regions
        return instance
    },
    computeRegionChanges: function (conquestInstances) {
        for (var i = 0; i < conquestInstances.length; i++) {
            if (conquestInstances[i].isActive) {

            }
        }
    },
}
