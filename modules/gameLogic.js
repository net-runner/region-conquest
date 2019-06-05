module.exports = {

    CreateConquestInstance: function () {
        let instance = {
            status: "active",
            regions: regions
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
                    region.redPoints = 200
                    region.capacity = 200

                } else if (i == 8 && j == 8) {
                    region.owner = 1
                    region.bluePoints = 200
                    region.capacity = 200
                }
                regions[i][j] = region
            }
        }
        return regions
    },
}
