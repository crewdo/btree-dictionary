const btree = require('./controllers/btree');
const handle = require('./controllers/handle');
const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer');
const config = require('./lib/ramcache');
const express = require('express');

let app = express();

app.listen(80);
app.use(express.static(path.join(__dirname, 'client')));
let parseForm = bodyParser.urlencoded({
    extended: false,
    limit: '200mb',
});
app.set('view engine', 'ejs');
app.set('views', './views');

//Init save xml
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './xml');
    },
    filename: function (req, file, cb) {
        config.set('newest', file.originalname);
        cb(null, file.originalname);
    },
});
let upload = multer({storage});

//Main routes
app.get("/", function (req, res) {
    res.render('home');
});

app.get("/upload", function (req, res) {
    res.render('upload');
});
app.post("/upload", upload.single('dictionary'), btree.initialize);
app.post('/', parseForm, handle.search);