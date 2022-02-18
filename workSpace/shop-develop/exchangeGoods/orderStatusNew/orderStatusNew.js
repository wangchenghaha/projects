import { getOrderExpressInfo, getExOrderDetail, confirmExchangeOrder, confirmReceiptExOr } from '../../service/order';
import { calcPrices } from '../../service/goods';
import { getProcessedCouponList } from "../../service/voucher";
var Utils = require('../../utils/utils');
let hasDiscountGoods = false;
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        orderStatus: "",
        processedSourceList: [],//已退回商品列表，需加 已入库 数量
        returnedTotalPrice: 0,

        alreadyReturnTotalCount: 0,
        alreadyStrorageTotalCount: 0,
        actualTargetTotalCount: 0,
        isFirstInit: true,
        expressPackNum: 1,

        expressPackageList: [[{
            done: true,
            current: false,
            text: "已发货",
            desc: "",
            expressOrderNo: "暂无",
            expressCompany: "顺丰速运",
        }, {
            done: true,
            current: true,
            text: "暂无物流信息",
            desc: "",
            expressOrderNo: "暂无",
            expressCompany: "顺丰速运",
        }]],
        imgUrl: `https://cdn.bestseller.com.cn/assets/common/pub/image/icon_in_transit_2.png`,

        // steps: [
        //     {
        //         done: true,
        //         current: false,
        //         text: '客服审核',
        //         desc: '10.01'
        //     },
        //     {
        //         done: false,
        //         current: false,
        //         text: '新商品发货'
        //     },
        // ],
        // stepsExpress: [
        //     {
        //         done: true,
        //         current: false,
        //         text: '[广州市]快件离开广州中心已发往北京\n2017-11-09 03:19:25',
        //     },
        //     {
        //         done: true,
        //         current: false,
        //         text: '[广州市]快件已到达广州中心\n2017-11-09 03:19:25',
        //     },
        // ],
        isShowCouponLayout:false,
        couponNum:0,//可用优惠券数量
        couponList:[],
        couponValue:0,//优惠券的值
        projeckName:  app.config.brand === 'SELECTED' ? 'detail-gender':'detailPage',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let exchangeCode = options.exchangeCode;
        this.setData({
            exchangeCode: exchangeCode,
        });
        let queryParam = {
            brandCode: getApp().config.brand,
            exchangeCode: exchangeCode,
        }
        try {
            wx.removeStorageSync('dingdanAddress');
        } catch (e) {
            console.log(e);
        }
        wx.showLoading({
            title: '加载中...'
        });
        //=============== 正式代码 start =======================
        getExOrderDetail(queryParam)
            .then(res => {
                if (res.exchangeType == "STORE" && res.status == "RECEIVED") {
                    wx.hideLoading();
                    wx.showModal({
                        title: '提示',
                        content: '此单已经线下换货，请在全部订单列表查找此笔订单详情',
                        showCancel: false,
                        success: function (res) {
                            wx.navigateBack({
                                delta: 1,
                            })
                        }
                    });
                    return
                }
                if (res.status == "SHIPPED" || res.status == "COMPLETE") {
                    this.getExpressNo(res.neworderCode);
                }
                this.setData({
                    exDetailBean: res,
                    orderStatus: res.status,
                    exchangeType: res.exchangeType,
                    addressBean: {
                        receiver: res.oriConsignee,
                        address: res.oriAddress,
                        tel: res.oriContactTel
                    }
                });
                this.processCountsAndPrices();
            })
            .catch(e => {
                wx.hideLoading();
                wx.showToast({
                    title: `${e.message}`,
                });
                // wx.navigateBack({
                //     delta: 1
                // });
            });
        //=============== 正式代码 end =======================



    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        this.setData({
            isFirstInit: false,
        });
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        //取本地订单地址
        let addressCache = wx.getStorageSync('dingdanAddress');
        if (addressCache.userName) {
            this.setData({
                addressCache: addressCache,
                addressBean: {
                    receiver: addressCache.userName,
                    address: addressCache.province + addressCache.city + addressCache.area + addressCache.detailAddress,
                    tel: addressCache.phone
                }
            });
        }
        if (!this.data.isFirstInit) {
            wx.showLoading({
                title: '加载中...'
            });
            let queryParam = {
                brandCode: getApp().config.brand,
                exchangeCode: this.data.exchangeCode,
            }
            getExOrderDetail(queryParam)
                .then(res => {
                    this.setData({
                        exDetailBean: res,
                        orderStatus: res.status,
                    });
                    if (!addressCache.userName) {
                        this.setData({
                            addressBean: {
                                receiver: res.oriConsignee,
                                address: res.oriAddress,
                                tel: res.oriContactTel
                            }
                        });
                    }
                    this.processCountsAndPrices();
                })
                .catch(e => {
                    wx.hideLoading();
                    wx.showModal({
                        title: '提示',
                        content: `未获取到换货单详情`,
                        showCancel: false,
                    });
                });
        }
    },

    processCountsAndPrices: function () {
        // 计算 数量 和 金额
        let applySourceList = this.data.exDetailBean.applySourceList;
        let actualSourceList = this.data.exDetailBean.actualSourceList;
        //计算已入库的数量信息
        let applySourceCount = 0;//申请数量
        let alreadyReturnTotalCount = 0;//已退回商品总件数
        let alreadyStrorageTotalCount = 0;//已入库商品总件数

        let processedSourceList = JSON.parse(JSON.stringify(applySourceList));//复制的申请源，准备添加入库信息
        let copyActualS = JSON.parse(JSON.stringify(actualSourceList));//复制的实际源
        processedSourceList.forEach(outterEle => {
            applySourceCount++;
            outterEle.alreadyStorageCount = 0;
            //每行可能有重复的 sku
            for (let i = 0; i < copyActualS.length; i++) {
                if (outterEle.sku == copyActualS[i].sku) {
                    outterEle.alreadyStorageCount = copyActualS[i].goodsCount;//增加入库信息
                    alreadyStrorageTotalCount += Number(copyActualS[i].goodsCount);
                    break;
                }
            }
        });
        actualSourceList.forEach(actualEle => {
            // actualEle.alreadyStorageCount = actualEle.goodsCount;//增加入库信息
            console.log("  ----------------- actualEle.alreadyStorageCount ===========" + actualEle.alreadyStorageCount);
            alreadyReturnTotalCount++;
        });

        this.setData({
            applySourceCount: applySourceCount,
            processedSourceList: processedSourceList,
            alreadyReturnTotalCount: alreadyReturnTotalCount,
            alreadyStrorageTotalCount: alreadyStrorageTotalCount,
        });

        let applyTargetList = this.data.exDetailBean.applyTargetList;
        let newGoodsList = new Array();
        applyTargetList.forEach(element => {
            newGoodsList.push({
                sku: element.sku,
                goodsCount: element.goodsCount,
            });
            if(parseFloat(element.originalPrice)>parseFloat(element.price)){
                //说明有打折商品
                hasDiscountGoods = true;
            }
        });
        let postPrice = {
            "exchangeCode": this.data.exchangeCode,
            "exchangeGoodsType": "ACTUAL_SOURCE",
            "newGoodsList": newGoodsList,
        }
        calcPrices(postPrice)
            .then(res => {
                wx.hideLoading();
                let newTargetList = Utils.calculatingInsuredPrice(applyTargetList,res.goodsPriceList);
                let exDetailBean = this.data.exDetailBean;
                exDetailBean.applyTargetList = newTargetList;
                this.setData({
                    exDetailBean:exDetailBean,
                    newTotalPrice: res.totalPrice.toFixed(2),
                    returnedTotalPrice: res.sourceGoodsAmount.toFixed(2),
                    stableTotalPrice: res.additionalAmount.toFixed(2),//不变的
                    actualTotalPrice: res.additionalAmount.toFixed(2),//变化的，可以加优惠券
                    actualTotalPriceABS: Math.abs(res.additionalAmount).toFixed(2),
                    totalCount: res.targetGoodsCount,
                    alreadyReturnTotalCount: res.sourceGoodsCount,
                    actualTargetTotalCount: res.targetGoodsCount,
                });

                if(this.data.orderStatus=="RECEIVED"){
                    getProcessedCouponList(this.data.newTotalPrice)
                    .then(bean=>{
                        this.setData({
                            couponNum:bean.couponNum,
                            couponList:bean.voucherList,
                        });
                    })
                    .catch(e=>{
                        console.log(e.message)
                    });
                }
            })
            .catch(e => {
                wx.hideLoading();
                console.log(e)
            });

       
    },



    onCouponBarClick:function(e){
        if(!getApp().config.discountGoodsUseVoucher){
            if(hasDiscountGoods){
              wx.showToast({
                title: '该订单有折扣商品不能使用优惠券',
                icon: 'none'
              });
              return
            }
        }
        if(this.data.couponNum==0){
            wx.showToast({
                title: '暂无可用优惠券',
                icon: 'none',
            });
            return
        }
        this.setData({
            isShowCouponLayout:true,
        });
    },

    onUseCouponItemClick:function(e){
        console.log(e);
        let couponNo = e.currentTarget.dataset.couponNo;
        let newTotalPrice = this.data.newTotalPrice;
        let stableTotalPrice = this.data.stableTotalPrice;
        let actualTotalPrice = this.data.actualTotalPrice;
        let actualTotalPriceABS = this.data.actualTotalPriceABS;
        let couponValue = this.data.couponValue;
        let couponList = this.data.couponList;
        //遍历 couponList，将其他券号的 item 的 isSelect 都设置为 false
        couponList.forEach(item=>{
            if(couponNo==item.voucherno){
                //判断门槛
                if(item.threshold){
                    if (parseFloat(newTotalPrice) < parseFloat(item.threshold)) {
                      wx.showToast({
                        title: `不满足使用条件`,
                        icon: 'none'
                      });
                      return;
                    }
                }
                actualTotalPrice = Utils.jianfa(stableTotalPrice,item.value);
                actualTotalPriceABS = Math.abs(actualTotalPrice).toFixed(2);
                couponValue = parseFloat(item.value).toFixed(2);
                item.isSelect = true;
            }else{
                item.isSelect = false;
            }
        });

        wx.showToast({
            title: `已选择${couponValue}元优惠券`,
            icon: 'none',
        });

        this.setData({
            couponValue:couponValue,
            couponList:couponList,
            actualTotalPrice:actualTotalPrice,
            actualTotalPriceABS:actualTotalPriceABS,
            isShowCouponLayout:false,
        });

    },

    onCouponClose:function(e){
        this.setData({isShowCouponLayout:false});
    },

    onAddressBarClick: function (e) {
        wx.navigateTo({
            url: '/pages/address/address'
        });
    },

    onPayOrConfirmClick: function (e) {
        if (Utils.throttle()) {
            wx.showLoading({
                title: '加载中...',
            });
            // let isPay = this.data.orderStatus == "RECEIVED";
            console.log(">>>>>>>>>>>>>>> this.data.orderStatus == " + this.data.orderStatus);
            let addressCache = this.data.addressCache;
            let confirmBean = {
                "exchangeCode": this.data.exchangeCode,
                "additionalPrice": this.data.actualTotalPrice,//已经减过优惠券
                "channelCode": "H5",
            };

            // 增加收货人信息字段
            if (addressCache) {
                confirmBean.consignee = addressCache.userName;
                confirmBean.contactTel = addressCache.phone;
                confirmBean.province = addressCache.province;
                confirmBean.city = addressCache.city;
                confirmBean.area = addressCache.area;
                confirmBean.detailAddress = addressCache.detailAddress;
            };
            // {
            //     "exchangeCode": "H4201806271522231001",
            //     "additionalPrice": 1,
            //     "channelCode": "H5",
            //     "consignee":"二狗子",
            //     "contactTel":"13812341234",
            //     "province":"北京",
            //     "city":"北京市",
            //     "area":"朝阳区",
            //     "detailAddress":"光华路5号世纪财富中心20层绫致时装",
            //     "couponNo":"aaa",
            //     "couponValue":1,
            //     "couponName":"bbb",
            //     "couponType":"ccc",
            //     "totalPrice":333
            // } 

            if(this.data.couponValue!=0){
                //如果使用了优惠券
                let couponItem = this.data.couponList.find(item=>{
                    return item.isSelect==true;
                  });
                  if(couponItem){
                      confirmBean.couponNo =couponItem.voucherno;
                      confirmBean.couponValue = couponItem.value;
                      confirmBean.couponName = couponItem.channel;
                      confirmBean.couponType = couponItem.type;
                      confirmBean.totalPrice = this.data.newTotalPrice;
                    }
            }
            
            confirmExchangeOrder(confirmBean)
                .then(res => {
                    // {
                    //     "code": 0,
                    //     "data": {
                    //         "additionalPrice": -1,
                    //         "exchangeCode": "H4201806251802161001",
                    //         "newOrderCode": "11420180625190520004",
                    //         "payToken": "1f9da32358650774dde48140a9d829a5",
                    //         "payTokenTime": 1529924722916,
                    //         "payType": "MORE",
                    //         "refundCode": "11420180625173418004"
                    //     },
                    //     "msg": "确认换货成功"
                    // }
                    wx.hideLoading();
                    let exchangeCode = res.exchangeCode;
                    if (this.data.actualTotalPrice > 0) {
                        //实际支付金额大于0 ，需要调起支付:
                        let bigorderCode = res.newOrderCode;
                        // let orderToken = res.orderToken;
                        let payToken = res.payToken;
                        let payTokenTime = res.payTokenTime;
                        let amountPaid = res.additionalPrice;
                        // let id = Data.data.bigOrderId;

                        // let querystring = `id=${id}&bigorderCode=${bigorderCode}&orderToken=${orderToken}&payToken=${payToken}&payTokenTime=${payTokenTime}&amountPaid=${amountPaid}`;
                        let querystring = `bigorderCode=${bigorderCode}&payToken=${payToken}&payTokenTime=${payTokenTime}&exchangeCode=${exchangeCode}&amountPaid=${amountPaid}&orderType=exchange&intentType=fromExOrderDetailPage`;
                        console.log(" >>>>>>>>>>>>>>>>>>>>>>>>>>>>>  准备去往 wxPay 页面 ...............");
                        console.log("querystring =======" + querystring);
                        wx.navigateTo({
                            url: `/pages/wxPay/wxPay?${querystring}`,
                        })
                    } else {
                        // wx.redirectTo({
                        //     url: `/exchangeGoods/orderStatusNew/orderStatusNew?exchangeCode=${exchangeCode}`
                        // })
                        let queryParam = {
                            brandCode: getApp().config.brand,
                            exchangeCode: exchangeCode,
                        }
                        getExOrderDetail(queryParam)
                            .then(res => {
                                this.setData({
                                    exDetailBean: res,
                                    orderStatus: res.status,
                                });
                                wx.hideLoading();
                            })
                            .catch(e => {
                                wx.hideLoading();
                                wx.showToast({
                                    title: `获取失败`,
                                });
                            });
                    }
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

    onConfirmReceipt: function (e) {
        if (Utils.throttle()) {
            wx.showLoading({
                title: "加载中...",
            });
            confirmReceiptExOr(this.data.exchangeCode)
                .then(res => {
                    this.setData({
                        exDetailBean: {},
                        orderStatus: '',
                    });
                    let queryParam = {
                        brandCode: getApp().config.brand,
                        exchangeCode: this.data.exchangeCode,
                    }
                    return getExOrderDetail(queryParam);
                })
                .then(res => {
                    this.setData({
                        exDetailBean: res,
                        orderStatus: res.status,
                    });
                    // this.processCountsAndPrices();
                    wx.hideLoading();
                })
                .catch(e => {
                    wx.hideLoading();
                    wx.showToast({
                        title: `${e.message}`,
                    })
                });
        }
    },

    getExpressNo: function (neworderCode) {
        //--------------------------------  正式代码  start ===================
        let that = this;
        getOrderExpressInfo(neworderCode)
            .then(expList => {
                console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>   get expList >>>>>>>>>>>>>>>>>>>>>>  ");
                console.log(expList);
                let expListLen = expList.length;//expList.length > 0
                //所以只有两种情况：1 expListLen==1    2 expListLen>1

                //1 expListLen==1 :
                //expressPackNum 设置为1
                //expressPackageList: targetList  长度为 1
                let targetList = new Array();
                for (let m = 0; m < expListLen; m++) {
                    let childList = expList[m].eChildList;
                    let childLen = childList.length;
                    let targetItemList = new Array();
                    if (childLen > 0) {
                        for (let k = 0; k < childLen; k++) {
                            //childList.length可能为 0 
                            targetItemList.push({
                                done: k == 0 ? true : false,
                                current: k == 0 ? true : false,
                                text: childList[k] ? childList[k].context : "",
                                desc: childList[k] ? childList[k].time : "",
                                // expressOrderNo: childList[k].lResultNu,
                                expressOrderNo: expList[m].expressOrderNo,
                                expressCompany: expList[m].expressCompany,
                            });
                        }
                    } else {
                        targetItemList = [{
                            done: true,
                            current: true,
                            text: "已发货",
                            desc: "",
                            expressOrderNo: expList[m].expressOrderNo,
                            expressCompany: expList[m].expressCompany,
                        }]
                    }
                    targetList[m] = targetItemList;
                }
                console.log(">>>>>>>>>>>>>>>>>>>>>>....  targetList ========");
                console.log(targetList);

                console.log(">>>>>>>>>>>>>>>>>>>>>>....  expListLenexpListLenexpListLen ===================================");
                console.log(expListLen);
                console.log(">>>>>>>>>>>>>>>>>>>>>>....  expressPackNum ===================================");
                console.log(this.data.expressPackNum);
                that.setData({
                    expressCompany: expList[0].expressCompany,
                    expressOrderNo: expList[0].expressOrderNo,
                    expressPackNum: expListLen,
                    expressPackageList: targetList,
                });
                console.log(this.data.expressPackNum);
            })
            .catch(e => {
                console.log(e);
                wx.hideLoading();
            });
        //--------------------------------  正式代码  end ===================
    }
})