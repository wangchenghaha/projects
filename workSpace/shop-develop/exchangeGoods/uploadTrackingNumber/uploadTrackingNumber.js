import { uploadExpressInfo } from '../../service/order';
const config = require('../../src/config.js');
var Utils = require('../../utils/utils');
const refundAddressDetail = config.refundAddressDetail;
const REFUND_RECEIVER = config.REFUND_RECEIVER;
let expressList = [
    '顺丰速运',
    '圆通速递',
    '申通快递',
    '中通快递',
    '百世快递',
    '韵达快递',
    '天天快递',
    '中国邮政-平邮',
    'EMS',
    '宅急送',
    '德邦',
    '全峰快递',
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

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options);
        let { exchangeCode } = options;
        this.setData({
            exchangeCode: exchangeCode,
            expressList: expressList,
        });
        console.log(this.data.exchangeCode);
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

    onCommitCode: function (e) {
        if (Utils.throttle()) {
            wx.showLoading({
                title: "加载中...",
            });
            let { exchangeCode, companyName, eCode } = this.data;
            if (!(companyName && eCode)) {
                wx.showModal({
                    title: '提示',
                    content: '请输入物流公司和单号',
                    showCancel: false,
                });
                return
            }
            let eBean = {
                exchangeCode: exchangeCode,
                expressCompany: companyName,
                expressNo: eCode
            }
            //======================  正式代码start  =========================================
            uploadExpressInfo(eBean)
                .then(res => {
                    wx.hideLoading();
                    wx.navigateTo({
                        url: `/exchangeGoods/orderStatusNew/orderStatusNew?exchangeCode=${exchangeCode}`
                    });
                    console.log("-------------- 上传单号成功 --------------");
                })
                .catch(e => {
                    wx.hideLoading();
                    wx.showModal({
                        title: '提示',
                        content: `${e.message}`,
                        showCancel: false,
                    });
                });
            //======================  正式代码 end  =========================================


            //======================  测试代码 start  =========================================
            //        wx.redirectTo({
            //            url: `/exchangeGoods/orderStatusNew/orderStatusNew?exchangeCode=${exchangeCode}`,
            //        });
            //======================  测试代码 end  =========================================
        }
    }
})