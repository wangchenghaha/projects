import { URL_CDN } from '../../src/const';
import { DEBUG } from '../exCons'
var Utils = require("../../utils/utils");
let tempPostBean = null;
let orderBean = null;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        urlShopBG: URL_CDN.PIC_NEARBY_SHOP_BG,
    },




    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let shopBean = JSON.parse(options.shopBean);
        // let exchangeCode = options.exchangeCode;
        tempPostBean = options.tempPostBean;
        orderBean = options.orderBean;
        let navBean = JSON.parse(options.navBean);
        this.setData({
            shopBean: shopBean,
            // exchangeCode: exchangeCode,
            navBean: navBean
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

    onCopyShopInfo: function (e) {

    },

    onTmplShopPhoneCall: function (e) {
        let o2oShopPhone = this.data.shopBean.o2oShopPhone;
        let cellphone = this.data.shopBean.cellphone;
        let phone = o2oShopPhone ? o2oShopPhone.replace("-", "") : cellphone ? cellphone : "";
        if (phone) {
            wx.makePhoneCall({
                phoneNumber: phone,
            })
        } else {
            wx.showModal({
                title: '提示',
                content: '该店铺暂无电话',
                showCancel: false,
            })
        }
    },

    onTmplShopInfoCopy: function (e) {
        let address = this.data.shopBean.address;
        let o2oShopPhone = this.data.shopBean.o2oShopPhone;
        let cellphone = this.data.shopBean.cellphone;
        let phoneStr = o2oShopPhone ? "  电话：" + o2oShopPhone : cellphone ? "  电话：" + cellphone : "";
        wx.setClipboardData({
            data: address + phoneStr,
            success: (result) => {
                wx.showToast({
                    title: '复制成功',
                });
            },
            fail: () => {
                wx.showToast({
                    title: '复制失败',
                });
            },
        });
    },

    onTmplMapNavClick: function (e) {
        if (Utils.throttle()) {
            wx.openLocation({
                name: this.data.shopBean.shopNameCn,
                address: this.data.shopBean.address,
                latitude: this.data.shopBean.latitude,
                longitude: this.data.shopBean.longitude,
                scale: 28
            });
        }
    },


    goStraight: function (e) {
        if (Utils.throttle()) {
            let shopBean = JSON.stringify(this.data.shopBean);
            wx.navigateTo({
                url: `/exchangeGoods/prepareGoodsStatus/prepareGoodsStatus?tempPostBean=${tempPostBean}&orderBean=${orderBean}&shopBean=${shopBean}`,
            })
        }
    },

    chooseOnline: function (e) {
        if (Utils.throttle()) {
            let shopBean = JSON.stringify(this.data.shopBean);
            wx.navigateTo({
                url: `/exchangeGoods/goodsList/goodsList?exchangeWay=exchangeAtShopOnlineChoose&shopBean=${shopBean}&orderBean=${orderBean}&tempPostBean=${tempPostBean}`,
            });
        }
    }
})