const app = getApp();
const brandName = app.config.brand;
console.log(app.config)
let brand = ''
let config_name = ''
switch (brandName) {
    case 'JLINDEBERG':
        brand = 5
        config_name = 'MERCHANT_5'
        break;
    case 'JACKJONES':
        brand = 2
        config_name = 'MERCHANT_2'
        break;
    case 'SELECTED':
        brand = 4
        config_name = 'MERCHANT_4'
        break;
    case 'ONLY':
        brand = 1
        config_name = 'MARIE_CAT_1'
        break;
    case 'VEROMODA':
        brand = 3
        config_name = 'MARIE_CAT_3'
        break;
    case 'FOL':
        brand = 6
        config_name = 'MERCHANT_6'
        break;
}
const configObj = {
    test: {
        apiUrl: 'https://bestseller-wechat-test.woaap.com',
        brandName,
        brand,
        config_name,
        questionUrl: 'https://bestseller-wechat-test.woaap.com',
    },
    prod: {
        apiUrl: 'https://bestseller-wechat.woaap.com',
        brandName,
        brand,
        config_name,
        questionUrl: 'https://bestseller-wechat.woaap.com',
    }
}
export default configObj.prod;