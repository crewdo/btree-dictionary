const dictionary = require('../lib/ramcache');

/**
 * Search word by Ajax
 *
 * @param  req
 * @param  res
 * @return Word's definition.
 */
exports.search = function (req, res) {
    let matchWord = req.body.word || {};
    let word = matchWord.replace(/\W*\d*/g, '_');

    let dict = dictionary.get('dict') || {};
    let defPattern = 'dict.' + word.split('').join('.') + '.def';
    let def = eval(defPattern);

    //TODO: Extend autocomplete if needed: Get value as Node, then send the node's leaf

    res.send(def);
};