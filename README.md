## Introduction

Prerender HTML files using [PhantomJS](http://phantomjs.org). Make sure the search engine crawlers capture the right content, not `<div id="app"></div>` stuff. The Most common user scenario are [React](https://reactjs.org/) and [Vue](https://vuejs.org/) rendered page.

## Install

```bash
yarn add prerender-seo --dev
```

or npm

```bash
npm install prerender-seo --save-dev
```

## API

``` js
const path = require('path')
const prerenderSEO = require('../lib')

prerenderSEO(
  path.resolve(__dirname, './dist'),
  ['/index.html']
)

```

## Test

The test case use a [vue-cli](https://github.com/vuejs/vue-cli) generated project

``` bash
npm run test
```

## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.
