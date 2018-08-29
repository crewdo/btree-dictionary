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
    var parser = new xml2js.Parser();
    fs.readFile('./xml/' + config.get('newest'), function (err, data) {
        parser.parseString(data, function (err, result) {
            callback(null, result.dictionary.record);
        });
    });
}

/**
 * Build Btree from json
 *
 * @param  converted
 * @param  callback
 * @return callback with object Btree
 */

function buildTree(converted, callback) {
    let bTree = {};
    converted.map(function (v, i, a) {
        words = a[i].word[0]
            .replace(/\W*\d*(logic học)*/g, '');
        for (let t = 0; t < words.length; t++) {
            //Get leaf to check.
            let leaf = 'bTree.' + words.substring(0, t + 1).split('').join('.');
            //Get node of current leaf.
            let node = eval(leaf.slice(0, -2));
            //If node don't have leaf, insert tail to leaf.
            if (!node.hasOwnProperty(words[t])) {
                let tail = {def: a[i].meaning[0]};
                for (let j = words.length - 1; j > t; j--) {
                    if (typeof words[j] === 'undefined') {
                        continue;
                    }
                    eval('tail = {' + words[j] + ': tail}');
                }
                eval(leaf + '=' + JSON.stringify(tail));
                break;
            }
        }
    });

    callback(null, bTree);
}

/**
 * Build Leaf item when Tree node don't have current leaf
 *
 * @param  words
 * @param tail
 * @param index
 * @return callback with object json from xml
 */
//
// function buildLast(words, tail, index) {
//
// }

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
    callback(null, 'Dictionary was built and export to RAM');
}
