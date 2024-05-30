const express = require('express')
const path = require ('path')

const app = express()

const port = 3000

app.get('/', (req, res) => {
    // Send the HTML file as the response
    res.sendFile(path.join(__dirname, 'app/index.html'));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})