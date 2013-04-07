# Ahead

An experiment with [promises](http://wiki.commonjs.org/wiki/Promises/A)

## Some examples

@see example/example.js

```Javascript
var ahead = require('ahead');
```

Ahead provides a easy way to create promises. And lets you write
asynchronous stuff that looks synchronous. Its thought as an experiment
and not for real use. Error handling can get pretty confusing.



It adds two arguments to a function.

- kept to keep the promise
- broken to break the promise

```Javascript
var random = ahead(function (delay, kept, broken) {
    setTimeout(function () {
        kept(Math.random());
    }, delay);
});

var r = random(10);  // creates a promise for a random number
r.then(function (number) { console.log(number);});
```

Functions created with ahead can take promises as arguments
the execution gets deferred until all promised arguments are resolved

```Javascript
var multiply = ahead(function (a, b, kept) {
    kept(a * b);
});

multiply(random(10), 3); // just looks synchronous
```

Ahead.shift converts a synchronous function (shifts it in time ahead).

```Javascript
var pow = ahead.shift(Math.pow);
```

Lets shift console.log in time ahead

```Javascript
var log = ahead.shift(console.log.bind(console));
```

Thrown errors will break the promise

```Javascript
var fail = ahead.shift(function () {
    throw Error("break everything");
});
```

All the above created functions can be used in a
synchronous style but are executed asynchronous

```Javascript
log(pow(multiply(random(1000), 3), 2));
```


The returned value of each function created with
ahead or ahead.shift is a promise for a future value

```Javascript
fail(random(1000), 3).then(
    function success (value) {
    },
    function fail (reason) {
    }
);
```

