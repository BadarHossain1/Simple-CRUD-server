const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const port = 5000;

app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://badar12041:UYD6JLlrt9hkkveo@cluster0.lblkdq0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
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
        const database = client.db("usersDB");
        const haiku = database.collection("users");

        app.get('/users', async (req, res) => {
            const cursor = haiku.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/', (req, res) => {
            res.send('Hello world');
        });

        app.get('/users/:id', async (req, res) =>{
            const id = req.params.id;
            console.log('ID:', id);
            const query = {_id: new ObjectId(id)};
            const result = await haiku.findOne(query);
            res.send(result);
            console.log(result);
        })

        app.post('/users', async (req, res) => {
            const user = req.body;
            console.log('New user here in server', user);
            const result = await haiku.insertOne(user);
            res.send(result);
        });

        app.put('/users/:id', async (req, res) => {
            const id = req.params.id;
            const updatedUser = req.body;
            const filter = { _id: new ObjectId(id) };
            const options = {upset:true}
            const updateDoc = {
                $set: {
                    name: updatedUser.name,
                    age: updatedUser.age,
                   
                },
            };
            const result = await haiku.updateOne(filter, updateDoc, options);
            res.send(result);
            console.log(result);
        })

        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await haiku.deleteOne(query);
            res.send(result);
            console.log(result);
        });

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensure the client will close when you finish/error
        // Don't close client here, otherwise, it will close before handling requests
    }
}

// Move the listening part inside the run function
run().then(() => {
    
    app.listen(port, () => {
        console.log(`SERVER IS RUNNING ON http://localhost:${port}`);
    });
}).catch(console.dir);
