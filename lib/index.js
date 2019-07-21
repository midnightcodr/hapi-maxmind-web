const Joi = require('@hapi/joi')
const WebServiceClient = require('@maxmind/geoip2-node').WebServiceClient

const scheme = Joi.object({
  userId: Joi.string()
    .regex(/^\d+$/)
    .required(),
  licenseKey: Joi.string()
    .token()
    .required(),
  decorate: Joi.string().default('maxmind')
})

const register = async (server, pluginOptions) => {
  const options = await scheme.validate(pluginOptions)
  const { userId, licenseKey, decorate } = options
  const client = new WebServiceClient(userId, licenseKey)
  const expose = {
    lib: WebServiceClient,
    client
  }
  server.decorate('server', decorate, expose)
  server.decorate('request', decorate, expose)
  server.log(
    ['hapi-maxmind-web', 'info'],
    `registered plugin hapi-maxmind-web successfully`
  )
}

exports.plugin = {
  register,
  pkg: require('../package.json')
}
