module.exports = {

    CreateConquestInstance: function (lobby, config) {
        let instance = {
            isActive: true,
            lobby: lobby,
            playerLocations: [{ x: 8, z: 8 }, { x: 0, z: 0 }]
        }
        let regions = []
        function Region(config) {
            this.redPoints = 0
            this.bluePoints = 0
            this.isControlled = false
            this.type = "dormant"
            this.owner = undefined
            this.capacity = config.capacity
        }
        for (var i = 0; i < 9; i++) {
            regions.push([])
            for (var j = 0; j < 9; j++) {
                let region = new Region(config)
                if (i == 0 && j == 0) {
                    region.owner = 1
                    region.isControlled = true
                    region.redPoints = config.capacity * 2
                    region.capacity = config.capacity * 2
                    region.type = "conqueror"
                    region.name = "base-red"
                }
                if (i == 8 && j == 8) {
                    region.owner = 0
                    region.bluePoints = config.capacity * 2
                    region.isControlled = true
                    region.capacity = config.capacity * 2
                    region.type = "conqueror"
                    region.name = "base-blue"
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

                //Current player location point generation and related
                //events
                let xone = conquestInstances[i].playerLocations[0].x
                let zone = conquestInstances[i].playerLocations[0].z
                let xtwo = conquestInstances[i].playerLocations[1].x
                let ztwo = conquestInstances[i].playerLocations[1].z

                let regone = conquestInstances[i].regions[zone][xone]
                let regtwo = conquestInstances[i].regions[ztwo][xtwo]

                //First player [blue]
                regone.bluePoints += config.playerPointsGeneration
                //Second player [red]
                regtwo.redPoints += config.playerPointsGeneration

                //Removing and adding points

                //Related to player one
                if (regone.bluePoints <= regone.redPoints) {
                    regone.redPoints -= regone.bluePoints
                    regone.bluePoints = 0
                } else {
                    regone.bluePoints -= regone.redPoints
                    regone.redPoints = 0
                }
                //Related to player two
                if (regtwo.redPoints <= regtwo.bluePoints) {
                    regtwo.bluePoints -= regtwo.redPoints
                    regtwo.redPoints = 0
                } else {
                    regtwo.redPoints -= regtwo.bluePoints
                    regtwo.bluePoints = 0
                }

                //Respecting the region points cap
                if (regone.capacity < regone.bluePoints) {
                    regone.bluePoints = regone.capacity
                }

                if (regtwo.capacity < regtwo.redPoints) {
                    regtwo.redPoints = regtwo.capacity
                }

                //Conquering region
                //Events for blue
                if (regone.type == "dormant") {
                    if (regone.bluePoints >= (regone.capacity / 2)) {
                        regone.type = "conquered"
                        regone.isControlled = true
                        regone.owner = 0
                    }
                } else if (regone.type == "conquered") {
                    if (regone.owner == 1) {
                        if (regone.redPoints == 0) {
                            regone.type = "dormant"
                            regone.isControlled = false
                            regone.owner = undefined
                        }
                    } else {
                        if (regone.bluePoints == (regone.capacity)) {
                            regone.type = "conqueror"
                        }
                    }
                } else {
                    if (regone.owner == 1 && regone.type == "conqueror") {
                        if (regone.redPoints <= regone.capacity / 2) {
                            regone.type = "conquered"
                        }
                    }
                }
                //Events for red
                if (regtwo.type == "dormant") {
                    if (regtwo.redPoints >= (regtwo.capacity / 2)) {
                        regtwo.type = "conquered"
                        regtwo.isControlled = true
                        regtwo.owner = 1
                    }
                } else if (regtwo.type == "conquered") {
                    if (regtwo.owner == 0) {
                        if (regtwo.bluePoints == 0) {
                            regtwo.type = "dormant"
                            regtwo.isControlled = false
                            regtwo.owner = undefined
                        }
                    } else {
                        if (regtwo.redPoints == (regtwo.capacity)) {
                            regtwo.type = "conqueror"
                        }
                    }
                } else {
                    if (regtwo.owner == 0 && regtwo.type == "conqueror") {
                        if (regtwo.redPoints <= regtwo.capacity / 2) {
                            regtwo.type = "conquered"
                        }
                    }
                }

                console.log("|BLUE: " + regone.bluePoints + " region: " + regone.type + " || Red " + regtwo.redPoints + " region: " + regtwo.type + " |")
                for (var j = 0; j < conquestInstances[i].regions.length; j++) {
                    for (var k = 0; k < conquestInstances[i].regions[j].length; k++) {

                        //Conquered regions points generation and related
                        //events
                        let region = conquestInstances[i].regions[j][k]
                        let pointsGen = config.playerPointsGeneration
                        let currentBoard = conquestInstances[i].regions
                        let region_right = currentBoard[j][k + 1]
                        let region_left = currentBoard[j][k - 1]
                        let region_top, region_bottom
                        if (currentBoard[j + 1]) {
                            region_top = currentBoard[j + 1][k]
                        }
                        if (currentBoard[j - 1]) {
                            region_bottom = currentBoard[j - 1][k]
                        }
                        if (region.isControlled) {
                            //For regions conquered by red
                            if (region.owner == 1) {


                                //Handle enemy expansion
                                if (region.redPoints <= 0) {
                                    region.redPoints = 0
                                    region.owner = undefined
                                    region.type = "dormant"
                                }
                                if (region.redPoints < (region.capacity / 2)) {
                                    region.type == "conquered"
                                }
                                //Generate points if possible
                                if (region.type == "conquered" || region.type == "conqueror") {

                                    region.type == "conquered" ? region.redPoints += pointsGen : region.redPoints += (pointsGen * 2)

                                    //Respect region cap
                                    if (region.capacity < region.redPoints) {
                                        region.redPoints = region.capacity
                                    }
                                }

                                if (region.type == "conqueror") {
                                    //Expansion mechanics
                                    if (region_right) {
                                        region_right.redPoints += (pointsGen / 3)
                                        if (region_right.redPoints <= region_right.bluePoints) {
                                            region_right.bluePoints -= region_right.redPoints
                                            region_right.redPoints = 0
                                        } else {
                                            region_right.redPoints -= region_right.bluePoints
                                            region_right.bluePoints = 0
                                        }
                                        if (region_right.capacity < region_right.redPoints) {
                                            region_right.redPoints = region_right.capacity
                                        }
                                    }
                                    if (region_left) {
                                        region_left.redPoints += (pointsGen / 3)
                                        if (region_left.redPoints <= region_left.bluePoints) {
                                            region_left.bluePoints -= region_left.redPoints
                                            region_left.redPoints = 0
                                        } else {
                                            region_left.redPoints -= region_left.bluePoints
                                            region_left.bluePoints = 0
                                        }
                                        if (region_left.capacity < region_left.redPoints) {
                                            region_left.redPoints = region_left.capacity
                                        }
                                    }
                                    if (region_bottom) {
                                        region_bottom.redPoints += (pointsGen / 3)
                                        if (region_bottom.redPoints <= region_bottom.bluePoints) {
                                            region_bottom.bluePoints -= region_bottom.redPoints
                                            region_bottom.redPoints = 0
                                        } else {
                                            region_bottom.redPoints -= region_bottom.bluePoints
                                            region_bottom.bluePoints = 0
                                        }
                                        if (region_bottom.capacity < region_bottom.redPoints) {
                                            region_bottom.redPoints = region_bottom.capacity
                                        }
                                    }
                                    if (region_top) {
                                        region_top.redPoints += (pointsGen / 3)
                                        if (region_top.redPoints <= region_top.bluePoints) {
                                            region_top.bluePoints -= region_top.redPoints
                                            region_top.redPoints = 0
                                        } else {
                                            region_top.redPoints -= region_top.bluePoints
                                            region_top.bluePoints = 0
                                        }
                                        if (region_top.capacity < region_top.redPoints) {
                                            region_top.redPoints = region_top.capacity
                                        }
                                    }

                                } else {
                                    //Check if upgrade to conqueror is possible
                                    if (region.redPoints == region.capacity) {
                                        region.type = "conqueror"
                                    }
                                }

                                //For regions conquered by blue
                            } else if (region.owner == 0) {


                                //Handle enemy expansion
                                if (region.bluePoints <= 0) {
                                    region.bluePoints = 0
                                    region.owner = undefined
                                    region.isControlled = false
                                    region.type = "dormant"
                                }
                                if (region.bluePoints < (region.capacity / 2)) {
                                    region.type == "conquered"
                                }
                                //Generate points if possible
                                if (region.type == "conquered" || region.type == "conqueror") {
                                    region.type == "conquered" ? region.bluePoints += pointsGen : region.bluePoints += (pointsGen * 2)

                                    //Respect region cap                                    
                                    if (region.capacity < region.bluePoints) {
                                        region.bluePoints = region.capacity
                                    }
                                }

                                if (region.type == "conqueror") {
                                    //Expansion mechanics
                                    if (region_right) {
                                        region_right.bluePoints += (pointsGen / 3)
                                        if (region_right.bluePoints <= region_right.redPoints) {
                                            region_right.redPoints -= region_right.bluePoints
                                            region_right.bluePoints = 0
                                        } else {
                                            region_right.bluePoints -= region_right.redPoints
                                            region_right.redPoints = 0
                                        }
                                        if (region_right.capacity < region_right.bluePoints) {
                                            region_right.bluePoints = region_right.capacity
                                        }
                                    }
                                    if (region_left) {
                                        region_left.bluePoints += (pointsGen / 3)
                                        if (region_left.bluePoints <= region_left.redPoints) {
                                            region_left.redPoints -= region_left.bluePoints
                                            region_left.bluePoints = 0
                                        } else {
                                            region_left.bluePoints -= region_left.redPoints
                                            region_left.redPoints = 0
                                        }
                                        if (region_left.capacity < region_left.bluePoints) {
                                            region_left.bluePoints = region_left.capacity
                                        }
                                    }
                                    if (region_bottom) {
                                        region_bottom.bluePoints += (pointsGen / 3)
                                        if (region_bottom.bluePoints <= region_bottom.redPoints) {
                                            region_bottom.redPoints -= region_bottom.bluePoints
                                            region_bottom.bluePoints = 0
                                        } else {
                                            region_bottom.bluePoints -= region_bottom.redPoints
                                            region_bottom.redPoints = 0
                                        }
                                        if (region_bottom.capacity < region_bottom.bluePoints) {
                                            region_bottom.bluePoints = region_bottom.capacity
                                        }
                                    }
                                    if (region_top) {
                                        region_top.bluePoints += (pointsGen / 3)
                                        if (region_top.bluePoints <= region_top.redPoints) {
                                            region_top.redPoints -= region_top.bluePoints
                                            region_top.bluePoints = 0
                                        } else {
                                            region_top.bluePoints -= region_top.redPoints
                                            region_top.redPoints = 0
                                        }
                                        if (region_top.capacity < region_top.bluePoints) {
                                            region_top.bluePoints = region_top.capacity
                                        }
                                    }
                                } else {
                                    //Check if upgrade to conqueror is possible
                                    if (region.bluePoints == region.capacity) {
                                        region.type = "conqueror"
                                    }
                                }
                            }
                        } else {
                            //For unconquered regions
                            if (region.redPoints >= 50) {
                                region.type = "conquered"
                                region.owner = 1
                                region.isControlled = true;
                            }
                            if (region.bluePoints >= 50) {
                                region.type = "conquered"
                                region.owner = 0
                                region.isControlled = true;
                            }
                        }
                    }
                }
            }
        }
    },
}
