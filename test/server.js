const Hapi = require('@hapi/hapi')
const Lab = require('@hapi/lab')
const { expect } = require('@hapi/code')
const lab = (exports.lab = Lab.script())

lab.experiment('Hapi Maxmind web client tests', () => {
  let server
  lab.beforeEach(() => {
    server = Hapi.Server()
  })

  lab.test('should reject invalid options', async () => {
    try {
      await server.register({
        plugin: require('../'),
        options: {
          some: 'value'
        }
      })
    } catch (err) {
      expect(err).to.exist()
    }
  })

  lab.test('should reject invalid maxmind webservice userID', async () => {
    try {
      await server.register({
        plugin: require('../'),
        options: {
          userId: 'test_user'
        }
      })
    } catch (err) {
      expect(err).to.exist()
    }
  })

  lab.test('should reject invalid maxmind webservice license', async () => {
    try {
      await server.register({
        plugin: require('../'),
        options: {
          licenseKey: '?*-badkey'
        }
      })
    } catch (err) {
      expect(err).to.exist()
    }
  })

  lab.test('should register with proper plugin options', async () => {
    await server.register({
      plugin: require('../'),
      options: {
        userId: '12345',
        licenseKey: 'demo',
        decorate: 'my-maxmind'
      }
    })
  })

  lab.test('should register without specifying decorate string ', async () => {
    await server.register({
      plugin: require('../'),
      options: {
        userId: '12345',
        licenseKey: 'demo'
      }
    })
    server.route({
      method: 'GET',
      path: '/',
      handler (request) {
        expect(request.maxmind.lib).to.exist()
        expect(request.maxmind.client).to.exist()
        return Promise.resolve(null)
      }
    })
    await server.inject({
      method: 'GET',
      url: '/'
    })
  })

  lab.test('should log successful registration information', async () => {
    let logEntry
    server.events.once('log', entry => {
      logEntry = entry
    })

    await server.register({
      plugin: require('../'),
      options: {
        userId: '12345',
        licenseKey: 'demo'
      }
    })

    expect(logEntry).to.equal({
      channel: 'app',
      timestamp: logEntry.timestamp,
      tags: ['hapi-maxmind-web', 'info'],
      data: 'registered plugin hapi-maxmind-web successfully'
    })
  })
})
