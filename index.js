'use strict';

var Promise     = require('promise'),
    isPromise   = require('is-promise');

module.exports = future;

future.shift = shift;

/**
 * Creates a function that returns a promise and executes only
 * after all promised arguments are resolved.
 *
 * @param fn
 * @returns {Function}
 */
function future (fn) {
    return function () {
        var args = [].slice.call(arguments);

        return new Promise(function (kept, broken) {

            join(args).then(
                function (args) {
                    args.push(kept);
                    args.push(broken);
                    fn.apply(null, args);
                },
                broken
            );
        });
    };
}

/**
 * Converts a synchronous function to work with promises
 *
 * @param fn
 * @returns {Function}
 */
function shift (fn) {
    return future(function () {
        var args = [].slice.call(arguments),
            broken = args.pop(),
            kept = args.pop();
        try {
            kept(fn.apply(null, args));
        } catch (reason) {
            broken(reason);
        }
    });
}

/**
 * Recursive resolves a promise util its a value
 *
 * @param promise
 * @param kept
 * @param broken
 */
function resolvePromise(promise, kept, broken) {
    if (!isPromise(promise)) {
        kept(promise);
    } else {
        promise.then(
            function (value) {
                resolvePromise(value, kept, broken);
            },
            function (value) {
                resolvePromise(value, broken, broken);
            }
        );
    }
}

/**
 * Joins promises together to one promise
 *
 * @param promises
 * @returns {Promise}
 */
function join (promises) {

    var toResolve = promises.length,
        resolved = [];

    return new Promise(function (kept, broken) {

        var check = function () {
            if (toResolve === 0) {
                kept(resolved);
            }
        };

        promises.forEach(function (value, index) {
            var resolve = function (value) {
                toResolve--;
                resolved[index] = value;
                check();
            };
            resolvePromise(value, resolve, broken);
        });

        check();
    });
}

