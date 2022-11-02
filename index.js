const express = require('express');
require('dotenv').config();
const router  = require('./routes/routes.js');
const app = express();
const port = 3000;
app.use(express.json());

app.use('/api/', router);
app.get('/', (req, res) => {    
    res.json({ message: 'Hello World!' });
});
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});