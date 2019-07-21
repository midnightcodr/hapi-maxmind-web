### About
This is a [Hapijs](https://hapijs.com/) plugin for [MaxMind GeoIP2 Web Service](https://maxmind.github.io/GeoIP2-node/).


### Options

- `decorate`: a string, defaults to `maxmind` if not specified. This is the identifier in hapi's `server.decorate()` call when registering the plugin. Once specified, you can reference the following attributes:
    - request.`decorate_string`.client
    - request.`decorate_string`.lib
    - server.`decorate_string`.client
    - server.`decorate_string`.lib

    where lib is exposed through the plugin (`require('@maxmind/geoip2-node').WebServiceClient`)

- `userId`: a numeric string, your maxmind userId
- `licenseKey`: a token string, your maxmind licenseKey

### Example

See [example.js](example.js) for example.

### Other thoughts
I would suggest that [caching](https://hapijs.com/tutorials/caching?lang=en_US) is enabled for the query results from using this plugin because Maxmind bills by the number of queries - regardless if you query for the same IPs or not. Based on the information from a support representative from Maxmind, they update their databases weekly on Tuesdays, so it makes sense to cache the results for a duration that works for you.