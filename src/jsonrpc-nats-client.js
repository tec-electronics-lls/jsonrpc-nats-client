const NATS = require('nats');

var JsonRPCNatsClient = function(options, channel, errors) {
    if (typeof(options) === 'string') {
        options.url = options;
    }
    this._channel = channel;

    this._nats = NATS.connect(options);

    errors = errors || {};

    this._errors = {
        SERVER_ERROR: errors.SERVER_ERROR || {
            code: -32000,
            message: 'SERVER_ERROR'
        },
        PARSE_ERROR: errors.PARSE_ERROR || {
            code: -32700,
            message: 'PARSE_ERROR'
        }
    }
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

    this._nats.request(this._channel, JSON.stringify(req), {max: 1}, (content)=>{
        try {
            content = JSON.parse(content);
        } catch (e) {
            console.log(e);
            callback(Object.assign({ data: content }, this._errors.PARSE_ERROR));
            return;
        }
    
        if (!content.jsonrpc || content.jsonrpc !== '2.0') {
            callback(Object.assign({ data: JSON.stringify(content) }, this._errors.SERVER_ERROR));
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