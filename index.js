const express = require('express');
const app = express();
const dotnev = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const router = require('./routes/router');

// config
dotnev.config();

// middlewares
app.use(express.json());
app.use(cors());
app.use('/uploads',express.static('uploads'));

//routes
app.use('/api/v1',router);

// db connexion
mongoose.connect(process.env.DB_URL,{ useNewUrlParser:true, useUnifiedTopology: true }, (error) => {
    if(!error){
        console.log('db connected');
    }else{
        console.log(error);
    }
});

// lunch app
app.listen(process.env.PORT,() => {
    console.log(`app started on port ${process.env.PORT}`);    
});