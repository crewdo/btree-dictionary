const async = require('async');
const fs = require('fs');
const xml2js = require('xml2js');
const config = require('../lib/config');


exports.initialize = function (req, res) {

    async.waterfall([
            convert,
            buildTree,
            saveTree],
        function (err, result) {
            if (err) {
                // console.log(err);
            }
            return res.render('upload', {result});
        });
};

function convert(callback) {
    var parser = new xml2js.Parser();
    fs.readFile('./xml/' + config.get('newest'), function (err, data) {
        parser.parseString(data, function (err, result) {
            callback(null, result.dictionary.record);
        });
    });
}

function buildTree(converted, callback) {
    //TODO: Build Tree here
    var bTree = {};
    converted.map(function (v,i,a) {
        words = a[i].word[0];
        for(var t = 0;  t < words.length; t++){
            var cur = 'bTree.' + words.substring(0,t+1).split('').join('.');
            var pre = cur.slice(0,-2);
            var k = words[t];
            if(!pre.hasOwnProperty(k)){
                eval(cur + '= {' + k + ':k}');
            }
        }
    });

    callback(null, bTree);
}

function saveTree(bTree, callback) {
    const content = JSON.stringify(bTree);
    // writeStream.on('finish', function () {
    // });

    // fs.writeFile(__dirname + "/../json/btree/converted.json", content,'utf8', function (err) {
    //     if (err) {
    //         return callback(err, 'The file could not be saved!');
    //     }
    // var writeStream = fs.createWriteStream(__dirname + "/../json/btree/converted.json");
    // writeStream.write(content, 'utf8');
    callback(null, content);

    // });
}

//`chay for lay 1 tu, trong 1 tu for tung chu. kiem tra key cua object[chu]. neu !=null thi continue, = null thi lay index cua chu~: chay tu cuoi tu den index, tao object moi. roi add vao object root.`