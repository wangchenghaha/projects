#!/usr/bin/env node
const glob = require("glob");

const fs = require('fs');
const path = require('path');

/**
 * 生成入口文件
 * @param filename 文件名
 */
function getEntryJsCode(filename, includeVuex) {
  const vuexImportCode = includeVuex ? `import store from '@/store'` : '';
  const vuexUseCode = includeVuex ? 'store,' : '';
  const entryJSCode =
    `import Vue from '@/Vue'
${vuexImportCode}
import App from './${filename}.vue'
import i18n from '@/locale'
Vue.config.productionTip = false

new Vue({
  i18n,
  ${vuexUseCode}
  render: h => h(App),
}).$mount('#app')`
  return entryJSCode;
}

/**
 * 生成模板文件
 */
function getEntryTemplate() {
  const entryJSCode =
    `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width,initial-scale=1.0">
        <link rel="icon" href="<%= BASE_URL %>favicon.ico">
        <title><%= 'BESTSELLER RCM2' || htmlWebpackPlugin.options.title %></title>
      </head>
      <body>
        <noscript>
          <strong>We're sorry but <%= htmlWebpackPlugin.options.title %> doesn't work properly without JavaScript enabled. Please enable it to continue.</strong>
        </noscript>
        <div id="app"></div>
        <!-- built files will be auto injected -->
      </body>
    </html>`
  return entryJSCode;
}

/**
 * 程序入口
 */
async function main() {
    
  glob.sync(`./src/view/**/**/*.vue`).forEach(file => {
    const stat = fs.statSync(file)
    if (!stat.isDirectory()) {
      const filename = path.basename(file, '.vue')
      const dirname = path.dirname(file);
      console.log(`--> ${dirname}/${filename}.js`);
      fs.writeFileSync(`${dirname}/${filename}.js`, getEntryJsCode(filename,fs.readFileSync(file).toString().includes('registerModule')));
      // fs.writeFileSync(`${dirname}/${filename}.html`, getEntryTemplate());
      
    }
  })
}

main();