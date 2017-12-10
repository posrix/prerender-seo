const { join, parse } = require('path')
const { existsSync, writeFile } = require('fs')
const mkdirp = require('mkdirp')
const ora = require('ora')
const phantom = require('phantomjs-prebuilt')
const { execFile } = require('child_process')
const { minify } = require('html-minifier')
const serverSetup = require('./serverSetup')

module.exports = (
  sourceDir,
  mountNode,
  files,
  {
    destDir = `${sourceDir}_prerender`,
    proxyTable = [],
    ignoreError = false,
    resourceTimeout = 15000,
    resourceIntercept = [],
    XSSAuditingEnabled = false
  } = {}
) => {
  serverSetup(sourceDir, proxyTable)
    .then(({ server, port }) => {
      Promise.all(
        files.map(
          file =>
            new Promise((resolve, reject) => {
              const oraTemplate = status =>
                status
                  ? `Prerendering ${file} [${status}]`
                  : 'Prerendering Files'

              const spinner = ora(oraTemplate()).start()

              execFile(
                phantom.path,
                [
                  join(__dirname, 'phantomRender.js'),
                  `http://localhost:${port}${file}`,
                  JSON.stringify({
                    mountNode,
                    ignoreError,
                    XSSAuditingEnabled,
                    resourceTimeout,
                    resourceIntercept
                  })
                ],
                { maxBuffer: 1048576 },
                (error, stdout, stderr) => {
                  if (error || stderr) {
                    spinner.fail(oraTemplate('Failed'))
                    if (error) throw stdout
                    if (stderr) throw stderr
                  } else {
                    const { base, dir } = parse(file)
                    const destFileDir = join(destDir, dir)

                    !existsSync(destFileDir) && mkdirp.sync(destFileDir)
                    writeFile(
                      join(destFileDir, base),
                      minify(stdout, {
                        collapseWhitespace: true,
                        removeComments: true
                      }),
                      error => {
                        if (error) {
                          spinner.fail(oraTemplate('Failed'))
                          return reject(
                            'Could not write file: ' + file + '\n' + error
                          )
                        }
                        spinner.succeed(oraTemplate('Successful'))
                        resolve()
                      }
                    )
                  }
                }
              )
            })
        )
      )
        .then(() => {
          server.stop()
        })
        .catch(error => {
          setTimeout(() => {
            throw error
          })
        })
    })
    .catch(error => {
      setTimeout(() => {
        throw error
      })
    })
}
