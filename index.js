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



app.listen(port, () => {
  console.log(`resell bike store listening on port ${port}`)
})