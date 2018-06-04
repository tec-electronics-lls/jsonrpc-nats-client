const NATS = require('nats'),
    errors = require('jsonrpc-errors');

var JsonRPCNatsClient = function(options, channel, timeout) {
    this._timeout = timeout || 1000;
    if (typeof(options) === 'string') {
        options = {
            url: options
        };
    }

    this._channel = channel;

    this._nats = NATS.connect(options);

    this._nats.on('error', (e)=>{
        console.log(Object.assign(errors.INTERNAL_ERROR, {data: e.message}));
    });
}

JsonRPCNatsClient.prototype.request = function(method, params, callback) {
    if (typeof(params) === 'function') {
        callback = params;
        params = {};
    }

    params = params || {};

    let req = {
        jsonrpc: '2.0',
        id: Math.floor(Math.random() * 1000),
        method: method,
        params: params
    }

    this._nats.requestOne(this._channel, JSON.stringify(req), {}, this._timeout, (content)=>{
        if(content instanceof NATS.NatsError && content.code === NATS.REQ_TIMEOUT) {
            callback(Object.assign(errors.INTERNAL_ERROR, { data: 'Timeout' }));
            return;
        }
        
        try {
            content = JSON.parse(content);
        } catch (e) {
            console.log(e);
            callback(Object.assign(errors.PARSE_ERROR, { data: content }));
            return;
        }
    
        if (!content.jsonrpc || content.jsonrpc !== '2.0') {
            callback(Object.assign(errors.INVALID_REQUEST, { data: JSON.stringify(content) }));
            return;
        }
    
        if (content.error) {
            callback(content.error);
            return;
        }
    
        callback(undefined, content.result);
    })
}

module.exports = JsonRPCNatsClient;