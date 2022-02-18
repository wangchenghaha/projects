import { uploadExpressInfo, getExOrderDetail, culcRemainingTime, updateRefundShop } from '../ex'
import { getProvincesThroughIP, cutProvince } from '../../service/location'
import { getRefundShopList } from '../ex'
import { DEBUG, EX_RETURN_TIP_0, EX_RETURN_TIP_1, TEST_H_CODE, uploadTrackingTestBean, TYPE_REFUND } from '../exCons';
const config = require('../../src/config.js');
import { throttle } from '../../utils/utils'
const refundAddressDetail = config.refundAddressDetail;
const REFUND_RECEIVER = config.REFUND_RECEIVER;
let expressList = [
    '顺丰速运',
    '圆通速递',
    '申通快递',
    '中通快递',
    '百世快递',
    '韵达快递',
    '京东快递',
    '天天快递',
    '中国邮政-平邮',
    'EMS',
    '宅急送',
    '德邦物流',
    '优速快递',
    '汇通快运',
    '全峰快递',
    '其它',
]
Page({

    /**
     * 页面的初始数据
     */
    data: {
        refundAddress: refundAddressDetail,
        recipient: REFUND_RECEIVER ? REFUND_RECEIVER : "H5手机Inbound收货组",
        companyName: null,
        phoneNo: "400-862-8888",
        zipCode: "301700",
        returnMethod: "returnThroughExpress",
        tip0: EX_RETURN_TIP_0,
        tip1: EX_RETURN_TIP_1

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options);
        let { exchangeCode } = options
        this.setData({
            exchangeCode: DEBUG ? TEST_H_CODE : exchangeCode,
            expressList: expressList,
        });
        console.log(this.data.exchangeCode);

        if (DEBUG) {
            let res = uploadTrackingTestBean
            let updateTime = res.updateTime
            let remainTimeArray = updateTime ? culcRemainingTime(updateTime) : []
            this.setData({
                exOrderBean: res,
                sourceBean: res.applySourceList[0],
                remainTimeArray: remainTimeArray
            })
            return
        }

        getExOrderDetail({
            brandCode: getApp().config.brand,
            exchangeCode: this.data.exchangeCode,
        })
            .then(res => {
                let updateTime = res.updateTime
                let remainTimeArray = updateTime ? culcRemainingTime(updateTime) : []
                this.setData({
                    exOrderBean: res,
                    sourceBean: res.applySourceList[0],
                    remainTimeArray: remainTimeArray
                })
                setInterval(() => {
                    this.setData({ remainTimeArray: culcRemainingTime(updateTime) })
                }, 1000);
            })
            .catch(e => {
                wx.showToast({
                    title: e.message,
                });
                console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  err")
                console.log(e)
            })
    },

    onReady: function () {
        this._findSingleShop();
    },

    onExpressCompanyInput: function (e) {
        let companyName = e.detail.value;
        this.setData({
            companyName: companyName,
        });
    },

    onExpressCodeInput: function (e) {
        let eCode = e.detail.value;
        this.setData({
            eCode: eCode,
        });
    },

    onPickerClick: function (e) {
        console.log(e);
        let index = Number(e.detail.value);
        this.setData({
            companyName: expressList[index],
        });
    },

    onTmplShopInfoCopy: function (e) {
        let str = refundAddressDetail + " 收件人：" + this.data.recipient + " 电话：" + this.data.phoneNo;
        wx.setClipboardData({
            data: str,
            success: (result) => {
                wx.showToast({
                    title: '复制成功',
                });
            },
        });
    },

    onCommitClick: function () {
        if (throttle()) {
            wx.showLoading({
                title: "加载中...",
            });
            let { exchangeCode, companyName, eCode } = this.data;
            if (this.data.returnMethod == "returnThroughExpress") {
                if (!(companyName && eCode)) {
                    wx.showModal({
                        title: '提示',
                        content: '请输入物流公司和单号',
                        showCancel: false,
                    });
                    return
                }
            }
            let postBean = this.data.returnMethod == `returnThroughExpress` ?
                {
                    exchangeCode: exchangeCode,
                    expressCompany: companyName,
                    expressNo: eCode
                }
                : {
                    exchangeCode: exchangeCode,
                    refundShop: this.data.singleShopBean.shopCode
                }
            let fooOrin = this.data.returnMethod == `returnThroughExpress` ?
                Promise.resolve(uploadExpressInfo(postBean)) : Promise.resolve(updateRefundShop(postBean))
            fooOrin.then(res => {
                wx.hideLoading();
                wx.navigateTo({
                    url: `/exchangeGoods2/orderStatusNew/orderStatusNew?exchangeCode=${exchangeCode}`
                });
            })
                .catch(e => {
                    wx.hideLoading();
                    wx.showModal({
                        title: '提示',
                        content: `${e.message}`,
                        showCancel: false,
                    });
                });
        }
    },

    onRefundWayClick: function (ev) {
        console.log(ev)
        let way = ev.target.dataset.way
        this.setData({ returnMethod: way })
        switch (way) {
            case "returnThroughExpress":
                break;
            case "returnThroughShop":
                this._findSingleShop();
                break;
        }
    },

    _findSingleShop: function () {
        if (this.data.singleShopBean) return
        wx.showLoading({
            title: '加载中'
        });
        getProvincesThroughIP()
            .then(result => {
                let rBean = {
                    "ecsOrderID": this.data.exOrderBean.oriorderCode,
                    "coordinate": result.location.lng + "," + result.location.lat,
                    "productCode": this.data.exOrderBean.applySourceList[0].sku
                }
                return getRefundShopList(rBean)
            })
            .then(resList => {
                if (resList && resList.length == 0) return
                let [firstShop] = resList
                console.log(firstShop)
                let singleS = {
                    "shopCode": firstShop.storeCode,
                    "shopNameNn": firstShop.name,
                    "address": firstShop.address,
                    "o2oShopPhone": firstShop.phone1,
                    "distance": (parseFloat(firstShop.distance) / 1000).toFixed(1)
                }
                this.setData({ singleShopBean: singleS })
            })
            .catch(e => {
                console.log(e)
            })
            .finally(() => {
                if (this.data.returnMethod == 'returnThroughShop') {
                    wx.showToast({
                        title: '暂无可用店铺',
                    });
                    this.setData({ returnMethod: 'returnThroughExpress' })
                }
                wx.hideLoading()
            })
    },

    onGotoShopListClick: function () {
        let orderCode = this.data.exOrderBean.oriorderCode
        let productCode = this.data.exOrderBean.applySourceList[0].sku
        wx.navigateTo({
            url: `/exchangeGoods2/shopList/shopList?intentType=${TYPE_REFUND}&orderCode=${orderCode}&productCode=${productCode}`,
        });
    },


})