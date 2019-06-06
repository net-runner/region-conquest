module.exports = {

    CreateConquestInstance: function (lobby) {
        let instance = {
            isActive: true,
            lobby: lobby,
            playerLocations: [{ x: 8, z: 8 }, { x: 0, z: 0 }]
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
                    region.owner = 1
                    region.isControlled = true
                    region.redPoints = 200
                    region.capacity = 200

                } else if (i == 8 && j == 8) {
                    region.owner = 0
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
    changePlayerRegion: function (conquestInstances, lobbyID, data) {
        for (var i = 0; i < conquestInstances.length; i++) {
            if (conquestInstances[i].lobby == lobbyID) {
                conquestInstances[i].playerLocations[data.player].x = data.currPos.x
                conquestInstances[i].playerLocations[data.player].z = data.currPos.z
                break
            }
        }
    },
    computeRegionPoints: function (conquestInstances, config) {
        for (var i = 0; i < conquestInstances.length; i++) {
            if (conquestInstances[i].isActive) {
                console.log(conquestInstances[i].playerLocations)
                //Current player location point generation
                let xone = conquestInstances[i].playerLocations[0].x
                let zone = conquestInstances[i].playerLocations[0].z
                let xtwo = conquestInstances[i].playerLocations[1].x
                let ztwo = conquestInstances[i].playerLocations[1].z

                let regone = conquestInstances[i].regions[xone][zone]
                let regtwo = conquestInstances[i].regions[xtwo][ztwo]

                regone.bluePoints += config.playerPointsGeneration
                regtwo.redPoints += config.playerPointsGeneration

                if (regone.capacity < regone.bluePoints) {
                    regone.bluePoints = regone.capacity
                }

                if (regtwo.capacity < regtwo.redPoints) {
                    regtwo.redPoints = regtwo.capacity
                }

                for (var j = 0; j < conquestInstances[i].regions.length; j++) {
                    for (var k = 0; k < conquestInstances[i].regions[j].length; k++) {

                        //Conquered regions points generation
                        let region = conquestInstances[i].regions[j][k]
                        if (region.isControlled) {
                            if (region.owner = 1) {
                                region.redPoints += config.regionPointsGeneration
                                if (region.capacity < region.redPoints) {
                                    region.redPoints = region.capacity
                                }

                            } else if (region.owner = 0) {
                                region.bluePoints += config.regionPointsGeneration
                                if (region.capacity < region.bluePoints) {
                                    region.bluePoints = region.capacity
                                }
                            } else {

                            }
                        }
                    }
                }
            }
        }
    },
}
