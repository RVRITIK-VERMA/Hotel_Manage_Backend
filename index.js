const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const cors = require('cors');

app.use(bodyParser.json());

const corsOptions = {
    origin: ['http://localhost:4200', '*'],
    optionsSuccessStatus: 200
  };
app.use(cors(corsOptions));

//importing routes
const routes = require('./routes/routes');
app.use(routes);

app.get('/',(req,res)=>{
    res.send('Welcome to Hotel Management API');
})

module.exports = app;