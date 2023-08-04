const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
require('dotenv').config();
app.use(cors());
app.use(express.json());
const port = 5000





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pbafkul.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        const taskCollection = client.db('msc-task').collection('task')

        //post task in database 
        app.post('/Addtask', async (req, res) => {
            const body = req.body;
            const result = await taskCollection.insertOne(body);
            res.send(result);
        })

        // get task 
        app.get('/task', async (req, res) => {
            const query1 = { status: 'todo' }
            const query2 = { status: 'inreview' }
            const query3 = { status: 'completed' }

            const result1 = await taskCollection.find(query1).toArray();
            const result2 = await taskCollection.find(query2).toArray();
            const result3 = await taskCollection.find(query3).toArray();
            res.send([result1, result2, result3])
        })
        app.put('/editTask', async (req, res) => {
            const body = req.body;
            const id = body.id;
            const title = body.title;
            const description = body.description;
            const status = body.status;
            const filter = {
                _id: new ObjectId(id)
            }

            const updatedDoc = {
                $set: {
                    title,
                    description,
                    status
                }
            }
            const result = await taskCollection.updateOne(filter, updatedDoc);
            res.send(result);
        })


        app.delete('/deleteTask/:id',async(req,res)=>{
            const id = req.params.id;
            console.log(id);
            const query={
                _id:new ObjectId(id)
            }
            const result =await taskCollection.deleteOne(query);
            res.send(result);
        })
    } finally {

    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})