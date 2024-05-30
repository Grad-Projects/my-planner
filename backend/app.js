const express = require('express');
const endpoints = require("./api/routes");
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors())
app.use(express.json());

app.listen(port, () => {console.log(`Server has started on port: ${port} ✔️`)});

app.use("/api/v1", endpoints);

app.get('/hello', (req, res) => {
    res.send('Hello World');
});