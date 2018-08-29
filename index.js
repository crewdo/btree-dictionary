const btree = require('./controllers/btree');
const handle = require('./controllers/handle');
const path = require('path');
var bodyParser = require('body-parser');
var multer = require('multer');
var config = require('./lib/ramcache');
var express = require('express');

var app = express();

app.listen(3000);
app.use(express.static(path.join(__dirname, 'client')));
var parseForm = bodyParser.urlencoded({
    extended: false,
    limit: '200mb',
});
app.set('view engine', 'ejs');
app.set('views', './views');

//Init save xml
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './xml');
    },
    filename: function (req, file, cb) {
        config.set('newest', file.originalname);
        cb(null, file.originalname);
    },
});
var upload = multer({storage});

//Main routes
app.get("/", function (req, res) {
    res.render('home');
});

app.get("/upload", function (req, res) {
    res.render('upload');
});
app.post("/upload", upload.single('dictionary'), btree.initialize);
app.post('/', parseForm, handle.search);