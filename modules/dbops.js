module.exports = {

    //Module oriented on performing various task on MongoDB

    Insert: function (collection, data) {
        collection.insert(data, function (err, result) {
            console.log(result)
        });
    },


    SelectAll: function (collection) {
        collection.find({}).toArray(function (err, items) {
            console.log(items)
            callback(items)
        });
    },



    SelectAndLimit: function (collection) {
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
