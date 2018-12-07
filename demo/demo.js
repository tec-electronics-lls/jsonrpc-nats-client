const JsonRPCClientNats = require('../src/jsonrpc-client-nats');

let client = new JsonRPCClientNats('nats://127.0.0.1:4222', 'test');

client.request('Ping', (err, result) => {
    console.log(err, result);
});

client.request('Hello', 'Roman', (err, result) => {
    console.log(err, result);
});



client.request('ItIsNotWork', (err, result) => {
    console.log(err, result);
});