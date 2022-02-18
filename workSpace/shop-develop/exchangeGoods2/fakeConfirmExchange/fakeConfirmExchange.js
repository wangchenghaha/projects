import { createExchangeOrder, calcPrices2 } from '../ex'
import { throttle, calculatingInsuredPrice } from '../../utils/utils'
import { getProvincesThroughIP, cutProvince } from '../../service/location'
import { getNearbyShops, createMarkerList } from '../../service/shop'
import { EX_WAY_EXPRESS, EX_WAY_ATSHOP, EX_PROTOCOL, DEBUG, TYPE_NEARBY } from '../exCons'
let calcuCount = 0
let timer = null
let exPostBean = null

let mApplySource
let mTarget
let totalCount = 0
Page({
    /**
     * 页面的初始数据
     */
    data: {
        cusName: "",
        cusPhone: "",
        cusAddress: "",
        flagChangePeople: true,
        bt_text: "更换提货人",
        exchangeWay: EX_WAY_EXPRESS,

        protocalChecked: false,
        txtProtocolDetail: EX_PROTOCOL,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options)
        wx.showLoading({
            title: '加载中...',
        })
        mApplySource = new Array()
        mTarget = new Array()
        let { itemBean, tempPostBean, cartSingleBean, picPathList } = options
        let cartList = []
        if (cartSingleBean) {
            cartSingleBean = JSON.parse(cartSingleBean)
            cartList.push(cartSingleBean)
        }
        if (itemBean) {
            itemBean = JSON.parse(decodeURIComponent(itemBean))
        }
        if (picPathList) {
            picPathList = JSON.parse(picPathList)
        }
        exPostBean = JSON.parse(decodeURIComponent(tempPostBean))
        let goodsOrderList = []
        goodsOrderList.push(itemBean)
        goodsOrderList.forEach(ele => {
            ele.gsMainPicPath = ele.gscolPicPath.replace('https://cdn.bestseller.com.cn', '')
            ele.sku = ele.gcsSku
        })
        exPostBean.evidencePics = picPathList.join()
        exPostBean.exchangeType = "MAIL"
        exPostBean.consignee = itemBean.consignee
        exPostBean.contactTel = itemBean.contactTel
        // exPostBean.applySourceList.forEach(ele => {
        //     mApplySource.push({
        //         "sku": ele.gcsSku,
        //         "goodsOrderId": ele.goodsId,
        //         "goodsCount": ele.goodsCount,
        //     })
        //     console.log("  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  exPostBean.applySourceList.forEach   ele  ==")
        //     console.log(ele)
        // })
        // console.log(mApplySource)
        // exPostBean.applySourceList = mApplySource
        mApplySource = exPostBean.applySourceList
        cartList.forEach(ele => {
            totalCount += ele.goodsCount
            ele.sku = ele.gcsSku
            mTarget.push({
                sku: ele.gcsSku,
                goodsCount: ele.goodsCount,
            })
            console.log(">>>..>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  cartList.  mTarget.length  ==" + mTarget.length)
        })
        exPostBean.applyTargetList = mTarget

        this.setData({
            // exchangeWay: this.exchangeWay,
            cartList: cartList,
            // shopCode: shopCode,
            // exchangeCode: exchangeCode,
            // tempPostBean: tempPostBean,
            cusName: itemBean.consignee,
            cusPhone: itemBean.contactTel,
            cusAddress: itemBean.detailAddress,
            applyList: goodsOrderList,
            totalCount: totalCount,
        })
        wx.hideLoading()


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
        this.calculatePrice(postPrice)
        this._findSingleShop()
    },

    calculatePrice: function (postPrice) {
        let that = this
        calcPrices2(postPrice)
            .then(res => {
                if (timer) {
                    clearInterval(timer)
                }
                this.calcPriceProtection(res)
            })
            .catch(e => {
                timer = setInterval(function () {
                    ++calcuCount > 3 ? clearInterval(timer) : that.calculatePrice(postPrice)
                }, 700)
                if (calcuCount > 3) {
                    wx.hideLoading()
                    wx.showToast({
                        title: `${e.message}`,
                    })
                }
            })
    },

    calcPriceProtection: function (res) {
        let newCartList = calculatingInsuredPrice(this.data.cartList, res.goodsPriceList)

        this.setData({
            cartList: newCartList,
            newPrice: res.totalPrice.toFixed(2),
            oldPrice: res.sourceGoodsAmount.toFixed(2),
            diffPrice: res.additionalAmount.toFixed(2),
            absDiffPrice: Math.abs(res.additionalAmount).toFixed(2),
        })
    },


    onCusNameChange: function (e) {
        this.setData({
            cusName: e.detail.value,
        })
        exPostBean.consignee = e.detail.value
    },

    onCusPhoneChange: function (e) {
        this.setData({
            cusPhone: e.detail.value,
        })
        exPostBean.contactTel = e.detail.value
    },

    onChangePicker: function (e) {
        let isDisable = this.data.flagChangePeople
        console.log(isDisable)
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

    onGotoShopListClick: function () {
        let orderCode = exPostBean.oriorderCode
        let productCode = exPostBean.applyTargetList[0].sku
        wx.navigateTo({
            url: `/exchangeGoods2/shopList/shopList?intentType=${TYPE_NEARBY}&orderCode=${orderCode}&productCode=${productCode}`,
        })
    },

    onConfirmExchange: function (e) {
        if (throttle()) {
            if (!this.data.protocalChecked) {
                wx.showModal({
                    title: '提示',
                    content: '请阅读换货协议并同意',
                    showCancel: false,
                })
                return
            }
            wx.showLoading({
                title: '加载中...',
            })

            createExchangeOrder(exPostBean)
                .then(exchangeCode => {
                    wx.hideLoading()
                    //不论什么都进入审核页面，在审核页面在判断状态
                    wx.redirectTo({
                        url: `/exchangeGoods2/auditResults/auditResults?exchangeCode=${exchangeCode}`,
                    })
                })
                .catch(e => {
                    wx.hideLoading()
                    wx.showModal({
                        title: `提示`,
                        content: `${e.message}`,
                        showCancel: false,
                    })
                })

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
    },

    onExWayClick: function (ev) {
        console.log(ev)
        let way = ev.target.dataset.way
        this.setData({ exchangeWay: way })
        switch (way) {
            case EX_WAY_EXPRESS:
                exPostBean.exchangeType = "MAIL"
                break
            case EX_WAY_ATSHOP:
                exPostBean.exchangeType = "STORE"
                this._findSingleShop()
                break
        }
    },

    _findSingleShop: function () {
        if (this.data.singleShopBean) return
        wx.showLoading({
            title: '加载中'
        })
        getProvincesThroughIP()
            .then(result => {
                let addressBean = {
                    brandCode: getApp().config.brand,
                    city: result.ad_info.city,
                    district: result.ad_info.district,
                    province: cutProvince(result.ad_info.province),
                    longitude: result.location.lng,
                    latitude: result.location.lat,
                    pageNum: 1,
                    pageSize: 10,
                    distance: '20000',
                    sku: exPostBean.applyTargetList[0].sku
                }
                return getNearbyShops(addressBean)
            })
            .then(backBean => {
                let [firstShop] = backBean.list
                console.log(firstShop)
                exPostBean.applyShop = firstShop.shopCode
                this.setData({ singleShopBean: firstShop })
                wx.hideLoading()
            })
            .catch(e => {
                exPostBean.exchangeType = "MAIL"
                exPostBean.applyShop = ""
                wx.hideLoading()
                switch (this.data.exchangeWay) {
                    case EX_WAY_EXPRESS:
                        return
                    case EX_WAY_ATSHOP:
                        this.setData({ exchangeWay: 'exchangeExpress' })
                        wx.showToast({
                            title: `${e.message}`,
                        })
                        break
                }
            })
    },
})