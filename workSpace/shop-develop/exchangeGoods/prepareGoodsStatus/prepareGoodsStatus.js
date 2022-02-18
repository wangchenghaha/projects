import { createExchangeOrder, getExOrderDetail } from '../../service/order';
import { getShopInfo } from '../../service/shop';
import { URL_CDN } from '../../src/const';
import { checkLocation, getCurrLocation } from '../../service/location';
var Utils = require('../../utils/utils');
var exCons = require('../ex');
let createExPostBean = null;
let orderBean = null;
let shopBean = null;
let exchangeCode = "";
Page({

    /**
     * 页面的初始数据
     */
    data: {
        orderStatus: "",
        expectedPrice: 0,
        expectedPriceABS: "0.00",
        tipDataStr: "20xx年x月x日",
        timer: null,
        urlShopBG: URL_CDN.PIC_NEARBY_SHOP_BG,
        flagShowOrderText: true,

        protocalChecked: false,
        txtProtocolDetail: exCons.EXCHANGE_PROTOCOL,
        // steps: [
        //     {
        //         done: true,
        //         current: false,
        //         text: '客服审核',
        //         desc: '10.01'
        //     },
        //     {
        //         done: true,
        //         current: true,
        //         text: '选择换新',
        //         desc: '10.02'
        //     }
        // ],

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log("options..", options);
        exchangeCode = options.exchangeCode;
        if (!exchangeCode) {
            shopBean = JSON.parse(options.shopBean);
            orderBean = JSON.parse(options.orderBean);
            createExPostBean = JSON.parse(options.tempPostBean);

            // "exchangeType": "STORE",
            // "applyShop": "1234",
            // "consignee": "贺二狗",
            // "contactTel": "13838383838",
            createExPostBean.exchangeType = "STORE";
            createExPostBean.applyShop = shopBean.shopCode;
            createExPostBean.consignee = orderBean.consignee;
            createExPostBean.contactTel = orderBean.contactTel;


            this.setData({
                shopBean: shopBean,
                applySourceList: createExPostBean.applySourceList,
                flagShowOrderText: false,
            });
        } else {
            this.getPreparingExOrder();
        }

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

    onUnload: function () {
        clearInterval(this.data.timer);
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


    getPreparingExOrder: function () {
        let queryParam = {
            brandCode: getApp().config.brand,
            exchangeCode: exchangeCode
        }
        getExOrderDetail(queryParam)
            .then(exOrderBean => {
                this.setData({
                    exOrderBean: exOrderBean,
                    orderStatus: exOrderBean.status,
                    applySourceList: exOrderBean.applySourceList,
                    applyTargetList: exOrderBean.applyTargetList,
                });

                getShopInfo(exOrderBean.applyShop)
                    .then(res => {
                        this.setData({
                            shopBean: res,
                        });
                    })
                    .catch(e => {
                        wx.showToast({
                            title: `${e.message}`,
                        })
                    });
                if (exOrderBean.status == 'STOCKED' || exOrderBean.status == 'CONFIRM_TYPE') {
                    let updateTime = exOrderBean.updateTime;
                    let newMili = Date.parse(updateTime.replace(/-/g, "/")) + 7 * 24 * 60 * 60 * 1000;
                    let newDate = new Date(newMili); //转换成Data(); 
                    let year = newDate.getFullYear();
                    let month = newDate.getMonth() + 1;
                    let day = newDate.getDate();
                    // let hour = nowDate.getHours();
                    // let minutes = nowDate.getMinutes();
                    // let seconds = nowDate.getSeconds();
                    let dateStr = `${year}年${month}月${day}日`;
                    this.setData({
                        tipDataStr: dateStr,
                    });
                    let that = this;
                    let newMili2 = 0;
                    try {
                        newMili2 = Date.parse(`${year}/${month}/${day} 22:00:00`);//${hour}:${minutes}:${seconds}
                    } catch (e) {
                        console.log(e);
                    }
                    console.log(`>>>>>>>>>>>> newMili2 ========${newMili2}`);
                    let gapMili = newMili2 - newMili;
                    if (gapMili > 0) {
                        newMili = newMili2;
                    }
                    this.data.timer = setInterval(function () {
                        let during = Utils.formatDuring(newMili - new Date().getTime());
                        that.setData({
                            leftDuringStr: during,
                        });
                    }, 1000);
                }

                let oriTotal = 0.00;
                this.data.applySourceList.forEach(element => {
                    oriTotal = Utils.jiafa(oriTotal, element.price);
                });

                let targitTotal = 0.00;
                this.data.applyTargetList.forEach(ele => {
                    targitTotal = Utils.jiafa(targitTotal, ele.price);
                });
                let expectedPrice = Utils.jianfa(targitTotal, oriTotal);
                this.setData({
                    expectedPrice: expectedPrice,
                    expectedPriceABS: Math.abs(expectedPrice).toFixed(2),
                });
                wx.hideLoading();
            })
            .catch(e => {
                wx.hideLoading();
                wx.showToast({
                    icon: `${e.message}`,
                })
            });
    },

    onKnown: function (e) {
        var pageList = getCurrentPages();
        //后退回合适的页面
        let delta = pageList.length >= 2 ? pageList.length - 2 : 1;
        wx.navigateBack({
            delta: delta,
        })
    },

    onCommit: function (e) {
        if (Utils.throttle()) {
            if (!this.data.protocalChecked) {
                wx.showModal({
                    title: '提示',
                    content: '请阅读换货协议并同意',
                    showCancel: false,
                });
                return
            }
            wx.showLoading({
                title: '加载中...',
            });
            let applySourceListRaw = createExPostBean.applySourceList;
            let applySourceListPost = new Array();
            applySourceListRaw.forEach(ele => {
                applySourceListPost.push({
                    "sku": ele.gcsSku,
                    "goodsOrderId": ele.goodsId,
                    "goodsCount": ele.goodsCount,
                });
            })
            createExPostBean.applySourceList = applySourceListPost;
            createExchangeOrder(createExPostBean)
                .then(exchangeCode => {
                    wx.hideLoading();
                    wx.redirectTo({
                        url: `/exchangeGoods/auditResults/auditResults?exchangeCode=${exchangeCode}`,
                    })
                })
                .catch(e => {
                    wx.hideLoading();
                    wx.showModal({
                        title: `提示`,
                        content: `${e.message}`,
                        showCancel: false,
                    });
                });
        }
    },

    onTmplMapNavClick: function (e) {
        if (Utils.throttle()) {
            let shopBean = this.data.shopBean;
            wx.openLocation({
                latitude: shopBean.latitude,
                longitude: shopBean.longitude,
                scale: 24,
                name: shopBean.shopNameNn,
                address: shopBean.address,
            });
        }
    },

    onProtocalSwitchChange: function (e) {
        this.setData({ protocalChecked: e.detail.value })
    },

    onProtocolDetailClick: function (e) {
        this.setData({ showProtocol: true })
    },

    onProtocolConfirm: function (e) {
        this.setData({ showProtocol: false })
    }

})