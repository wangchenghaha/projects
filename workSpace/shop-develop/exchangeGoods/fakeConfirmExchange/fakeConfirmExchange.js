import { calcPrices2 } from '../../service/goods';
import { createExchangeOrder, updateExType, getExOrderDetail } from '../../service/order';
var Utils = require('../../utils/utils');
var exCons = require('../ex');
let calcuCount = 0;
let timer = null;
let exPostBean = null;

let mApplySource;
let mTarget;
let totalCount = 0;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        cusName: "",
        cusPhone: "",
        flagChangePeople: true,
        bt_text: "更换提货人",

        protocalChecked: false,
        txtProtocolDetail: exCons.EXCHANGE_PROTOCOL,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options);
        wx.showLoading({
            title: '加载中...',
        });
        mApplySource = new Array();
        mTarget = new Array();
        let { exchangeWay, cartList, orderBean, shopCode } = options;
        // let exDetailBean = JSON.parse(options.exDetailBean);
        if (cartList) {
            cartList = JSON.parse(cartList);
        }
        if (orderBean) {
            orderBean = JSON.parse(decodeURIComponent(orderBean));
        }
        exPostBean = JSON.parse(decodeURIComponent(options.tempPostBean));

        let goodsOrderList = orderBean.goodsOrderList;
        goodsOrderList.forEach(ele => {
            ele.gsMainPicPath = ele.gscolPicPath.replace('https://cdn.bestseller.com.cn', '');
            ele.sku = ele.gcsSku;
        });
        exPostBean.exchangeType = exchangeWay == "exchangeExpress" ? "MAIL" : "STORE";
        exPostBean.applyShop = exchangeWay == "exchangeExpress" ? "" : shopCode;
        exPostBean.consignee = orderBean.consignee;
        exPostBean.contactTel = orderBean.contactTel;
        exPostBean.applySourceList.forEach(ele => {
            mApplySource.push({
                "sku": ele.gcsSku,
                "goodsOrderId": ele.goodsId,
                "goodsCount": ele.goodsCount,
            });
            console.log("  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  exPostBean.applySourceList.forEach   ele  ==");
            console.log(ele);
        })
        console.log("  ||||||||||||||||||||||||||||||||||  mApplySource  ==");
        console.log(mApplySource);
        exPostBean.applySourceList = mApplySource;

        cartList.forEach(ele => {
            totalCount += ele.goodsCount;
            ele.sku = ele.gcsSku;
            mTarget.push({
                sku: ele.gcsSku,
                goodsCount: ele.goodsCount,
            });
            console.log(">>>..>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  cartList.  mTarget.length  ==" + mTarget.length);
        });
        exPostBean.applyTargetList = mTarget;

        this.setData({
            exchangeWay: exchangeWay,
            cartList: cartList,
            // shopCode: shopCode,
            // exchangeCode: exchangeCode,
            // tempPostBean: tempPostBean,
            cusName: orderBean.consignee,
            cusPhone: orderBean.contactTel,
            applyList: goodsOrderList,
            totalCount: totalCount,
        });

        wx.hideLoading();

        // let queryParam = {
        //     brandCode: getApp().config.brand,
        //     exchangeCode: exchangeCode,
        // }
        // wx.showLoading({
        //     title: "加载中..."
        // });
        // getExOrderDetail(queryParam)
        //     .then(res => {
        //         this.setData({
        //             exDetailBean: res,
        //             cusName: res.oriConsignee,
        //             cusPhone: res.oriContactTel,
        //             exchangeCode: res.exchangeCode,
        //             applyList: res.applySourceList,
        //         });
        //         wx.hideLoading();
        //     })
        //     .catch(e => {
        //         wx.hideLoading();
        //         wx.showModal({
        //             title: '提示',
        //             content: '获取换货单详情失败，请重试',
        //             showCancel: false,
        //         });
        //     });



        // this.setData({
        //     exDetailBean: exDetailBean,
        //     cusName: exDetailBean.consignee,
        //     cusPhone: exDetailBean.contactTel,
        //     exchangeWay: exchangeWay,
        //     exchangeCode: exDetailBean.exchangeCode,
        //     applyList: exDetailBean.applySourceList,
        //     cartList: JSON.parse(cartList),
        // })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

        // let postPrice = {
        //     exchangeCode: this.data.exchangeCode,
        //     exchangeGoodsType: "APPLY_SOURCE",
        //     newGoodsList: newGList,
        // }
        let postPrice = {
            newGoodsList: mTarget,
            sourceGoodsList: mApplySource,
        }
        this.calculatePrice(postPrice);
    },

    calculatePrice: function (postPrice) {
        let that = this;
        calcPrices2(postPrice)
            .then(res => {
                if (timer) {
                    clearInterval(timer);
                }
                this.calcPriceProtection(res);
            })
            .catch(e => {
                timer = setInterval(function () {
                    ++calcuCount > 3 ? clearInterval(timer) : that.calculatePrice(postPrice);
                }, 700);
                if (calcuCount > 3) {
                    wx.hideLoading();
                    wx.showToast({
                        title: `${e.message}`,
                    });
                }
            });
    },

    calcPriceProtection: function (res) {
        // let priceList = res.goodsPriceList;
        // let cartListTemp = this.data.cartList;
        // let newCartList = new Array();

        // "sku": "417331503A06360",
        // "goodsCount": 1,
        // "originalPrice": 399,
        // "salePrice": 399,
        // "price": 199.5,
        // "sourceGoodsOrderId": 1655093

        // goodsName	:	时尚男士渐变衬衫
        // colorName	:	蓝色
        // originalPrice	:	499
        // price	:	499
        // gcsSku	:	414105037031380
        // sizeName	:	175/96A
        // goodsCount	:	2
        // gsMainPicPath	:	/goodsImagePC/SELECTED/414105037/414105037031/414105037031_p1.jpg
        // sku	:	414105037031380

        //循环保价后的列表，该列表长度必然大于等于carlist长度
        // for (let i = 0; i < priceList.length; i++) {
        //     //每个保价的item，对应都要遍历一遍cartlist，找到和外层sku一致的内层条目，
        //     //如果 sku 相同，则判断两边的价格和数量
        //     for (let j = 0; j < cartListTemp.length; j++) {
        //         if (priceList[i].sku == cartListTemp[j].sku) {
        //             //1 只要sku相同，无论数量和价格如何，先复制保价后的价格，和数量到 newCartList 中
        //             //priceList[i]放在后面的参数位置，因为要覆盖 cartlist 的属性，包括数量和价格
        //             newCartList.push(Object.assign({}, cartListTemp[j], priceList[i]));

        //             //2 然后再判断数量
        //             if (cartListTemp[j].goodsCount > priceList[i].goodsCount) {
        //                 //cartList中的数量有盈余，就把 cartList 的该item的数量减去已经复制过的数量
        //                 cartListTemp[j].goodsCount = cartListTemp[j].goodsCount - priceList[i].goodsCount;
        //                 //到此，可以跳出内层循环
        //                 //cartListTemp 的该item还可以在下次循环中使用,因为数量没有减完
        //             } else {
        //                 //若数量一致，则说明该条目使用完毕，可以在 cartlistTemp 中删除该item
        //                 cartListTemp.splice(j, 1);
        //             }
        //             break;
        //         }
        //     }
        // }

        let newCartList = Utils.calculatingInsuredPrice(this.data.cartList, res.goodsPriceList);

        this.setData({
            cartList: newCartList,
            newPrice: res.totalPrice.toFixed(2),
            oldPrice: res.sourceGoodsAmount.toFixed(2),
            diffPrice: res.additionalAmount.toFixed(2),
            absDiffPrice: Math.abs(res.additionalAmount).toFixed(2),
        });
    },


    onCusNameChange: function (e) {
        this.setData({
            cusName: e.detail.value,
        });
        exPostBean.consignee = e.detail.value;
    },

    onCusPhoneChange: function (e) {
        this.setData({
            cusPhone: e.detail.value,
        });
        exPostBean.contactTel = e.detail.value;
    },

    onChangePicker: function (e) {
        let isDisable = this.data.flagChangePeople;
        console.log(isDisable);
        this.setData({
            flagChangePeople: !isDisable,
        })
        if (isDisable) {
            this.setData({
                bt_text: "保存提货人"
            })
        } else {
            this.setData({
                bt_text: "更换提货人"
            })
        }
    },

    onConfirmExchange: function (e) {
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
            // let cartList = this.data.cartList;
            // let mTarget = new Array();
            // cartList.forEach(ele => {
            //     mTarget.push({
            //         sku: ele.gcsSku,
            //         goodsCount: ele.goodsCount,
            //     });
            // });
            // let updateBean = {
            //     exchangeCode: this.data.exchangeCode,
            //     exchangeType: this.data.exchangeWay == "exchangeExpress" ? "MAIL" : "STORE",
            //     applyShop: this.data.exchangeWay == "exchangeExpress" ? "" : this.data.shopCode,
            //     consignee: this.data.cusName,
            //     contactTel: this.data.cusPhone,
            //     applyTargetList: mTarget,
            // }

            createExchangeOrder(exPostBean)
                .then(exchangeCode => {
                    wx.hideLoading();
                    //不论什么都进入审核页面，在审核页面在判断状态
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



            // updateExType(updateBean)
            //     .then(res => {
            //         wx.hideLoading();
            //         let exchangeCode = this.data.exchangeCode;
            //         switch (this.data.exchangeWay) {
            //             case "exchangeAtShopOnlineChoose":
            //                 //到店换货 之 在线选商品
            //                 wx.redirectTo({
            //                     url: `/exchangeGoods/prepareGoodsStatus/prepareGoodsStatus?exchangeCode=${exchangeCode}`,
            //                 })
            //                 break;
            //             case "exchangeExpress":
            //                 //邮寄换货 在线选商品
            //                 wx.redirectTo({
            //                     url: `/exchangeGoods/uploadTrackingNumber/uploadTrackingNumber?exchangeCode=${exchangeCode}`
            //                 })
            //                 break;
            //         }
            //     })
            //     .catch(e => {
            //         wx.hideLoading();
            //         wx.showModal({
            //             title: `提示`,
            //             content: `${e.message}`,
            //             showCancel: false,
            //         });
            //     });
        }
    },

    onCouponBarClick: function (e) {
        wx.showToast({
            title: 'TODO:进入优惠券页面',
        })
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