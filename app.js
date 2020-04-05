const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


const apiRoutes = require('./api/routes/api');

const connectWithRetry = () => {mongoose.connect('mongodb+srv://root:zxcasd123@cluster0-slizn.mongodb.net/test?retryWrites=true&w=majority', { 
    useUnifiedTopology: true, 
    useNewUrlParser: true
},err => {
    if(err){
        setTimeout(connectWithRetry,5000);
    }else{
        console.log("Mongo Connected")
    }
}); }

connectWithRetry()
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
// CORS Handelling
app.use((req, res,next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Origin', 'Origin. X-Requseted-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allw-Mehtods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next(); 
});
app.use('/', apiRoutes);


app.use((req, res, next) => {
   const error = new Error('Not Found');
   error.status = 404;
   next(error); 
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
});

app.use(express.static('public'));
app.set('view engine', 'ejs');


module.exports = app;