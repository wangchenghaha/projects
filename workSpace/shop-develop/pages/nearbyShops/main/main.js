import { checkLocation, getCurrLocation, getProvincesThroughIP, getCoordinate, getProvincesThroughCoordinate, cutProvince } from '../../../service/location.js';
import { getNearbyShops, createMarkerList } from '../../../service/shop.js';
var CityJS = require('../../../utils/city.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
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
  onTabItemTap(item){
    app.gioTrack('pageclick_home_stores')
  },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        CityJS.init(this);
        this.mLongitude = 116.44355;
        this.mLatitude = 39.9219;
        let bean = {
            province: "北京市",
            city: "北京市",
            district:"朝阳区"
        }
        checkLocation()
            .then(res => {
                let promise = res ? Promise.resolve(getCurrLocation().then(res=>{
                //-------------- 测试代码 start ======================
                // res.longitude = 121.4737000000;
                // res.latitude = 31.230370000;
                //--------------- 测试代码  end -========================
                    return getProvincesThroughCoordinate(res.longitude, res.latitude);
                })):Promise.resolve(getProvincesThroughIP());
                return promise;
            })
            .then(result => {
                console.log("this is new location data===",result);
                this.mLongitude = result.location.lng;
                this.mLatitude = result.location.lat;
                bean = {
                    province: result.ad_info.province,
                    city: result.ad_info.city,
                    district:result.ad_info.district
                }
                this.changePickerThroughIP(bean);
                this.searchShopsList();
            })
            .catch(e => {
                this.changePickerThroughIP(bean);
                this.searchShopsList();
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
    onShow: function () {

    },

    changePickerThroughIP: function (bean) {
        console.log(">>>>>>>>**********  changePickerThroughIP ")
        console.log(bean)
        let proIndex = CityJS.getProvinceIndex(bean.province);
        this.setData({
            index1: Number(proIndex),
        });
        CityJS.change(1, proIndex, this);
        console.log("-----------------    proIndex=== "+proIndex)


        // let cityIndex = CityJS.getCityIndex(bean.city);
        // console.log("------------------      cityIndex  === "+cityIndex)
        // this.setData({
        //     index2: Number(cityIndex),
        // });
        // CityJS.change(2, cityIndex, this);

        // let districtIndex = CityJS.getDistrictIndex(bean.district);
        // CityJS.change(3, districtIndex, this);
    },


    //省 选择
    onPickerConfirm1: function (e) {
        console.log(e);
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
        console.log(e);
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
        console.log(">>>>>>>>..       searchShopsList involved .... ")
        let _index1 = this.data.index1;
        let _index2 = this.data.index2;
        let _index3 = this.data.index3;

        // let currProvince = this.data.currProvince;
        let province = this.data.proviceData[_index1].name;

        console.log(" >>> final province ========" + province);
        let city = this.data.cityData[_index2].name;
        let district = this.data.districtData[_index3].DisName;

        if (_index1 == 0) {
            wx.showModal({
                title: '提示',
                content: '请填写省或直辖市信息',
                showCancel: false
            });
        } else {
            province = cutProvince(province);
            city = _index2 === 0 ? '' : city,
            district = _index3 === 0 ? '' : district
            this.setData({
                tip1Str:_index3?`（${district}）`:"",
                hasShop: false,
                currentPage: 1,
                flagSearch: true,
                flagLoading: true,
                flagLoadingComplete: false,
                shopList: [],
                addressBean: {
                    brandCode: getApp().config.brand,
                    city,
                    district,
                    province,
                    longitude: this.mLongitude,
                    latitude: this.mLatitude,
                    pageNum: 1,
                    pageSize: 10,
                    distance: '20000',
                }
            });
            this.getShopList();
            getApp().gioTrack('pageload_store_filter', {  province, city, district })
        };
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
                        flagSearch: false,
                        totalPage: Math.ceil(backBean.size / 10),
                    });
                    console.log("getNearbyShops .....>>>>>> ++ backBean.size=" + backBean.size);
                    console.log("getNearbyShops .....>>>>>> ++ Math.ceil(backBean.size / 10)=" + Math.ceil(backBean.size / 10));
                }
                this.setData({
                    flagLoading: false,
                    flagLoadingComplete: this.data.currentPage >= this.data.totalPage,
                    hasShop: true,
                    shopList: this.data.flagSearch ? backBean.list : this.data.shopList.concat(backBean.list)
                });
                // this.createMarkers();//必须在获取了shoplist之后执行
                this.setData(createMarkerList(this.data.shopList));
                wx.hideLoading();
            })
            .catch(e => {
                wx.hideLoading();
                if (this.data.flagSearch) {
                    this.setData({
                        hasShop: false
                    });
                }
                wx.showToast({
                    title: `${e.message}`,
                })
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
        let currP = this.data.currentPage + 1;
        let addressBean = this.data.addressBean;
        addressBean.pageNum = currP;
        this.setData({
            flagSearch: false,
            flagLoading: true,
            currentPage: currP,
            addressBean: addressBean,
        });
        this.getShopList();
        console.log("------------addressBean.currentPage after =" + this.data.currentPage);
    },


    onShopsItemClick: function (e) {
        let currIndex = e.currentTarget.dataset.currIndex;
        let shopList = this.data.shopList;
        let transmitListRaw = new Array();

        //先添加一条
        let shopBean0 = shopList[currIndex];
        transmitListRaw.push(shopBean0);

        //再看有没有第二条可以添加
        if(currIndex + 1 >= shopList.length){
            //说明是最后一个条目，则看有没有前一条
            // if(currIndex==0){
            //     //没有前一条
            //     //直接传送
            //     // navToShopDetail
            // }else{
            //     //有前一条
            //     transmitListRaw.push(shopList[--currIndex]);
            // }

            if(currIndex>0){
                transmitListRaw.push(shopList[--currIndex]);
            }

        }else{
            //不是最后一个条目，直接把后一条目加入 transmitListRaw
            //add to list
            transmitListRaw.push(shopList[++currIndex]);
        }
        // let transmitList = JSON.stringify(transmitListRaw);
        // let transmitList = encodeURIComponent(JSON.stringify(transmitListRaw));
        // wx.navigateTo({
        //     // url: '/nearbyShops2/shopDetail/shopDetail?shopBean=' + shopBean
        //     url: '/nearbyShops2/shopDetail/shopDetail?shopBeanList=' + transmitList
        // })

        wx.setStorage({
            key: 'shop_detail_shopBeanList',
            data: transmitListRaw,
        });
        wx.navigateTo({
            url: '/nearbyShops2/shopDetail/shopDetail'
        })
    },




})
