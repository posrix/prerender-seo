# prerender-seo

Prerender HTML files using [PhantomJS](http://phantomjs.org). Let search engine crawlers capture the right content, not just `<div id="app"></div>` stuff. The Most common user scenario are [React](https://reactjs.org/) and [Vue](https://vuejs.org/) rendered page.

<img src="https://github.com/posrix/portrayal/blob/master/prerender-seo/example.gif" width="500"/>

## Install

```bash
npm install prerender-seo --save-dev
```

## Usage

``` js
const path = require('path')
const prerenderSEO = require('../lib')

const files = [
  '/index.html'
]

prerenderSEO(
  path.resolve(__dirname, './dist'),
  '#app',
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
|**`mountNode`**|`{String}`|`-`|Dom Element Selector the application mount on|
|**`files`**|`{Array}`|`-`|HTML Files to prerender|
|**`options.destDir`**|`{String}`|`*_prerender`|Destination directory to store the result|
|**`options.proxyTable`**|`{Array}`|`[]`|Proxy to forward any http request that match the config|
|**`options.ignoreError`**|`{Boolean}`|`false`|Define whether ignore all errors during the `Phantomjs` process.|
|**`options.resourceTimeout`**|`{Number}`|`15000`|Define the timeout of any resource|
|**`options.resourceIntercept`**|`{Array}`|`[]`|Define the regular expression of any resource will be aborted|
|**`options.XSSAuditingEnabled`**|`{Boolean}`|`false`|Defines whether load requests should be monitored for cross-site scripting attempts|

### `sourceDir`

```js
{
  sourceDir: path.resolve(__dirname, '../dist')
}
```

### `mountNode`

Make sure your application root component contain a mount node wrapper. React and Vue will replace the mount node with render content, in case the mount node get replaced at the first time of prerender.

**Root.vue**
```HTML
<template>
  <div id="app"></div>
</template>
```

**prerender.js**
```js
{
  mountNode: '#app'
}
```

### `files`

```js
{
  files: [
    'index.html',
    'about.html',
    'product.html'
  ]
}

```
### `options.destDir`

Define the destination directory. If you want to replace the source directory, just set the same path as `sourceDir`.

```js
{
  sourceDir: path.resolve(__dirname, '../dist'),
  mountNode: '#app',
  files: [
    'index.html',
    'about.html',
    'product.html'
  ],
  {
    destDir: path.resolve(__dirname, '../dist')
  }
}
```

### `options.proxyTable`

```js
{
  sourceDir: path.resolve(__dirname, '../dist'),
  mountNode: '#app',
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
}
```

### `options.ignoreError`

```js
{
  sourceDir: path.resolve(__dirname, '../dist'),
  mountNode: '#app',
  files: [
    'index.html',
    'about.html',
    'product.html'
  ],
  {
    ignoreError: true
  }
}
```

### `options.resourceTimeout`

 Define the timeout after which any resource requested will stop trying and proceed with other parts of the page. (in milli-secs)

```js
{
  sourceDir: path.resolve(__dirname, '../dist'),
  mountNode: '#app',
  files: [
    'index.html',
    'about.html',
    'product.html'
  ],
  {
    resourceTimeout: 35000
  }
}
```

### `options.resourceIntercept`

Define the regular expression to match any resource url will be aborted before request. The left hand in the array is `RegExp` pattern, the right hand is `RegExp` flag.

```js
{
  sourceDir: path.resolve(__dirname, '../dist'),
  mountNode: '#app',
  files: [
    'index.html',
    'about.html',
    'product.html'
  ],
  {
    resourceIntercept: [
      ['hm.baidu.com', 'g'],
      ['/api/tokenAttach', 'g']
    ]
  }
}
```

### `options.XSSAuditingEnabled`

```js
{
  sourceDir: path.resolve(__dirname, '../dist'),
  mountNode: '#app',
  files: [
    'index.html',
    'about.html',
    'product.html'
  ],
  {
    XSSAuditingEnabled: true
  }
}
```

## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.
