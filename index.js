const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 5000;

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

require('dotenv').config()


//middleare
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello from resell bike store!')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.llsjgoo.mongodb.net/?retryWrites=true&w=majority`;

console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{

        const usersCollection = client.db('resellPortal').collection('users')

        const productsCollection = client.db('resalePortal').collection('products')


        app.post('/users', async(req, res) =>{
            const user = req.body;
            const result = await usersCollection.insertOne(user)
            res.send(result)
        })
      
        app.post('/products', async(req, res)=>{
          const product = req.body;
          const result = await productsCollection.insertOne(product)
          res.send(result)
      })

    }

    finally{

    }
}

run().catch(console.log)



app.listen(port, () => {
  console.log(`resell bike store listening on port ${port}`)
})