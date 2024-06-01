const express = require('express');
const app = express();
const port = 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.use(express.static("../frontend"));

app.get('/hello', (req, res) => {
    res.send('Hello World');
});

app.get('/',(req,res)=>{
    res.sendFile('index.html',{root: __dirname});
})
