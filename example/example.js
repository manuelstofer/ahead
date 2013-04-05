var ahead = require('./../index');

// Ahead is a easy way to create a promise
//  - kept to keep a promise
//  - broken to break a promise
var random = ahead(function (delay, kept, broken) {
    setTimeout(function () {
        kept(Math.random());
    }, delay);
});

// Functions created with ahead can take promises as arguments
// the execution gets deferred until all promised arguments are resolved
var multiply = ahead(function (a, b, keep) {
    keep(a * b);
});

// Ahead.shift converts a synchronous function
// (shifts it in time ahead)
var pow = ahead.shift(function (a, b) {
    return Math.pow(a, b);
});

// lets shift console.log in time ahead
var log = ahead.shift(console.log.bind(console));

// thrown errors will break the promise
var fail = ahead.shift(function () {
    throw Error("break everything");
});

// All the above created functions can be used in a
// synchronous style but are executed asynchronous
log(pow(multiply(random(1000), 3), 2));


// The returned value of each function created with
// ahead or ahead.shift is a promise for a future value
fail(random(1000), 3).then(
    function success (value) {
    },
    function fail (reason) {
    }
);

