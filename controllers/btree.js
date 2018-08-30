const async = require('async');
const fs = require('fs');
const xml2js = require('xml2js');
const config = require('../lib/ramcache');

/**
 * Initialize the Dictionary on RAM
 * Using async waterfall
 *
 * @return object Btree
 */

exports.initialize = function (req, res) {

    async.waterfall([
            convert,
            buildTree,
            saveTree
        ],
        function (err, result) {
            if (err) {
                console.log(err);
            }
            return res.render('upload', {result});
        });
};

/**
 * Convert the xml file to json
 *
 * @param  callback
 * @return callback with object json from xml
 */

function convert(callback) {
    let parser = new xml2js.Parser();
    fs.readFile('./xml/' + config.get('newest'), function (err, data) {
        parser.parseString(data, function (err, result) {
            callback(null, result.dictionary.record);
        });
    });
}

/**
 * Build Btree from json. (Main function)
 *
 * @param  converted
 * @param  callback
 * @return callback with object Btree
 */

function buildTree(converted, callback) {
    let bTree = {};
    converted.map(function (v, i, a) {
        words = handleString(a[i].word[0]);
        //word = "hello"
        for (let t = 0; t < words.length; t++) {
            let leaf = 'bTree.' + words.substring(0, t + 1).split('').join('.');
            //leaf = bTree.h.e.l.l.o
            let node = eval(leaf.slice(0, -2));
            //node = bTree.h.e.l.l
            if (!node.hasOwnProperty(words[t])) {
                let tail = buildTail(words, {def: a[i].meaning[0]}, t);
                eval(leaf + '=' + JSON.stringify(tail));
                break
                //result: bTree.h.e.l.l.o = {def: 'Xin chao'}
            }
        }
    });

    callback(null, bTree);
}

/**
 * Convert string for easy to build Tree
 *
 * @param  stringRaw
 * @return string
 */
function handleString(stringRaw) {
    return stringRaw
        .replace(/\s\W\s/g, '_')
        .replace(/\W*\d*/g, '')
        .replace(' ', '_')
        .toLowerCase();
}

/**
 * Export convert string function
 *
 * @return handleString function
 */
exports.convertString = function (stringRaw) {
    return handleString(stringRaw);
};

/**
 * Build the tail object of word as Btree
 *
 * @param  words
 * @param  tail
 * @param  index
 * @return object tail
 */
function buildTail(words, tail, index) {
    for (let j = words.length - 1; j > index; j--) {
        if (typeof words[j] === 'undefined') {
            continue;
        }
        eval('tail = {' + words[j] + ': tail}');
    }
    return tail;
}


/**
 * Convert the xml file to json
 *
 * @param  bTree
 * @param  callback
 * @return callback bTree saved
 */

function saveTree(bTree, callback) {
    //TODO: Extend if needed: save Btree to file here.
    //Export bTree on RAM to use.
    config.set('dict', bTree);
    callback(null, 'Dictionary was built and export to memory');
}
