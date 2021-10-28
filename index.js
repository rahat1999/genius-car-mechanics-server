const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config()

const app = express();
const port = 5000;

/* ====Middleware */
app.use(cors())
app.use(express.json())

/*===== MongoDb======= */
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2rvjh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        // console.log('workfine');
        const database = client.db("carMechanic");
        const servicesCollection = database.collection("services");

        /* ==Get Api== */
        app.get('/services', async (req, res) => {
            const cursor = await servicesCollection.find({}).toArray()
            res.send(cursor);
        })

        /* ====Get single api//Find api==== */
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            // console.log('getting singhle id', id)
            res.json(service)
        })


        //======post api=============
        app.post('/services', async (req, res) => {
            const service = req.body;
            const result = await servicesCollection.insertOne(service)
            // console.log(result)
            res.json(result)

        })
        /* ===Delete Api======= */
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await servicesCollection.deleteOne(query);
            // console.log('getting delete ', id)
            // console.log(result)

            res.json(result)
        })

    } finally {
        //   await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Running Genius Server')
})

app.listen(port, () => {
    console.log(`Running Genius Server on at http://localhost:${port}`)
})