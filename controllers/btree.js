const async = require('async');

exports.initialize = function (req, res) {
    async.waterfall([
        buildTree(err),
        saveTree(),
        function () {

        }
    ]);
};

function buildTree() {

}

function saveTree() {

}

