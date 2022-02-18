import { getExOrderDetail } from '../../service/order';
var Utils = require('../../utils/utils');
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        flagShowWay: true,
        noShow: false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let exOrderBean = JSON.parse(options.exOrderBean);
        let exchangeCode = exOrderBean.exchangeCode;
        console.log('exchangeCode |||||||+++++++++======================');
        console.log(exchangeCode);
        let queryParam = {
            brandCode: getApp().config.brand,
            exchangeCode: exchangeCode,
        }
        wx.showLoading({
            title: "加载中..."
        });
        getExOrderDetail(queryParam)
            .then(res => {
                this.setData({
                    exDetailBean: res,
                    exchangeCode: res.exchangeCode,
                });
                let reasonRaw = res.exchangeReason;
                let reasonBean;
                let reasonStr = "";
                try {
                    reasonBean = JSON.parse(reasonRaw);
                } catch (e) {
                    console.log(e);
                }
                if (reasonBean) {
                    console.log(reasonBean);
                    let a = reasonBean.A;
                    let b = reasonBean.B;
                    let c = reasonBean.C;
                    let d = reasonBean.D;
                    let e = reasonBean.E;
                    reasonStr = (a ? a + "/" : "") + (b ? b + "/" : "") + (c ? c + "/" : "") + (d ? d + "/" : "") + (e ? e : "");
                    if (reasonStr.lastIndexOf("/") == reasonStr.length - 1) {
                        reasonStr = reasonStr.substring(0, reasonStr.length - 1);
                    }
                    this.setData({
                        flagShowWay: c ? false : true,
                        reasonProceeded: reasonStr,
                    });
                }
                wx.hideLoading();
            })
            .catch(e => {
                wx.hideLoading();
                wx.showToast({
                    title: `${e.message}`,
                })
            });
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    onExchangeInShop: function (e) {
        if (Utils.throttle()) {
            wx.navigateTo({
                url: `/exchangeGoods/shopList/shopList?exchangeCode=${this.data.exchangeCode}`,
            });
        }
    },

    onExchangeInExpress: function (e) {
        if (Utils.throttle()) {
            wx.navigateTo({
                url: `/exchangeGoods/goodsList/goodsList?exchangeCode=${this.data.exchangeCode}&exchangeWay=exchangeExpress`,
            });
        }
    }

})