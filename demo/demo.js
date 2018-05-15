const JRPCNatsClient = require('../src/jsonrpc-nats-client');

let client = new JRPCNatsClient('nats://192.168.100.3:4222', 'Test');

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