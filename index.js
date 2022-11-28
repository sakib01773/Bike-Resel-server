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
      
      // advertaisement
      app.put('/products/seller/:id', async(req, res) =>{
        const id = req.params.id;
        const filter = {_id: ObjectId(id)}
        console.log('id', id)
        const options = { upsert: true }
        const updatedDoc = {
            $set: {
                roleModel: 'Advertised'
            }
        }
        const result = await productsCollection.updateOne(filter, updatedDoc, options)

        // console.log(result)

        res.send(result)
      })
      
      app.get('/products/:email',  async(req, res)=>{
        // const email = req.params.email;
        const query = { }
        const product = await productsCollection.find(query).toArray();
        // console.log(product)
        res.send(product)
    })



    // particular user 
    app.get('/users/admin/:email', async(req, res) =>{
        const email = req.params.email
        const query = { email }
        // console.log(email)
        
        const user = await usersCollection.findOne(query)
        // console.log(user)
        res.send({isAdmin: user?.role === "Admin"})
    })
      
      //seller

      app.get('/users/seller/:email',  async(req, res) =>{
        const email = req.params.email
        const query = { email: email }
        const user = await usersCollection.findOne(query)
        // console.log(user)
        res.send({isSeller: user?.allUsers === "Seller"})
      })
      
      app.get('/users', async(req, res) =>{
        const query = {};
        const users = await usersCollection.find(query).toArray()
        res.send(users)
    })



    }

    finally{

    }
}

run().catch(console.log)



app.listen(port, () => {
  console.log(`resell bike store listening on port ${port}`)
})