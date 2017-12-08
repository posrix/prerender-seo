const path = require('path')
const prerenderSEO = require('../lib')

prerenderSEO(
  path.resolve(__dirname, './dist'),
  '#app',
  ['/index.html']
)
