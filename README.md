# prerender-seo

Prerender HTML files using [Puppeteer](https://github.com/GoogleChrome/puppeteer).

## Install

```bash
npm i prerender-seo -D
```

## Usage

``` js
const path = require('path')
const prerender = require('prerender-seo')

const files = [
  '/index.html'
]

prerender(
  path.resolve(__dirname, './dist'),
  files,
  {
    // options
  }
)
```

## Test

The test case use a [vue-cli](https://github.com/vuejs/vue-cli) generated project

``` bash
npm run test
```

## Options

|Name|Type|Default|Description|
|:--:|:--:|:-----:|:----------|
|**`sourceDir`**|`{String}`|`-`|Source directory of static files|
|**`files`**|`{Array}`|`-`|HTML Files to prerender|
|**`options.destDir`**|`{String}`|`*_prerender`|Destination directory to store the result|
|**`options.proxyTable`**|`{Array}`|`[]`|Proxy to forward any http request that match the config|
|**`options.navigationTimeout`**|`{Number}`|`30000`|Define the timeout of any navigation operations|
|**`options.resourceInterception`**|`{Array}`|`[]`|Define the regular expression of any resource will be aborted|

### `sourceDir`

```js
prerender(
  path.resolve(__dirname, '../dist')
)
```

### `files`

```js
prerender(
  files: [
    'index.html',
    'about.html',
    'product.html'
  ]
)

```
### `options.destDir`

Define the destination directory. If you want to replace the source directory, just set the same path as `sourceDir`.

```js
prerender(
  path.resolve(__dirname, '../dist'),
  files: [
    'index.html',
    'about.html',
    'product.html'
  ],
  {
    destDir: path.resolve(__dirname, '../dist')
  }
)
```

### `options.proxyTable`

```js
prerender(
  path.resolve(__dirname, '../dist'),
  files: [
    'index.html',
    'about.html',
    'product.html'
  ],
  {
    proxyTable: {
      context: '/api',
      proxy: {
        host: 'example.com',
        port: '80',
        protocol: 'http'
      }
    }
  }
)
```


### `options.navigationTimeout`

 Define the timeout after which any navigation operations will stop trying. (in milli-secs)

```js
prerender(
  path.resolve(__dirname, '../dist'),
  files: [
    'index.html',
    'about.html',
    'product.html'
  ],
  {
    navigationTimeout: 60000
  }
)
```

### `options.resourceInterception`

Define the regular expression to match any resource url will be aborted before request. The left hand in the array is `RegExp` pattern, the right hand is `RegExp` flag.

```js
prerender(
  path.resolve(__dirname, '../dist'),
  files: [
    'index.html',
    'about.html',
    'product.html'
  ],
  {
    resourceInterception: [
      ['hm.baidu.com', 'g'],
      ['/api/tokenAttach', 'g']
    ]
  }
)
```
