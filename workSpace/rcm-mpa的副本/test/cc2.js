#!/usr/bin/env node
const glob = require("glob");
const readline = require('readline');
const fs = require('fs');

async function rdl(file) {
  return new Promise((resolve, reject) => {
    let index = 0;
    let codeLines = []

    let readStream = fs.createReadStream(file);
    let rl = readline.createInterface({
      input: readStream
    });
    rl.on('line', line => {
      index++;
      if (index === 2) {
        // 追加导航
        if (line.includes('div')) {
          let fixLine = line
          if (line.includes('</div>')) {
            // 有闭合标签
            // </div>
            // console.log('---> 有闭合标签[' + line);
            // 找到第一个div在后插入 class="container",再在第一个>号后插入<Navigation/>
            // line.replace(/div/g, 'div    <Navigation/>')
          } else {
            // 无闭合标签
            // <div>
            // console.log('===> 无闭合标签[' + line);
            if (line.includes('class')) {
              const newClassLine = line.replace(/class="/g, 'class="container ');
              const divStartIndex = line.indexOf('div');
              fixLine = newClassLine.substring(0, divStartIndex + 3) + newClassLine.substring(divStartIndex + 3, 10000) + '\n    <Navigation/>'
            } else {
              const divStartIndex = line.indexOf('div');
              fixLine = line.substring(0, divStartIndex + 3) + ' class="container"' + line.substring(divStartIndex + 3, 10000) + '\n    <Navigation/>'
            }
          }
          codeLines.push(fixLine)
        } else {
          // console.log(`= = => :[${line}]`);
          // if (line.endsWith('/>')) {
          //   console.log('标签闭合');
          // } else if (line.endsWith('>')) {
          //   console.log('标签无闭合');
          // }
        }

      } else {
        codeLines.push(line.toString())
      }
    })
    rl.on('close', () => {
      let l = ''
      const getValue = (codeLines) => {
        for (const iterator of codeLines) {
          l += iterator;
          l += '\n'
        }
        return l
      }
      resolve(getValue(codeLines))
    })
  })
}
/**
 * 程序入口
 */
async function main() {

  glob.sync(`./src/view/**/**/*.vue`).forEach(async (file) => {
    const stat = fs.statSync(file)
    if (!stat.isDirectory()) {
      const newVue = await rdl(file);
      fs.writeFileSync(file, newVue);
    }
  })
}

main();