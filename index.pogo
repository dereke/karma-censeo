censeo  = require 'censeo'
getPort = require 'get-port'

karmaStart(webServer)=
  port = getPort!(^)
  censeo.server(port)
  console.log("Censeo running on port:", port)
  webServer.on 'request' @(req, res)
    if (req.url == '/censeo')
      res.writeHead(200, {"Content-Type" = "text/plain"})
      res.write(port.toString())
      res.end()

karmaStart.$inject = ['webServer']

clientCache = nil

module.exports = {
  'framework:censeo' = [ 'factory', karmaStart]
  client()=
    if (clientCache)
      clientCache
    else
      request = require 'reqwest'
      censeoPort = request!({url = '/censeo'})                                                                                              
      console.log("Client configured to use censeo on port #(censeoPort)")
      clientCache := censeo.client!(censeoPort)
}
