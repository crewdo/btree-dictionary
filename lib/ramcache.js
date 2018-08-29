var overrides = {};
exports.set = function (key, val) {
    return overrides[key] = val;
};

exports.get = function (key) {
    if (overrides[key]) {
        return overrides[key];
    }
    else {
        return false;
    }
};