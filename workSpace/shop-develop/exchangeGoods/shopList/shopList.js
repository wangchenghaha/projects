import { getNearbyShops, createMarkerList } from '../../service/shop';
import {  checkAndGetProvincesInfo } from '../../service/location';
var CityJS = require('../../utils/city');
var Utils = require('../../utils/utils');
let orderBean = null;
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
        flagSearch: false,
        flagLoading: false,
        flagLoadingComplete: false,
        currentPage: 1,
        totalPage: 0,

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // let { exchangeCode } = options;
        let { tempPostBean } = options;
        orderBean = options.orderBean;
        this.setData({
            tempPostBean: tempPostBean,
        });
        CityJS.init(this);
        // checkLocation()
        checkAndGetProvincesInfo()
            // .then(res => {
            //     let promise = res ? Promise.resolve(getCurrLocation().then(res=>{
            //         return getProvincesThroughCoordinate(res.longitude, res.latitude);
            //     })):Promise.resolve(getProvincesThroughIP());
            //    return promise;
            // })
            .then(res => {
                this.mLongitude = res.location.lng;
                this.mLatitude= res.location.lat;
                let bean = {
                    province: res.ad_info.province,
                    city: res.ad_info.city
                }
                this.changePickerThroughIP(bean);
                this.searchShopsList();
            })
            .catch(e => {
                console.log(e);
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
        let cityIndex = CityJS.getCityIndex(bean.city);
        this.setData({
            index1: Number(proIndex),
            index2: Number(cityIndex),
            index3: 0
        });
        CityJS.change(1, proIndex, this);
        CityJS.change(2, cityIndex, this);
    },

    onItemShopClick: function (e) {
        if (Utils.throttle()) {
            console.log(e);
            let index = e.currentTarget.id;
            let shopBean = JSON.stringify(this.data.shopList[index]);
            let b = {
                mCurrLatitude: this.mLatitude,
                mCurrLongitude: this.mLongitude,
                shopBean: this.data.shopList[index],
            }
            let navBean = JSON.stringify(b);
            wx.navigateTo({
                // url: `/exchangeGoods/shopInfo/shopInfo?shopBean=${shopBean}&exchangeCode=${this.data.exchangeCode}&navBean=${navBean}`,
                url: `/exchangeGoods/shopInfo/shopInfo?shopBean=${shopBean}&orderBean=${orderBean}&tempPostBean=${this.data.tempPostBean}&navBean=${navBean}`,
            });
        }
    },

    onMapClick: function (e) {
        if (Utils.throttle()) {
            console.log(e);
            let index = e.currentTarget.id;
            // let b = {
            //     mCurrLatitude: this.data.mLatitude,
            //     mCurrLongitude: this.data.mLongitude,
            //     shopBean: this.data.shopList[index],
            // }
            // let navBean = JSON.stringify(b);
            // wx.navigateTo({
            //     url: `/exchangeGoods/shopsMap/shopsMap?navBean=${navBean}`,
            // })

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
        if (Utils.throttle()) {
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
                // 注意：四个直辖市要转成不带“市”的写法
                if ("北京市" == province || "上海市" == province || "天津市" == province || "重庆市" == province) {
                    province = province.substring(0, 2);
                    console.log(`原来的省已经改为${province}`);
                }
                this.setData({
                    hasShop: false,
                    currentPage: 1,
                    flagSearch: true,
                    flagLoading: true,
                    flagLoadingComplete: false,
                    shopList: new Array(),
                    addressBean: {
                        brandCode: getApp().config.brand,
                        city: _index2 == 0 ? '' : city,
                        district: _index3 == 0 ? '' : district,
                        province: province,
                        longitude: this.mLongitude,
                        latitude: this.mLatitude,
                        pageNum: 1,
                        pageSize: 10,
                        distance: 20000,
                        flag: 1 //查询有换货权限的门店
                    }
                });
                this.getShopList();
            };
        }
    },

    getShopList: function () {
        wx.showLoading({
            title: '加载中'
        });
        let postBean = this.data.addressBean;
        getNearbyShops(postBean)
            .then(backBean => {
                if (this.data.flagSearch) {
                    this.setData({
                        // flagSearch: false,
                        totalPage: Math.ceil(backBean.size / 10),
                    });
                }
                this.setData({
                    flagLoading: false,
                    flagLoadingComplete: this.data.currentPage >= this.data.totalPage,
                    hasShop: true,
                    shopList: this.data.flagSearch ? backBean.list : this.data.shopList.concat(backBean.list)
                });
                if (this.data.flagSearch) {
                    this.setData({ flagSearch: false });
                }
                // this.createMarkers();//必须在获取了shoplist之后执行
                // this.setData(createMarkerList(this.data.shopList));
                wx.hideLoading();
            })
            .catch(e => {
                console.log(e.message);
                wx.hideLoading();
                if (this.data.flagSearch) {
                    this.setData({
                        hasShop: false
                    });
                }
                wx.showModal({
                    title: '提示',
                    content: `${e.message}`,
                    showCancel: false,
                });
            });
    },

    onReachBottom: function (e) {
        console.log("------------onReachBottom---------------");
        console.log('this.data.currentPage==' + this.data.currentPage);
        console.log('this.data.totalPage==' + this.data.totalPage);
        if (this.data.currentPage >= this.data.totalPage) {
            this.setData({
                flagSearch: false,
                flagLoading: false,
                flagLoadingComplete: true,
            });
            return
        }
        this.setData({
            flagSearch: false,
            flagLoading: true,
            currentPage: ++this.data.currentPage,
        });
        this.getShopList();


        let addressBean = this.data.addressBean;
        addressBean.pageNum = this.data.currentPage;
        this.setData({
            addressBean: addressBean,
        });
        console.log("------------addressBean.currentPage after =" + this.data.currentPage);
    },

})