// Testing create stream

if (typeof (tests) != "object") {
    tests = [];
}

// Create a document

sizes = [100, 5000, 10000, 50000]


// TEST change streams source

sizes.forEach(size => {
    // Create the documents
    doc = { "fieldName": 'x'.repeat(size) }

    tests.push({
        // Naming convention is {TEST_NAME}-{BYTES}
        name: "ChangeStreams-".concat(size.toString()),
        tags: ["streams", "change-stream"],
        pre: function (collection) {

            let agg = []

            agg.push({
                $in: { db: "test0", coll: "ChangeStreams".concat(size.toString()) }
            })

            agg.push({
                $merge: { into: { db: "test0", coll: "output0" } }
            })

            collection.getDB().createStream("ChangeStream0", agg)
        },
        ops: [
            {
                op: "insert",
                ns: "test0.ChangeStreams".concat(size.toString()),
                doc: doc
            },
        ],
        post: function (collection) {
            print("@START_TEST_PRINT@")
            print("Count of total into change streams: ", collection.getDB()["output0"].count())
            print("@END_TEST_PRINT@")
            collection.getDB()["ChangeStream".concat(size.toString())].drop()
            collection.getDB()["output0"].drop()
            collection.getDB()["ChangeStream0"].drop()
            sleep(5000)
        }
    })
});