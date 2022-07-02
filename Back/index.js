require('dotenv').config();
const PORT = process.env.PORT || 5050;
const express = require('express');
const router = require('./app/router');
const app = express();
const cors = require ('cors');


app.set('views', './views');
app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(express.json())

app.use(express.urlencoded({
    extended: true
}));

app.use(cors({
    origin: "*"
}))

app.use(router);

app.listen(PORT);