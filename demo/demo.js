const JRPCNatsClient = require('../src/jsonrpc-nats-client');

let client = new JRPCNatsClient('nats://192.168.100.10:4222', 'test');

client.request('Hello', {
    title: 'Roman'
}, (err, result) => {
    console.log(err, result);
});

client.request('Ping', {
    title: 'Roman'
}, (err, result) => {
    console.log(err, result);
});

client.request('Test', {
    title: 'Roman'
}, (err, result) => {
    console.log(err, result);
});