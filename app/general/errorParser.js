var _ = require('lodash');

/**
 * Error parsing module for parsing server side error objects into a format the client side can display.
 *
 * Use getMessages to obtain an object of error codes and messages to send to client. When using getMessages,
 * one must specify which error codes they want to check against since it doesn't make sense to check against all of them each time.
 *
 * You can also use addMessage to add a message to an object by specifying an error code. This allows clients of this module
 * to define custom error parsers.
 *
 */

/**
 *
 * @param path (String)
 * @param type (String)
 * @param err
 * @returns {boolean}
 */

var checkError = function (path, type, err) {
    //handles native mongo errors for unique check
    if (err.name === 'MongoError' && type === 'unique') {
        if ((err.code === 11000 || err.code === 11001) && typeof err.err === 'string') {
            return err.err.indexOf(path) !== -1;
        }
        return false;
    } else if (err.name === 'ValidationError') {
        //Mongoose validation errors can produces multiple errors arranged in err.errors in an object with the
        //path as the key.
        return !!err.errors[path] && err.errors[path].type === type;
    }
    return false;
};

var errorCodes = {
    pd1000: {
        check: checkError.bind(null, 'data.userId', 'unique'),
        message: 'This username is unavailable.'
    },
//    pd1001: {
//        check: checkError.bind(null, 'data.userId', 'required'),
//        message: 'Username is required'
//    },
    pd1100: {
        check: checkError.bind(null, 'data.email', 'unique'),
        message: 'This email is already in use.'
    }
//    pd1101: {
//        check: checkError.bind(null, 'data.email', 'required'),
//        message: 'Email is required'
//    }
};


/**
 *
 * @param dest (object)
 * @param code (string) string code for the error message to ade
 * @returns {*} dest or new object with codes
 */
module.exports.addError = function (code, dest) {
    dest = dest || {};
    if (typeof code === 'string' && errorCodes[code]) {
        dest[code] = errorCodes[code].message
    }
    return dest;
};

/**
 *
 * @param codes (Array) - array of strings matching error codes that an error object should be checked against
 * @param err (err object) - object to run errors against
 * @param dest (Object, optional)
 * @returns {{}|*}
 */
var parse = function (codes, err, dest) {
    dest = dest || {};
    if (Array.isArray(codes) && codes.length !== 0) {
        codes.forEach(function (val, index, self) {
            if (errorCodes[val] && errorCodes[val].check(err)) {
                dest[val] = errorCodes[val].message;
            }
        })
    }
    return _.isEmpty(dest) ? undefined : dest;
};

module.exports.parse = parse;

module.exports.handle = function (req, res, next, codes, err) {
    var errors = parse(codes, err);
    if(errors){
        res.send(400, errors);
    }else {
        next(err);
    }
};