import { filterStr } from '../utils/utils'
import { request } from '../utils/request'
const { CHANNEL_ID } = getApp().config
const exReg = /^(?!_)(?!.*?_$)[a-zA-Z0-9_\u4e00-\u9fa5]+$/

function checkCusReason(cusR) {
    if (cusR) {
        cusR = filterStr(cusR);
        if (!exReg.test(cusR)) {
            wx.showModal({
                title: '提示',
                content: '换货理由包含特殊字符，请修改',
                showCancel: false
            });
            return false
        }
        return true
    }
    return true
}

function checkExParamLegal(reason) {
    return reason.indexOf(`请选择`) < 0
}

function culcRemainingTime(receiveTime) {
    let newMili = Date.parse(receiveTime.replace(/-/g, "/")) + 8 * 24 * 60 * 60 * 1000
    let newDate = new Date(newMili).toISOString().split("T")[0].concat(" 00:00:00")
    let targetTime = new Date(newDate).getTime()
    let nowTime = Date.now()
    if (targetTime > nowTime) {
        let gapSec = parseInt(targetTime / 1000) - parseInt(nowTime / 1000)
        let gapDay = parseInt(gapSec / 60 / 60 / 24)
        gapSec = gapSec - gapDay * 60 * 60 * 24
        let gapHour = parseInt(gapSec / 60 / 60)
        gapSec = gapSec - gapHour * 60 * 60
        let gapMin = parseInt(gapSec / 60)
        console.log(`>>>>>>>>>>>>>   gapDay=${gapDay}  gapHour=${gapHour}  gapMin=${gapMin}`)
        // return `${gapDay}天${gapHour}小时${gapMin}分`
        return [gapDay, gapHour, gapMin]
    } else {
        return [0, 0, 0]
    }

}

//创建换货单
function createExchangeOrder(bean) {
    bean.channelId = CHANNEL_ID;
    return new Promise((resolve, reject) => {
        request({
            url: `rest/exchange/create`,// 创建换货订单
            method: 'POST',
            data: bean
        })
            .then((response) => {
                console.log(response);
                if (response.code == 0 && response.data != null && response.data.exchangeCode != null) {
                    resolve(response.data.exchangeCode);
                } else {
                    reject(new Error(response.msg));
                }
            })
            .catch((e) => {
                reject(new Error(e.message));
            });
    });
}

// 获取换货单列表
function getExchangeOrderList(postBean) {
    return new Promise((resolve, reject) => {
        request({
            url: `rest/exchange/list`,//查询换货单列表
            method: 'GET',
            data: postBean
        })
            .then((response) => {
                if (response.code == 0 && response.data != null) {
                    resolve(response.data);//正式代码
                } else {
                    reject(new Error(response.msg));
                }
            })
            .catch((e) => {
                reject(new Error(e.message));
            });
    });
}

function getExOrderDetail(queryParam) {
    return new Promise((resolve, reject) => {
        request({
            url: `rest/exchange/detail`,//查询换货详情
            method: 'GET',
            data: queryParam
        })
            .then((response) => {
                if (response.code == 0 && response.data != null) {
                    resolve(response.data);
                } else {
                    reject(new Error(response.msg));
                }
            })
            .catch((e) => {
                reject(new Error(e.message));
            });
    });
}
/**
 * 获取换发商品价格信息(需要换货单号)
 */
function calcPrices(priceBean) {
    return new Promise((resolve, reject) => {
        request({
            url: `rest/exchange/getExchangePrice`,//获取换发商品价格信息(需要换货单号)
            method: 'POST',
            data: priceBean
        })
            .then((response) => {
                if (response != null && response.code == 0 && response.data != null) {
                    resolve(response.data);
                } else {
                    reject(new Error('计算价格失败'));
                }
            })
            .catch(e => {
                reject(new Error(e.message));
            });

    });

}
/**
 * 获取换发商品价格信息(不需要换货单号)
 */
function calcPrices2(priceBean2) {
    return new Promise((resolve, reject) => {
        request({
            url: `/rest/exchange/calculatePrice`,
            method: 'POST',
            data: priceBean2
        })
            .then((response) => {
                if (response != null && response.code == 0 && response.data != null) {
                    resolve(response.data);
                } else {
                    reject(new Error('计算价格失败'));
                }
            })
            .catch(e => {
                reject(new Error(e.message));
            });

    });
}

function uploadExpressInfo(eBean) {
    return new Promise((resolve, reject) => {
        request({
            url: `rest/exchange/update/express`,//更新换货物流信息
            method: 'POST',
            data: eBean
        })
            .then((response) => {
                console.log(response.code == 0);
                if (response.code == 0) {
                    resolve(true);
                } else {
                    reject(new Error(response.msg));
                }
            })
            .catch((e) => {
                reject(new Error(e.message));
            });
    });
}

//确认换货
function confirmExchangeOrder(cBean) {
    return new Promise((resolve, reject) => {
        request({
            url: `rest/exchange/update/confirm`,
            method: 'POST',
            data: cBean
        })
            .then((response) => {
                if (response.code == 0) {
                    resolve(response.data);
                } else {
                    reject(new Error(response.msg));
                }
            })
            .catch((e) => {
                reject(new Error(e.message));
            });
    });
}

function confirmReceiptExOr(exchangeCode) {
    return new Promise((resolve, reject) => {
        request({
            url: `rest/exchange/update/confirmReceived`,//换货，顾客确认收货
            method: 'POST',
            data: {
                exchangeCode: exchangeCode,
            }
        })
            .then((response) => {
                if (response.code == 0) {
                    resolve(true);
                } else {
                    reject(new Error(response.msg));
                }
            })
            .catch((e) => {
                reject(new Error(e.message));
            });
    });
}

function closeExOrder(exchangeCode) {
    return new Promise((resolve, reject) => {
        request({
            url: `rest/exchange/close`,//关闭换货单
            method: 'POST',
            data: {
                exchangeCode: exchangeCode,
            }
        })
            .then((response) => {
                if (response.code == 0) {
                    resolve(response.msg);
                } else {
                    reject(new Error(response.msg));
                }
            })
            .catch((e) => {
                reject(new Error(e.message));
            });
    });
}

function updateRefundShop(bean) {
    return new Promise((resolve, reject) => {
        request({
            url: `rest/exchange/update/refundShop`,
            method: 'POST',
            data: bean
        })
            .then((response) => {
                if (response.code == 0) {
                    resolve(response.msg);
                } else {
                    reject(new Error(response.msg));
                }
            })
            .catch((e) => {
                reject(new Error(e.message));
            });
    });
}

function getRefundShopList(bean) {
    return new Promise((resolve, reject) => {
        request({
            url: `api/refund/refundStoreList`,
            method: 'POST',
            data: bean
        })
            .then((response) => {
                if (response.code == 0) {
                    resolve(response.data);
                } else {
                    reject(new Error(response.msg));
                }
            })
            .catch((e) => {
                reject(new Error(e.message));
            });
    });
}

module.exports = {
    checkExParamLegal,
    checkCusReason,
    culcRemainingTime,
    createExchangeOrder,
    getExchangeOrderList,
    getExOrderDetail,
    calcPrices,
    calcPrices2,
    uploadExpressInfo,
    confirmExchangeOrder,
    confirmReceiptExOr,
    closeExOrder,
    updateRefundShop,
    getRefundShopList
}