
const fs = require('fs')
// wget http://rcmtest.only.cn/rcm2/assets/echarts@3.6.2/map/json/china.json
let d = fs.readFileSync('./china.json').toString()
const p = [
    { code: '11', valueEn: 'Beijing', valueCn: '北京' },
    { code: '43', valueEn: 'Hunan', valueCn: '湖南' },
    { code: '12', valueEn: 'Tianjin', valueCn: '天津' },
    { code: '44', valueEn: 'Guangdong', valueCn: '广东' },
    { code: '13', valueEn: 'Hebei', valueCn: '河北' },
    { code: '45', valueEn: 'Guangxi', valueCn: '广西' },
    { code: '14', valueEn: 'Shanxi', valueCn: '山西' },
    { code: '46', valueEn: 'Hainan', valueCn: '海南' },
    { code: '15', valueEn: 'Nei Mongol', valueCn: '内蒙古' },
    { code: '50', valueEn: 'Chongqing', valueCn: '重庆' },
    { code: '21', valueEn: 'Liaoning', valueCn: '辽宁' },
    { code: '51', valueEn: 'Sichuan', valueCn: '四川' },
    { code: '22', valueEn: 'Jilin', valueCn: '吉林' },
    { code: '52', valueEn: 'Guizhou', valueCn: '贵州' },
    { code: '23', valueEn: 'Heilongjiang', valueCn: '黑龙江' },
    { code: '53', valueEn: 'Yunnan', valueCn: '云南' },
    { code: '31', valueEn: 'Shanghai', valueCn: '上海' },
    { code: '54', valueEn: 'Tibet', valueCn: '西藏' },
    { code: '32', valueEn: 'Jiangsu', valueCn: '江苏' },
    { code: '61', valueEn: 'Shaanxi', valueCn: '陕西' },
    { code: '33', valueEn: 'Zhejiang', valueCn: '浙江' },
    { code: '62', valueEn: 'Gansu', valueCn: '甘肃' },
    { code: '34', valueEn: 'Anhui', valueCn: '安徽' },
    { code: '63', valueEn: 'Qinghai', valueCn: '青海' },
    { code: '35', valueEn: 'Fujian', valueCn: '福建' },
    { code: '64', valueEn: 'Ningxia', valueCn: '宁夏' },
    { code: '36', valueEn: 'Jiangxi', valueCn: '江西' },
    { code: '65', valueEn: 'Xinjiang', valueCn: '新疆' },
    { code: '37', valueEn: 'Shandong', valueCn: '山东' },
    { code: '71', valueEn: 'Taiwan', valueCn: '台湾' },
    { code: '41', valueEn: 'Henan', valueCn: '河南' },
    { code: '81', valueEn: 'Xianggang', valueCn: '香港' },
    { code: '42', valueEn: 'Hubei', valueCn: '湖北' },
    { code: '82', valueEn: 'Aomen', valueCn: '澳门' }
  ]


for (const pItem of p) {
    d = d.replace(pItem.valueCn,pItem.valueEn)
}


fs.writeFileSync('./china-en.json',d);