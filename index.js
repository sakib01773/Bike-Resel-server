const express = require('express')
const app = express()
const port = process.env.PORT ||5000

app.get('/', (req, res) => {
  res.send('Hello from resell bike store!')
})

app.listen(port, () => {
  console.log(`resell bike store listening on port ${port}`)
})