const dictionary = require('../lib/ramcache');

/**
 * Search word by Ajax
 *
 * @param  req
 * @param  res
 * @return Word's definition.
 */
exports.search = function (req, res) {

    const word = req.body.word || {};
    word.replace(/\W*\d*/g, '');

    let dict = dictionary.get('dict') || {};
    let defPattern = 'dict.' + word.split('').join('.') + '.def';
    let def = eval(defPattern);

    //TODO: Extend autocomplete if needed: Get value as Node, then send the node's leaf

    res.send(def);
};