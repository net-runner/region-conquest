module.exports = {

    //Module oriented on performing various task on MongoDB

    Insert: function (collection, data) {
        collection.insertOne(data, function (err, result) {
        });
    },


    SelectAll: function (collection) {
        var data = []
        collection.find({}).toArray(function (err, items) {
            data.push(items)
        });
        return data
    },

    ifUserExists: function (collection, info, connections, client, conquestInstances, clientData, loginInfo, io, u_log, game, config, callback) {
        collection.findOne({ nickname: info.nickname }, function (err, result) {
            if (err) throw err;
            else callback(result, info, connections, client, conquestInstances, clientData, loginInfo, io, u_log, game, config)
        })

    },

    SelectAndLimit: function (collection, login) {
        collection.find({ login: "test" }).toArray(function (err, items) {
            console.log(items)
            if (err) console.log(err)

            else callback(items)
        });
    },



    DeleteById: function (ObjectID, collection, id) {
        collection.remove({ _id: ObjectID(id) }, function (err, data) {
            console.log(data)
        })
    },
    UpdateById: function (ObjectID, collection, data) {
        collection.updateOne(
            { _id: ObjectID("id_dokumentu_ktory_chcemy_usunac") },
            { $set: { pass: "test" } },
            function (err, data) {
                console.log("update: " + data)
            })
    },

}
