const Hapi = require('@hapi/hapi')
const server = Hapi.Server({
  port: 4000
})

const main = async () => {
  server.route({
    path: '/geo/{ip}',
    method: 'GET',
    async handler (request) {
      const { ip } = request.params
      console.log(`looking up for ${ip}`)
      const res = await request.maxmind.client.insights(ip)
      return res
    }
  })
  await server.register({
    plugin: require('./lib'),
    options: {
      userId: '<YOUR_MAXMIND_USERID>',
      licenseKey: '<YOUR_MAXMIND_LICENSEKEY>'
    }
  })

  server.start()
}

main()
