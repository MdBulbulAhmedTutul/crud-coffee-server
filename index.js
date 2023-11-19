const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middle ware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sq1fqp2.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        await client.connect();
        const categoryCollection = client.db('coffeeHouse').collection('category');
        const orderCollection = client.db('coffeeHouse').collection('orderProduct');
        const coffeeCollection = client.db('coffeeHouse').collection('coffee');

        // category api
        app.get('/category', async (req, res) => {
            const cursor = categoryCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        // orderproduct api
        app.get('/orderProducts', async (req, res) => {
            const cursor = orderCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.post('/coffee', async(req, res) => {
            const newCoffee = req.body;
            console.log(newCoffee);
            const result = await coffeeCollection.insertOne(newCoffee);
            res.send(result);
        })

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {

    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('coffe server is running');
})

app.listen(port, () => {
    console.log(`coffe server is running on port ${port}`)
})