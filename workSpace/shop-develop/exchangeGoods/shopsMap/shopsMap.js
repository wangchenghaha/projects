var ShopUtil = require('../../service/shop.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {

        includePoints: [
        //     {
        //     longitude: 116.3730380000,
        //     latitude: 39.9114380000,
        // }, {
        //     longitude: 116.4721880000,
        //     latitude: 39.9094610000
        // }, {
        //     longitude: 116.4110000000,
        //     latitude: 39.9138700000
        // }
    ],

        //西单大悦城JJ:39.9114380000,116.3730380000
        //selected新世界百货：39.9094610000,116.4721880000
        //乐天银泰 ONLY:39.9138700000,116.4110000000
        markers: [
        //     {
        //     id: 0,
        //     latitude: 39.9114380000,
        //     longitude: 116.3730380000,
        //     label: {
        //         content: "西单大悦城 JJ",
        //         x: -30, y: -65,
        //         color: "#FF0000",
        //         fontSize: 12,
        //         borderWidth: 2,
        //         borderColor: "#000000",
        //         borderRadius: 7,
        //         bgColor: "#FFFFFF",
        //         padding: 7,
        //         textAlign: "center",
        //     }
        // }, {
        //     id: 1,
        //     latitude: 39.9094610000,
        //     longitude: 116.4721880000,
        //     label: {
        //         content: "新世界百货 Selected",
        //         x: -30,
        //         y: -65,
        //         color: "#FF0000",
        //         fontSize: 12,
        //         borderWidth: 2,
        //         borderColor: "#000000",
        //         borderRadius: 7,
        //         bgColor: "#FFFFFF",
        //         padding: 7,
        //         textAlign: "center",
        //     }
        // }, {
        //     id: 2,
        //     latitude: 39.9138700000,
        //     longitude: 116.4110000000,
        //     label: {
        //         content: "乐天银泰 ONLY",
        //         x: -30, y: -65,
        //         color: "#FF0000",
        //         fontSize: 12,
        //         borderWidth: 2,
        //         borderColor: "#000000",
        //         borderRadius: 7,
        //         bgColor: "#FFFFFF",
        //         padding: 7,
        //         textAlign: "center",
        //     }
        // },

        ]

    },

    // onMarkerClick: function (e) {
    //     var id = e.markerId;
    //     console.log(e);
    //     let lati = this.data.markers[id].latitude;
    //     let longti = this.data.markers[id].longitude;
    //     let name = this.data.markers[id].label.content;
    //     wx.openLocation({
    //         latitude: Number(lati),
    //         longitude: Number(longti),
    //         name: name,
    //         scale: 28,
    //     });
    // },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        //   --------------------需要接受如下的 navBean--------------------
        //   {
        //     "mCurrLatitude": 39.90469,
        //     "mCurrLongitude": 116.40717,
        //     "shopBean": {
        //         "address": "北京市海淀区清河永泰庄25号泰鑫源商厦四层思莱德专柜",
        //         "latitude": 116.219688,
        //         "longitude": 40.120438,
        //         "mapList": [],
        //         "shopCode": "39D0",
        //         "shopNameCn": "北京_海淀泰鑫源商厦_SLT"
        //     }
        // }
        console.log(`options.navBean===${options.navBean}`);
        let navBean = JSON.parse(options.navBean);
        this.setData({
            navBean: navBean,
        });
    },


    onButtonClick: function () {
        let pointsBean = this.data.points;
        this.mapCtx.includePoints({
            padding: [10],
            includePoints: pointsBean,
        })
    },


    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        // 使用 wx.createMapContext 获取 map 上下文
        // this.mapCtx = wx.createMapContext('mMap')

        let navBean = this.data.navBean;
        let pointsList = [{
            longitude: navBean.mCurrLongitude,
            latitude: navBean.mCurrLatitude,
        }, {
            longitude: navBean.shopBean.longitude,
            latitude: navBean.shopBean.latitude
        }];
        console.log(`pointsList=======${pointsList}`);
        this.setData({
            includePoints: pointsList,
        });

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        let { mCurrLongitude, mCurrLatitude, shopBean } = this.data.navBean;
        console.log(`mCurrLongitude===${mCurrLongitude}`);
        console.log(`mCurrLatitude===${mCurrLatitude}`);
        console.log(`shopBean===${shopBean}`);
        let shopName = shopBean.shopNameCn;
        let shopLongi = shopBean.longitude;
        let shopLati = shopBean.latitude;


        let marker = ShopUtil.getMarkerDefault(0, shopLongi, shopLati, shopName);
        let markersList = new Array();
        markersList.push(marker);
        this.setData({ markers: markersList });
        console.log("this.markers changed =>>>>>>>>>>>>>>>>>>>>>>>>>");
        console.log(this.data.markers);

        ShopUtil.getNavPath(mCurrLongitude, mCurrLatitude, shopLati, shopLongi)
            // ShopUtil.getNavPath(this.data.mLatitude, this.data.mLongitude, latitude, longitude)
            .then(polyList => {
                this.setData({
                    polyline: polyList,
                });
            })
            .catch(e => {
                console.log(e);
            });
    },


    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

})