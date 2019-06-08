module.exports = {

    CreateConquestInstance: function (lobby, config) {
        let instance = {
            isActive: true,
            lobby: lobby,
            playerLocations: [{ x: 8, z: 8 }, { x: 0, z: 0 }],
            redRegions: 1,
            blueRegions: 1,
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

                let currentInstance = conquestInstances[i]
                //Current player location point generation and related
                //events
                let xone = currentInstance.playerLocations[0].x
                let zone = currentInstance.playerLocations[0].z
                let xtwo = currentInstance.playerLocations[1].x
                let ztwo = currentInstance.playerLocations[1].z

                let regone = currentInstance.regions[zone][xone]
                let regtwo = currentInstance.regions[ztwo][xtwo]

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
                        currentInstance.blueRegions++
                        regone.owner = 0
                    }
                } else if (regone.type == "conquered") {
                    if (regone.owner == 1) {
                        if (regone.redPoints == 0) {
                            regone.type = "dormant"
                            regone.isControlled = false
                            currentInstance.redRegions--
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
                        currentInstance.redRegions++
                        regtwo.owner = 1
                    }
                } else if (regtwo.type == "conquered") {
                    if (regtwo.owner == 0) {
                        if (regtwo.bluePoints == 0) {
                            regtwo.type = "dormant"
                            regtwo.isControlled = false
                            currentInstance.blueRegions--
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
                //The expansion iteration
                for (var j = 0; j < conquestInstances[i].regions.length; j++) {
                    for (var k = 0; k < conquestInstances[i].regions[j].length; k++) {

                        //Conquered regions points generation and related
                        //events

                        //Read config data
                        let pointsGen = config.regionPointsGeneration
                        let ged = config.globalExpansionDivider

                        let region = conquestInstances[i].regions[j][k]
                        let currentBoard = conquestInstances[i].regions
                        let region_top = currentBoard[j][k + 1]
                        let region_bottom = currentBoard[j][k - 1]
                        let region_left, region_right
                        if (currentBoard[j + 1]) {
                            region_left = currentBoard[j + 1][k]
                        }
                        if (currentBoard[j - 1]) {
                            region_right = currentBoard[j - 1][k]
                        }
                        //Newly written expansion mechanics
                        let checkforConqueror = function (region, checkedRegion, pointsGen, ged, currentInstance, isSpecial, currentBoard) {
                            if (checkedRegion) {
                                if (checkedRegion.type == "conqueror") {
                                    if (checkedRegion.owner == 0) {
                                        //Handle incoming points
                                        region.bluePoints += (pointsGen / ged)
                                        if (region.bluePoints <= region.redPoints) {
                                            region.redPoints -= region.bluePoints
                                            region.bluePoints = 0
                                        } else {
                                            region.bluePoints -= region.redPoints
                                            region.redPoints = 0
                                        }
                                        //Respect region capacity
                                        if (region.capacity < region.bluePoints) {
                                            region.bluePoints = region.capacity
                                        }
                                        if (region.owner == 0) {
                                            if (region.bluePoints == region.capacity && region.type == "conquered") {
                                                region.type = "conqueror"
                                                if (isSpecial) {
                                                    let region_top = currentBoard[j][k + 1]
                                                    let region_bottom = currentBoard[j][k - 1]
                                                    let region_left, region_right
                                                    if (currentBoard[j + 1]) {
                                                        region_left = currentBoard[j + 1][k]
                                                    }
                                                    if (currentBoard[j - 1]) {
                                                        region_right = currentBoard[j - 1][k]
                                                    }
                                                    let expandBlue = function (region, pointsGen, ged, currentInstance) {
                                                        if (region) {
                                                            region.bluePoints += (pointsGen / ged)
                                                            if (region.bluePoints <= region.redPoints) {
                                                                region.redPoints -= region.bluePoints
                                                                region.bluePoints = 0
                                                            } else {
                                                                region.bluePoints -= region.redPoints
                                                                region.redPoints = 0
                                                            }
                                                            if (region.bluePoints >= 50 && region.type == "dormant") {
                                                                region.type = "conquered"
                                                                region.owner = 0
                                                                region.isControlled = true;
                                                                currentInstance.blueRegions++
                                                            }
                                                            if (region.bluePoints >= region.capacity) {
                                                                region.type = "conqueror"
                                                            }
                                                            if (region.capacity < region.bluePoints) {
                                                                region.bluePoints = region.capacity
                                                            }
                                                        }
                                                    }
                                                    expandBlue(region_top, pointsGen, ged, currentInstance)
                                                    expandBlue(region_bottom, pointsGen, ged, currentInstance)
                                                    expandBlue(region_right, pointsGen, ged, currentInstance)
                                                    expandBlue(region_left, pointsGen, ged, currentInstance)
                                                }

                                            }

                                        } else if (region.owner == 1) {
                                            if (region.redPoints <= 0) {
                                                region.type = "dormant"
                                                region.owner = undefined
                                                region.isControlled = false;
                                                currentInstance.redRegions--
                                            }
                                            if (region.redPoints < (region.capacity / 2) && region.type == "conqueror") {
                                                region.type = "conquered"

                                            }
                                        } else {
                                            if (region.bluePoints >= (region.capacity / 2)) {
                                                region.type = "conquered"
                                                region.owner = 0
                                                region.isControlled = true;
                                                currentInstance.blueRegions++
                                            }
                                        }
                                    } else if (checkedRegion.owner == 1) {
                                        //Handle incoming points
                                        region.redPoints += (pointsGen / ged)
                                        if (region.redPoints <= region.bluePoints) {
                                            region.bluePoints -= region.redPoints
                                            region.redPoints = 0
                                        } else {
                                            region.redPoints -= region.bluePoints
                                            region.bluePoints = 0
                                        }
                                        //Respect region capacity
                                        if (region.capacity < region.redPoints) {
                                            region.redPoints = region.capacity
                                        }
                                        if (region.owner == 0) {
                                            if (region.bluePoints <= 0) {
                                                region.type = "dormant"
                                                region.owner = undefined
                                                region.isControlled = false;
                                                currentInstance.blueRegions--
                                            }
                                            if (region.redPoints < (region.capacity / 2) && region.type == "conqueror") {
                                                region.type = "conquered"
                                            }

                                        } else if (region.owner == 1) {
                                            if (region.redPoints == region.capacity && region.type == "conquered") {
                                                region.type = "conqueror"
                                                if (isSpecial) {
                                                    let region_top = currentBoard[j][k + 1]
                                                    let region_bottom = currentBoard[j][k - 1]
                                                    let region_left, region_right
                                                    if (currentBoard[j + 1]) {
                                                        region_left = currentBoard[j + 1][k]
                                                    }
                                                    if (currentBoard[j - 1]) {
                                                        region_right = currentBoard[j - 1][k]
                                                    }
                                                    let expandRed = function (region, pointsGen, ged, currentInstance) {
                                                        if (region) {
                                                            region.redPoints += (pointsGen / ged)
                                                            if (region.redPoints <= region.bluePoints) {
                                                                region.bluePoints -= region.redPoints
                                                                region.redPoints = 0
                                                            } else {
                                                                region.redPoints -= region.bluePoints
                                                                region.bluePoints = 0
                                                            }
                                                            //Check and conquer if possible
                                                            if (region.redPoints >= 50 && region.type == "dormant") {
                                                                region.type = "conquered"
                                                                region.owner = 1
                                                                region.isControlled = true;
                                                                currentInstance.redRegions++
                                                            }
                                                            if (region.redPoints >= region.capacity) {
                                                                region.type = "conqueror"
                                                            }
                                                            if (region.capacity < region.redPoints) {
                                                                region.redPoints = region.capacity
                                                            }
                                                        }
                                                    }
                                                    expandRed(region_top, pointsGen, ged, currentInstance)
                                                    expandRed(region_bottom, pointsGen, ged, currentInstance)
                                                    expandRed(region_right, pointsGen, ged, currentInstance)
                                                    expandRed(region_left, pointsGen, ged, currentInstance)
                                                }
                                            }
                                        } else {
                                            if (region.redPoints >= (region.capacity / 2)) {
                                                region.type = "conquered"
                                                region.owner = 1
                                                region.isControlled = true;
                                                currentInstance.redRegions++
                                            }
                                        }
                                    }
                                }

                            }
                        }
                        checkforConqueror(region, region_top, pointsGen, ged, currentInstance, true, currentBoard)
                        checkforConqueror(region, region_left, pointsGen, ged, currentInstance, true, currentBoard)

                        checkforConqueror(region, region_right, pointsGen, ged, currentInstance, false, currentBoard)
                        checkforConqueror(region, region_bottom, pointsGen, ged, currentInstance, false, currentBoard)
                    }
                }
                //The growth iteration
                for (var j = 0; j < conquestInstances[i].regions.length; j++) {
                    for (var k = 0; k < conquestInstances[i].regions[j].length; k++) {
                        let pointsGen = config.regionPointsGeneration
                        let ged = config.globalExpansionDivider

                        let region = conquestInstances[i].regions[j][k]
                        if (region.isControlled) {
                            //For red regions
                            if (region.owner == 1) {
                                //Handle enemy expansion
                                if (region.redPoints <= 0) {
                                    region.redPoints = 0
                                    region.isControlled = false
                                    currentBoard.redRegions--
                                    region.owner = undefined
                                    region.type = "dormant"
                                }
                                if (region.redPoints < (region.capacity / 2)) {
                                    region.type == "conquered"
                                }
                                if (region.redPoints == region.capacity) {
                                    region.type == "conqueror"
                                }
                                //Generate points if possible
                                if (region.type == "conquered" || region.type == "conqueror") {

                                    region.type == "conquered" ? region.redPoints += pointsGen : region.redPoints += (pointsGen * 1.25)

                                    //Respect region cap
                                    if (region.capacity < region.redPoints) {
                                        region.redPoints = region.capacity
                                    }
                                    if (region.redPoints == region.capacity) {
                                        region.type == "conqueror"
                                    }
                                }
                                //For blue regions
                            } else if (region.owner == 0) {
                                //Handle enemy expansion
                                if (region.bluePoints <= 0) {
                                    region.bluePoints = 0
                                    region.owner = undefined
                                    region.isControlled = false
                                    currentInstance.blueRegions--
                                    region.type = "dormant"
                                }
                                if (region.bluePoints < (region.capacity / 2)) {
                                    region.type == "conquered"
                                }
                                //Generate points if possible
                                if (region.type == "conquered" || region.type == "conqueror") {
                                    region.type == "conquered" ? region.bluePoints += pointsGen : region.bluePoints += (pointsGen * 1.25)

                                    //Respect region cap                                    
                                    if (region.capacity < region.bluePoints) {
                                        region.bluePoints = region.capacity
                                    }
                                    if (region.bluePoints == region.capacity) {
                                        region.type == "conqueror"
                                    }
                                }
                            }
                        }
                    }
                }
                // console.log("||Expansion income " + (config.regionPointsGeneration / config.globalExpansionDivider) + " ||Growth rate: " + config.regionPointsGeneration + " ||Conqueror growth rate: " + (config.regionPointsGeneration * 1.25))
                // console.log("||8,7: " + currentInstance.regions[8][7].bluePoints + " status: " + currentInstance.regions[8][7].type + " ||7,8 " + currentInstance.regions[7][8].bluePoints + " status: " + currentInstance.regions[7][8].type)
                // console.log("||8,6: " + currentInstance.regions[8][6].bluePoints + " status: " + currentInstance.regions[8][6].type + " ||6,8 " + currentInstance.regions[6][8].bluePoints + " status: " + currentInstance.regions[6][8].type)
                // console.log("||0,1: " + currentInstance.regions[0][1].redPoints + " status: " + currentInstance.regions[0][1].type + " ||1,0 " + currentInstance.regions[1][0].redPoints + " status: " + currentInstance.regions[1][0].type)
                // console.log("||0,2: " + currentInstance.regions[0][2].redPoints + " status: " + currentInstance.regions[0][2].type + " ||2,0 " + currentInstance.regions[2][0].redPoints + " status: " + currentInstance.regions[2][0].type)
                // console.log("|BLUE: " + currentInstance.blueRegions + " || Red " + currentInstance.redRegions + "|")
            }
        }
    },
}
