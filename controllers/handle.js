const async = require('async');

exports.search = function (req,res) {
    const word = req.body.word || {};
    res.send(word);

};