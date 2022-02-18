import { getNearbyShops, createMarkerList } from '../../service/shop';
import { checkAndGetProvincesInfo, getProvincesThroughIP, cutProvince } from '../../service/location';
var CityJS = require('../../utils/city');
import { throttle } from '../../utils/utils'
import { getRefundShopList } from '../ex'
import { DEBUG, TYPE_NEARBY, TYPE_REFUND } from '../exCons'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 判断是否是iphoneX
        isIphoneX: getApp().globalData.isIPhoneX,
        shopList: new Array(),
        index1: 0,
        index2: 0,
        index3: 0,
        hasShop: false,
        flagLoading: false,
        flagLoadingComplete: false,
        currentPage: 1,
        totalPage: 0,

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let { intentType, orderCode, productCode } = options
        this.intentType = intentType
        this.orderCode = orderCode
        this.productCode = productCode
        this.setData({ intentType: intentType })
        CityJS.init(this);
        getProvincesThroughIP()
            .then(res => {
                this.mLongitude = res.location.lng;
                this.mLatitude = res.location.lat;
                let bean = {
                    province: res.ad_info.province,
                    city: res.ad_info.city
                }
                this.changePickerThroughIP(bean);
                this.searchShopsList();
            })
            .catch(e => {
                console.log(e)
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
    onShow: function (option) {

    },

    changePickerThroughIP: function (bean) {
        let proIndex = CityJS.getProvinceIndex(bean.province);
        this.setData({
            index1: Number(proIndex),
        });
        CityJS.change(1, proIndex, this);

        let cityIndex = CityJS.getCityIndex(bean.city, this);
        this.setData({
            index2: Number(cityIndex),
            index3: 0
        });
        CityJS.change(2, cityIndex, this);
    },

    onItemShopClick: function (e) {
        if (throttle()) {
            let firstShop = this.data.shopList[e.currentTarget.id]
            let Page = getCurrentPages()[getCurrentPages().length - 2]
            let singleS = this.intentType == TYPE_NEARBY ? firstShop : {
                "shopCode": firstShop.storeCode,
                "shopNameNn": firstShop.name,
                "address": firstShop.address,
                "o2oShopPhone": firstShop.phone1,
                "distance": (parseFloat(firstShop.distance) / 1000).toFixed(1)
            }
            Page.setData({ singleShopBean: singleS })
            wx.navigateBack({ delta: 1 });
        }
    },

    onMapClick: function (e) {
        if (throttle()) {
            console.log(e);
            let index = e.currentTarget.id;
            let shopBean = this.data.shopList[index];
            wx.openLocation({
                name: shopBean.shopNameCn,
                address: shopBean.address,
                latitude: shopBean.latitude,
                longitude: shopBean.longitude,
                scale: 28
            });
        }
    },

    onShopPhoneCall: function (e) {
        let index = e.currentTarget.id;
        let o2oShopPhone = this.data.shopList[index].o2oShopPhone;
        let cellphone = this.data.shopList[index].cellphone;

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


    //省 选择
    onPickerConfirm1: function (e) {
        this.setData({
            index1: Number(e.detail.value),
            index2: 0,
            index3: 0
        });
        const current_value = e.detail.value;
        CityJS.change(1, current_value, this);
    },

    //市 选择
    onPickerConfirm2: function (e) {
        this.setData({
            index2: Number(e.detail.value),
            index3: 0
        });
        const current_value = e.detail.value;
        CityJS.change(2, current_value, this);
    },

    //地区 选择
    onPickerConfirm3: function (e) {
        this.setData({
            index3: Number(e.detail.value)
        });
        const current_value = e.detail.value;
        CityJS.change(3, current_value, this);
    },

    searchShopsList: function () {
        if (throttle()) {
            let _index1 = this.data.index1;
            let _index2 = this.data.index2;
            let _index3 = this.data.index3;

            let province = this.data.proviceData[_index1].name;
            let city = this.data.cityData[_index2].name;
            let district = this.data.districtData[_index3].DisName;

            if (_index1 == 0) {
                wx.showModal({
                    title: '提示',
                    content: '请填写省或直辖市信息',
                    showCancel: false
                });
            } else {
                province = cutProvince(province)
                let sku12 = this.productCode.substring(0, 15)
                this.addressBean = {
                    brandCode: getApp().config.brand,
                    city: _index2 == 0 ? '' : city,
                    district: _index3 == 0 ? '' : district,
                    province: province,
                    longitude: this.mLongitude,
                    latitude: this.mLatitude,
                    pageNum: 1,
                    pageSize: 40,
                    distance: 20000,
                    sku: sku12,
                    flag: 1 //1 查询有换货权限的门店
                }
                this.setData({
                    hasShop: false,
                    flagLoading: true,
                    flagLoadingComplete: false,
                    shopList: new Array(),
                });
                this.getShopList();
            };
        }
    },

    getShopList: function () {
        wx.showLoading({
            title: '加载中'
        });
        let rBean = {
            "ecsOrderID": this.orderCode,
            "coordinate": this.mLongitude + "," + this.mLatitude,
            "productCode": this.productCode
        }

        let nearBean = this.addressBean;

        let foo = this.intentType == TYPE_NEARBY ?
            Promise.resolve(getNearbyShops(nearBean)) :
            Promise.resolve(getRefundShopList(rBean))

        foo.then(res => {
            this.setData({
                flagLoading: false,
                flagLoadingComplete: true,
                hasShop: true,
                shopList: this.intentType == TYPE_NEARBY ? res.list : res
            });
            wx.hideLoading();
        })
            .catch(e => {
                console.log(e.message);
                wx.hideLoading();
                wx.showModal({
                    title: '提示',
                    content: `${e.message}`,
                    showCancel: false,
                });
            });
    },

})