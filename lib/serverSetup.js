const hapi = require('hapi')
const inert = require('inert')
const h2o2 = require('h2o2')
const portfinder = require('portfinder')

module.exports = (sourceDir, proxyTable) =>
  new Promise((resolve, reject) => {
    portfinder
      .getPortPromise()
      .then(port => {
        const server = new hapi.Server({
          connections: {
            routes: {
              files: {
                relativeTo: sourceDir
              }
            }
          }
        })

        server.connection({ port })

        server.register([inert, h2o2], error => {
          if (error) return reject(error)

          server.route({
            method: 'GET',
            path: '/{param*}',
            handler: {
              directory: {
                path: '.',
                redirectToSlash: true,
                index: true
              }
            }
          })

          proxyTable.forEach(config => {
            const { context, proxy } = config
            server.route({
              method: ['PUT', 'GET', 'POST', 'DELETE'],
              path: `${context}/{param*}`,
              handler: {
                proxy
              }
            })
          })

          server.start(error => {
            if (error) return reject(error)
            resolve({ server, port })
          })
        })
      })
      .catch(error => {
        reject(error)
      })
  })
