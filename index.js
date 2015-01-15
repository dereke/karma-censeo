(function() {
    var Promise = require("bluebird");
    var gen1_promisify = function(fn) {
        return new Promise(function(onFulfilled, onRejected) {
            fn(function(error, result) {
                if (error) {
                    onRejected(error);
                } else {
                    onFulfilled(result);
                }
            });
        });
    };
    var self = this;
    var censeo, getPort, karmaStart, clientCache;
    censeo = require("censeo");
    getPort = require("get-port");
    karmaStart = function(webServer) {
        var gen2_asyncResult, port;
        return new Promise(function(gen3_onFulfilled) {
            gen3_onFulfilled(gen1_promisify(function(gen4_callback) {
                return getPort(gen4_callback);
            }).then(function(gen2_asyncResult) {
                port = gen2_asyncResult;
                censeo.server(port);
                console.log("Censeo running on port:", port);
                return webServer.on("request", function(req, res) {
                    if (req.url === "/censeo") {
                        res.writeHead(200, {
                            "Content-Type": "text/plain"
                        });
                        res.write(port.toString());
                        return res.end();
                    }
                });
            }));
        });
    };
    karmaStart.$inject = [ "webServer" ];
    clientCache = void 0;
    module.exports = {
        "framework:censeo": [ "factory", karmaStart ],
        client: function() {
            var self = this;
            var gen5_asyncResult, request, censeoPort;
            return new Promise(function(gen3_onFulfilled) {
                gen3_onFulfilled(Promise.resolve(function() {
                    if (clientCache) {
                        return clientCache;
                    } else {
                        return new Promise(function(gen3_onFulfilled) {
                            request = require("reqwest");
                            gen3_onFulfilled(Promise.resolve(request({
                                url: "/censeo"
                            })).then(function(gen6_asyncResult) {
                                censeoPort = gen6_asyncResult;
                                console.log("Client configured to use censeo on port " + censeoPort);
                                return Promise.resolve(censeo.client(censeoPort)).then(function(gen7_asyncResult) {
                                    return clientCache = gen7_asyncResult;
                                });
                            }));
                        });
                    }
                }()));
            });
        }
    };
}).call(this);