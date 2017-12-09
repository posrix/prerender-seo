var system = require('system')
var page = require('webpage').create()

var url = system.args[1]
var options = JSON.parse(system.args[2])

page.settings.loadImages = false
page.settings.localToRemoteUrlAccessEnabled = true
page.settings.resourceTimeout = options.resourceTimeout
page.settings.XSSAuditingEnabled = options.XSSAuditingEnabled

page.onInitialized = function() {
  page.injectJs(page.libraryPath + '/../../core-js/client/core.js')
}

page.onResourceRequested = function(requestData, networkRequest) {
  options.resourceIntercept.forEach(function(regexp) {
    requestData.url.match(new RegExp(regexp[0]), regexp[1]) && networkRequest.abort()
  })
}

page.onResourceTimeout = function(req) {
  if (options.ignoreError) return
  console.error('Resource timeout: ' + req.url)
  phantom.exit(1)
}

page.onError = function(message, trace) {
  if (options.ignoreError) return
  var pathname = url.replace(/http:\/\/localhost:\d+/, '')
  console.error(
    'Error occurred while prerendering: ' + pathname + '\n' + message
  )
  phantom.exit(1)
}

page.open(url, function(status) {
  if (status !== 'success') {
    throw new Error('FAIL to load: ' + url)
  } else {
    var html = page.evaluate(function(mountNode) {
      var $mountNode = document.querySelector(mountNode)
      $mountNode.setAttribute('style', 'display: none')

      var doctype = new window.XMLSerializer().serializeToString(
        document.doctype
      )
      var outerHTML = document.documentElement.outerHTML
      return doctype + outerHTML
    }, options.mountNode)
    console.log(html)
    phantom.exit()
  }
})
