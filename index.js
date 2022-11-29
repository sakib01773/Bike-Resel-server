const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 5000;

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

require('dotenv').config()

const jwt = require('jsonwebtoken');


app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.aebmoeb.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



function verifyJWT (req, res, next){
    const authHeader = req.headers.authorization;
    if(!authHeader){
        return res.status(401).send('unauthorized access')
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.ACCESS_TOKEN, function(err, decoded){
        if(err){
            return res.status(403).send({message: 'forbidden access'})
        }
        req.decoded = decoded
        next();
    })

}


async function run(){
    try{

        const usersCollection = client.db('bikeresell').collection('users')

        const productsCollection = client.db('bikeresell').collection('products')

        app.get('/jwt', async(req, res) =>{
            const email = req.query.email;
            const query = {email: email}
            const user = await usersCollection.findOne(query)
            if(user && user.email){
                const token = jwt.sign({email}, process.env.ACCESS_TOKEN, {expiresIn: '1h'})
                return res.send({accessToken: token})
            }
            console.log(user)
            res.status(403).send({accessToken: ''})

        })


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

        // app.get('/products/:id', async(req, res) =>{
        //     const id = req.params.id;
        //     const query = { _id: ObjectId(id)}
        //     const product = await productsCollection.findOne(query)
        //     res.send(product)
        // })

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

        // app.get('/products', async(req, res) =>{
        //     const email = req.params.email;
        //     const query = {email: email}
        //     const products = await productsCollection.find(query).toArray()
        //     res.send(products)
        // })



        // app.get('/users', async(req, res) =>{
        //     const query = {}
        //     const users = await usersCollection.find(query).toArray()
        //     res.send(users)
        // })


        
        app.get('/users', async(req, res) =>{
            const query = {};
            const users = await usersCollection.find(query).toArray()
            res.send(users)
        })


        // advertise field add 
        // app.put('/addAdvertise', async(req, res) =>{
        //     const filter = {}
        //     const options = { upsert: true }
        //     const updatedDoc = {
        //         $set: {
        //             Advertised: 'Ad'
        //         }
        //     }
        //     const result = await productsCollection.updateMany(filter, updatedDoc, options)

        //     res.send(result)
        // })

        // make admin 
        app.put('/users/admin/:id', verifyJWT, async(req, res) =>{
            const decodedEmail = req.decoded.email;

            const query = { email: decodedEmail }
            const user = await usersCollection.findOne(query)

            if(user.role !== 'Adimn'){
                return res.status(403).send({message: 'Forbidden access'})
            }


            const id = req.params.id;
            const filter = {_id: ObjectId(id)}
            const options = { upsert: true }
            const updatedDoc = {
                $set: {
                    role: 'Admin'
                }
            }
            const result = await usersCollection.updateOne(filter, updatedDoc, options)

            res.send(result)
        })


        app.delete('/users/:id', async(req, res) =>{
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const result = await usersCollection.deleteOne(filter)
            res.send(result)
        })






    }

    finally{

    }
}

run().catch(console.log)



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})