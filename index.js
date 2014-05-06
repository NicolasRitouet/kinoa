var deployd = require('deployd'),
    os = require('os');

var server = deployd({
    port: process.env.PORT || 3000,
    env: 'staging',
    db: {
        host: 'localhost',
        port: 27017,
        name: 'kinoa'
    }
});

server.listen();
console.log('Express server listening on http://' + os.hostname() + ":" + server.options.port + " with DB " + server.options.db.host + "/" + server.options.db.name);


server.on('error', function (err) {
    console.error(err);
    process.nextTick(function () { // Give the server a chance to return an error
        process.exit();
    });
});
