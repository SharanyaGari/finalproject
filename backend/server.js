const express = require('express');
const mongoose = require("mongoose");
const dataModel = require("./modules/data_schema")
const url = "mongodb://localhost:27017/mongoosedb";
const bodyParser = require('body-parser');  
// const urlencodedParser = bodyParser.urlencoded({ extended: false }) 
const jsonParser = bodyParser.json({ extended: false })
const cors = require('cors');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

const port = 80;

app.use(cors());

app.use('/', express.static('public')); 



app.get('/budget', (req, res) => {
    console.log("fetching budget...")
    mongoose.connect(url)
        .then(() => {
            console.log("Connected to Database")
            dataModel.find({})
                     .then((data) => {
                        console.log(data)
                        res.json(data);
                        mongoose.connection.close()
                        
                     })
                     .catch((connectionError) => {
                        console.log(connectionError)
                   })

        })
        .catch((connectionError) => {
            console.log(connectionError)
        })
    
});



app.listen(port, () => {
    console.log(`API served at http://localhost:${port}`);
});