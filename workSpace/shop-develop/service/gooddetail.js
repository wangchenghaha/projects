//商品业务模块
import { request } from '../utils/request.js'
import { URL, KEYSTORAGE } from '../src/const.js'
const cdn = getApp().config.cdn;
const brand = getApp().config.brand;

function getGoodsDetail(sku, brand) {
    return new Promise((resolve, reject) => {
        request({
            header: {
                'content-type': 'application/json', // 请求体类型默认值
                token: wx.getStorageSync('token') || '', //请求凭证
                brand: brand ? brand : getApp().config.brand
            },
            url: URL.GOODS_DETAIL,
            data: { goodsCode: sku }
        }).then(result => {
            if (result.code == 0) {
                getStock(sku)
                    .then(data => {
                        let stock = data;
                        for (let i = 0; i < result.data.color.length; i++) {
                            result.data.color[i].stock = getRange(result.data.color[i].colorCode, stock, 0)
                            for (let j = 0; j < result.data.color[i].sizes.length; j++) {
                                result.data.color[i].sizes[j].stock = getRange(result.data.color[i].sizes[j].sku, stock, 1)
                            }
                        }
                        resolve(result.data)
                    })

            } else {
                reject(new Error(result.msg))
            }
        }).catch(e => {
            reject(new Error(e.msg || e.message))
        })
    })
}

function getStock(goodsCode) {
    return new Promise((resolve, reject) => {
        request({
            url: `${URL.GETSTOCKNEW}?goodsCode=${goodsCode}`
        }).then(res => {
            res.code === 0 ? resolve(res.data) : reject(new Error(res.msg))
        }).catch(e => {
            reject(new Error(e.msg || e.message))
        })
    })
}

/**
 * 获取指定层级的库存
 * @param colorCode
 * @param stock
 * @param level
 */
function getRange(colorCode, stockObj, level) {
    // console.log(stockObj)
    var count = 0
    if (level === 0) {
        for (var item in stockObj) {
            if (item.indexOf(colorCode) > -1) {
                count += Number(stockObj[item] ? stockObj[item] : 0)
            }
        }
    } else {
        for (var item2 in stockObj) {
            if (colorCode === item2) {
                count = Number(stockObj[item2] ? stockObj[item2] : 0)
                break
            }
        }
    }
    return count
}

export {
    getGoodsDetail,
}