import { createExchangeOrder } from '../../service/order';
var Utils = require('../../utils/utils');
const strReg = /^(?!_)(?!.*?_$)[a-zA-Z0-9_\u4e00-\u9fa5]+$/;
Page({

    /**
     * 页面的初始数据
     */
    data: {
         // 判断是否是iphoneX
        isIphoneX: getApp().globalData.isIPhoneX,
        swithRequestStatus: 0,
        reason0Selected: false,
        reason1Selected: false,
        reason2Selected: false,
        reason3Selected: false,
        reasonStrList: ["尺码不符", "颜色不喜欢", "质量问题", "7天无理由退换货"],
        flagShowWay: true,
        ifShowPopReward: false,
        // steps: [
        //     {
        //         done: true,
        //         current: false,
        //         text: '客服审核',
        //         desc: '10.01'
        //     },
        // ],
        noShow: false,

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let orderBean = JSON.parse(options.orderBean);
        let goodsOrderList = orderBean.goodsOrderList;
        let goodsList = new Array();
        goodsOrderList.forEach(ele => {
            ele.checked = true;
            if (Number(ele.refundCount) + Number(ele.exchangeCount) < Number(ele.goodsCount)) {
                goodsList.push(ele);
            }
        });
        this.setData({
            orderBean: orderBean,
            goodsList: goodsList,//正式代码
            // goodsList: goodsOrderList,//测试代码
        });

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        let booleanNone = this.data.goodsList.length == 0;
        if (booleanNone) {
            wx.showModal({
                title: '提示',
                content: '该订单所有商品已经申请换货',
                showCancel: false,
                success: function (res) {
                    wx.navigateBack({
                        delta: 1,
                    });
                }
            });
        }
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },


    checkboxChange: function (e) {
        let index = e.currentTarget.id;
        console.log(">>>>>>>>>> index ==" + index);
        let goodsList = this.data.goodsList;
        goodsList[index].checked = !goodsList[index].checked;
        this.setData({
            goodsList: goodsList,
        });
    },


    //件数增加
    // onTmplCountIncrease: function (e) {
    //     console.log(e);
    //     // var numm = this.data.nums;
    //     // if (numm >= this.data.kucun_nums) {
    //     //     return;
    //     // };
    //     // numm++;
    //     // this.setData({
    //     //     nums: numm
    //     // });
    // },

    //件数减少
    // onTmplCountDecrease: function (e) {
    //     console.log(e);
    //     // var numm = this.data.nums;
    //     // if (numm == 0) {
    //     //     return;
    //     // }
    //     // numm--;
    //     // this.setData({
    //     //     nums: numm
    //     // });
    // },

    onSelectReason: function (e) {
        var itemId = parseInt(e.currentTarget.dataset.itemId);
        console.log("itemId =========" + itemId);
        switch (itemId) {
            case 0:
                this.setData({
                    reason0Selected: !this.data.reason0Selected
                });
                break;
            case 1:
                this.setData({
                    reason1Selected: !this.data.reason1Selected
                });
                break;
            case 2:
                this.setData({
                    reason2Selected: !this.data.reason2Selected,
                });
                break;
            case 3:
                this.setData({
                    reason3Selected: !this.data.reason3Selected
                });
                break;
        }
        this.setData({
            flagShowWay: !this.data.reason2Selected ,//暂时关闭到店换货
        });
    },

    onReasonInputChange: function (e) {
        this.setData({
            customReason: e.detail.value
        });
        console.log(this.data.customReason);
    },



    onExchangeInShop: function (e) {
        if (this._checkExchangeReason()&&Utils.throttle()) {
            let bean = this.generateTempPostBean();
            let tempPostBean = JSON.stringify(bean);
            let orderBean = JSON.stringify(this.data.orderBean);
            wx.navigateTo({
                // url: `/exchangeGoods/shopList/shopList?exchangeCode=${this.data.exchangeCode}`,
                url: `/exchangeGoods/shopList/shopList?tempPostBean=${tempPostBean}&orderBean=${orderBean}`,
            });
        }
    },

    onExchangeInExpress: function (e) {
        if (this._checkExchangeReason()&&Utils.throttle()) {
            let bean = this.generateTempPostBean();
            if(bean){
                let tempPostBean = JSON.stringify(bean);
                const  {goodsList, orderBean} = this.data;
                orderBean.goodsOrderList = goodsList.filter(item => item.checked);
                let orderBeanStr = JSON.stringify(orderBean);
                wx.navigateTo({
                    // url: `/exchangeGoods/goodsList/goodsList?exchangeCode=${this.data.exchangeCode}&exchangeWay=exchangeExpress`,
                    url: `/exchangeGoods/goodsList/goodsList?tempPostBean=${tempPostBean}&orderBean=${orderBeanStr}&exchangeWay=exchangeExpress`,
                });
            }
        }
    },

    _checkExchangeReason:function(e){
        let customReason = this.data.customReason;
        if (customReason) {
            customReason = Utils.filterStr(customReason);
            if (!strReg.test(customReason)) {
                wx.showModal({
                    title: '提示',
                    content: '换货理由包含特殊字符，请修改',
                    showCancel: false
                });
                return;
            }
        }
        let reasonStrList = this.data.reasonStrList;
        let reasonStr = (this.data.reason0Selected ? `"A":"` + reasonStrList[0] + `"` : ``)
            .concat(this.data.reason1Selected ? `,"B":"` + reasonStrList[1] + `"` : ``)
            .concat(this.data.reason2Selected ? `,"C":"` + reasonStrList[2] + `"` : ``)
            .concat(this.data.reason3Selected ? `,"D":"` + reasonStrList[3] + `"` : ``)
            .concat(customReason ? `,"E":"` + customReason + `"` : ``);
        if (reasonStr.indexOf(`,`) == 0) {
            reasonStr = reasonStr.substring(1);
        }
        if (reasonStr.lastIndexOf(`,`) == reasonStr.length - 1) {
            reasonStr = reasonStr.substring(0, reasonStr.length - 1);
        }

        if(this.data.reason0Selected||this.data.reason1Selected||this.data.reason2Selected
            ||this.data.reason3Selected||reasonStr.trim()){
                reasonStr = `{` + reasonStr + `}`;
                this.data.reasonStr = reasonStr;
                return true;
        }
        wx.showModal({
            title: '提示',
            content: '请选择换货理由',
            showCancel: false
        });
        return false;
    },


    // commitExchange: function (e) {
    //     if (Utils.throttle()) {
    //         let bean = this.generateTempPostBean();
    //         console.log(">>>>>>>>>>>>>>>>>>> 换货单 post 生成 >>>>>>>>>>");
    //         createExchangeOrder(bean)
    //             .then(exchangeCode => {
    //                 wx.hideLoading();
    //                 wx.redirectTo({
    //                     url: `/exchangeGoods/auditResults/auditResults?exchangeCode=${exchangeCode}`,
    //                 })
    //                 console.log(`申请换货单成功，准备跳转到 。。。 exchangeCode = ${exchangeCode}`);
    //             })
    //             .catch(e => {
    //                 wx.hideLoading();
    //                 wx.showModal({
    //                     title: `提示`,
    //                     content: `${e.message}`,
    //                     showCancel: false,
    //                 });
    //             });
    //     }
    // },

    generateTempPostBean: function () {
        let reasonStr = this.data.reasonStr;
        let applySourceList = new Array();
        let goodsList = this.data.goodsList;
        goodsList.forEach(ele => {
            if (ele.checked) {
                // applySourceList.push({
                //     "sku": ele.gcsSku,
                //     "goodsOrderId": ele.goodsId,
                //     "goodsCount": ele.goodsCount,
                // });
                ele.sku = ele.gcsSku;
                applySourceList.push(ele);
            }
        });
        let bean = {
            "brandCode": getApp().config.brand,
            "channelId": 1,
            "oriorderCode": this.data.orderBean.bigorderCode,
            "mainPicPath": this.data.goodsList[0] ? this.data.goodsList[0].gscolPicPath : "",
            "exchangeReason": reasonStr,
            "applySourceList": applySourceList
        };
        return bean;
    },

    onRewardClick: function () {
        this.setData({ ifShowPopReward: true });
    },

    onNavToFQImg: function (e) {
        if (Utils.throttle()) {
            wx.navigateTo({
                url: '/exchangeGoods/rewardPic/rewardPic',
            });
        }
    },

    onFAQCancel: function (e) {
        this.setData({ ifShowPopReward: false });
    }

})


