import { EVENTS, KEYSTORAGE } from '../../src/const.js'
import { URL_CDN } from '../../src/const';
import { getRecommendCategory, getNearbyShopGoodsList } from '../../service/goods';
import { getCRMInfo } from '../../service/user'
import {wxShowToast} from '../../utils/wxMethods'
var Utils = require('../../utils/utils.js');
import { throttle } from '../../utils/utils';
import events from '../../src/events';
const app = getApp();
const brand = app.config.brand;
/* 是否可以下拉 */
let isPull = true;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        brand:brand,
        // 判断是否是iphoneX
        isIphoneX: getApp().globalData.isIPhoneX,
        multiTipList: [
            { imgUrl: URL_CDN.ICON_RIGHTS_AND_INTERESTS_1, title: "积分" },
            { imgUrl: URL_CDN.ICON_RIGHTS_AND_INTERESTS_2, title: "礼品" },
            { imgUrl: URL_CDN.ICON_RIGHTS_AND_INTERESTS_3, title: "优惠券" },
            { imgUrl: URL_CDN.ICON_RIGHTS_AND_INTERESTS_4, title: "抽奖" },
        ],
        shopGateImg: URL_CDN.PIC_NEARBY_SHOP_BG_2,
        shopActivityImg: URL_CDN.PIC_NEARBY_SHOP_ACTIVITY_DIAGRAM,
        falgShowMemCard: false,
        pageNum: 1,
        recommendGoodsList: {},
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        events.register(this, EVENTS.EVENT_CRMINFO);
        getApp().checkLogin();
        // let shopBeanList = JSON.parse(decodeURIComponent(options.shopBeanList));
        let shopBeanList = wx.getStorageSync('shop_detail_shopBeanList');
        this.setData({
            shopBeanList: shopBeanList,
        });
        wx.showLoading({
            title: `加载中...`,
            mask: true,
        });
        this._getNearbyShopGoodsList(1);
        // 暂时不用
        // getRecommendCategory()
        //     .then(rcList => {
        //         this.setData({
        //             recomdClassifyList: rcList,
        //         });
        //         let classifyId = this._interceptClassifyId(rcList[0].navigationUrl);
        //         let nearbyShopBean = {
        //             classifyId: classifyId,
        //             goodsName: '',
        //             sku: '',
        //             site: getApp().config.brand,
        //             pageNum: 1,
        //             pageSize: 10,
        //             shopCode: this.data.shopBeanList[0].shopCode,
        //             sortType: "2",
        //             sortDirection: "DESC",
        //         };
        //         return getNearbyShopGoodsList(nearbyShopBean);
        //     })
        //     .then(res => {
        //         // let recommendGoodsList = Utils.price(res.data, 'discountPrice', 'originalPrice');
        //         this.setData({
        //             recommendGoodsList: res.data,
        //             boolHasGoods: recommendGoodsList.length == 0 ? false : true,
        //         });
        //         wx.hideLoading();
        //     })
        //     .catch(e => {
        //         wx.hideLoading();
        //         console.log(e);
        //     });
        this._setCrmUserInfo()

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
    },


    _getNearbyShopGoodsList: function(_pageNum){
        let classifyId = this._interceptClassifyId("http://www.selected.com.cn/");
        let nearbyShopBean = {
            classifyId: classifyId,
            goodsName: '',
            sku: '',
            site: getApp().config.brand,
            pageNum: _pageNum,
            pageSize: 10,
            shopCode: this.data.shopBeanList[0].shopCode,
            sortType: "2",
            sortDirection: "DESC",
        };
        let {recommendGoodsList, pageNum} = this.data;
        getNearbyShopGoodsList(nearbyShopBean).then(res => {
            wx.hideLoading();
            console.log("recommendGoodsList............", recommendGoodsList);
            let data = res.data;
            if(recommendGoodsList.length > 0){
                recommendGoodsList = recommendGoodsList.concat(data);
            } else {
                recommendGoodsList = data;
            }

            if(pageNum > res.totalPage){
                isPull = false
            }
            console.log("recommendGoodsList............", recommendGoodsList);
            //recommendGoodsList = Utils.price(recommendGoodsList, 'discountPrice', 'originalPrice');
            this.setData({
                recommendGoodsList,
                boolHasGoods: recommendGoodsList.length == 0 ? false : true,
            });
        }).catch( err=>{
            wxShowToast(err)
            wx.hideLoading();
        })
    },

    /**
 * 生命周期函数--监听页面初次渲染完成
 */
    onReady: function () {
        let pages = getCurrentPages(); //获取加载的页面
        let currentPage = pages[pages.length - 1]; //获
        console.log(currentPage.data);
        //保存 data 数据到缓存，用于返回 
        // let shopBeanList = this.data.shopBeanList;
        // wx.setStorage({
        //     key: 'shop_detail_shopBeanList',
        //     data: shopBeanList,
        // });

        // let { longitude, latitude, shopNameCn } = this.data.shopBean;

        // let marker = getMarkerDefault(0, longitude, latitude, shopNameCn);
        // let markersList = new Array();
        // markersList.push(marker);
        // this.setData({ markers: markersList });

        // let pointsList = [{
        //     longitude: longitude,
        //     latitude: latitude,
        // }];
        // setTimeout(() => {
        //     this.setData({
        //         includePoints: pointsList,
        //     });
        // }, 3000);

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    handleEvent: function (event, type) {
        if (type === EVENTS.EVENT_CRMINFO && event) {
            this._setCrmUserInfo()
        }
    },

    _setCrmUserInfo: function () {
        //设置用户信息；
        let crmInfo = wx.getStorageSync(KEYSTORAGE.crmInfo);
        if (crmInfo) {
            let level = crmInfo.level;
            crmInfo.level = level.substring(0, level.indexOf('卡') + 1);
            let cardUrl = this._getMemberCardPicUrl(crmInfo.level);
            this.setData({
                crmInfo: crmInfo,
                cardUrl: cardUrl,
                falgShowMemCard: true,
            });
        } else {
            app.getCRMInfoFn();
        }
    },

    onGotoLogin: function () {
        getApp().checkLogin();
    },

    _interceptClassifyId: function (navigationUrl) {
        //https://www.selected.com.cn/goodsList.html?classifyIds=114779
        return navigationUrl.slice(navigationUrl.length - 6);
    },

    onTmplMakeCall: function (e) {

    },

    onCall: function (e) {
        this.onTmplShopPhoneCall();
    },

    onNav: function (e) {
        this.onTmplNavToShopClick();
    },

    onBrowseShopGoods: function (e) {
        let shopCode = this.data.shopBeanList[0].shopCode;
        let intentType = "fromShopDetailPage";
        wx.navigateTo({
            url: `/pages/goodsList/goodsList?intentType=${intentType}&&shopCode=${shopCode}`,
        })
    },

    onTmplShopPhoneCall: function (e) {
        // let phone = e.currentTarget.dataset.shopPhone; 
        // if (phone.indexOf("/") > 0) {
        //     let phoneList = phone.split("/");
        //     wx.showActionSheet({
        //         itemList: phoneList,
        //         success: res => {
        //             this._makePhoneCall(phoneList[res.tapIndex]);
        //         }
        //     });
        // } else {
        //     this._makePhoneCall(phone);
        // }

        let shopBean = e.currentTarget.dataset.shopBean;
        let phoneList = new Array();
        let phone = shopBean.o2oShopPhone;
        let cellp = shopBean.cellphone;
        if (phone) {
            if (phone.indexOf("/") > 0) {
                let list = phone.split("/");
                phoneList.push(...list);
            } else {
                phoneList.push(phone);
            }
        }
        if (cellp && getApp().config.brand != 'JACKJONES') {
            phoneList.push(cellp)
        }
        console.log(">>>>>>>>>>   phoneList===" + phoneList.toString());
        phoneList.length == 1 ? this._makePhoneCall(phoneList[0]) : wx.showActionSheet({
            itemList: phoneList,
            success: res => {
                this._makePhoneCall(phoneList[res.tapIndex]);
            }
        });
    },

    _makePhoneCall: function (phone) {
        phone ? wx.makePhoneCall({
            phoneNumber: phone,
        }) :
            wx.showModal({
                title: '提示',
                content: '该店铺暂无电话',
                showCancel: false,
            })
    },



    onTmplNavToShopClick: function (e) {
        console.log(e);
        if (Utils.throttle()) {
            let shopBean = e.currentTarget.dataset.shopBean;
            wx.openLocation({
                name: shopBean.shopNameCn,
                address: shopBean.address,
                latitude: shopBean.latitude,
                longitude: shopBean.longitude,
                scale: 28
            });
            // checkLocation()
            //     .then(authBoolean => {
            //         authBoolean ? getCurrLocation() : getProvincesThroughIP();
            //     })
            //     .then(res => {
            //         // let navBean = {
            //         //     mCurrLatitude: res.latitude,
            //         //     mCurrLongitude: res.longitude,
            //         //     shopBean: this.data.shopBean,
            //         // }
            //         // console.log("onNav >>>>>>  navBean ================");
            //         // console.log(navBean);
            //         // let param = JSON.stringify(navBean);
            //         // wx.navigateTo({
            //         //     url: `/pages/nearbyShops/navMap/navMap?navBean=${param}`,
            //         // });
            //     })
            //     .catch(e => {
            //         console.log(" shopDetails >>>>>>>");
            //         console.log(e);
            //     });
        }
    },

    //depracated
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

    _getMemberCardPicUrl: function (strLevel) {
        if (strLevel.indexOf("普") >= 0) {
            return URL_CDN.MEMBERSHIP_CARD_ORDINARY
        }
        else if (strLevel.indexOf("银") >= 0) {
            return URL_CDN.MEMBERSHIP_CARD_SILVER
        }
        else if (strLevel.indexOf("白金") >= 0) {
            return URL_CDN.MEMBERSHIP_CARD_PLATINUM
        } else {
            return URL_CDN.MEMBERSHIP_CARD_GOLDEN
        }
    },

    onGotoMemCenter: function (e) {
        getApp().globalData.showIconBackToShopDetail = true;
        wx.switchTab({
            url: '/pages/memberCenter/memberCenter',
        });
    },

    onGatePickClick: function (e) {

    },

    onActivityClick: function (e) {
        wx.switchTab({
            url: '/pages/informat/informat',
        });
    },

    onClassifySelect: function (e) {
        console.log(e);
        wx.showLoading({
            title: `加载中...`,
            mask: true,
        });
        let index = e.detail.index;
        let url = this.data.recomdClassifyList[index].navigationUrl;
        let classifyId = this._interceptClassifyId(url);
        let nearbyShopBean = {
            classifyId: classifyId,
            goodsName: '',
            sku: '',
            site: getApp().config.brand,
            pageNum: 1,
            pageSize: 10,
            shopCode: this.data.shopBeanList[0].shopCode,
            sortType: "2",
            sortDirection: "DESC",
        };
        getNearbyShopGoodsList(nearbyShopBean)
            .then(res => {
                let recommendGoodsList = Utils.price(res.data, 'discountPrice', 'originalPrice');
                this.setData({
                    recommendGoodsList: recommendGoodsList,
                    boolHasGoods: recommendGoodsList.length == 0 ? false : true,
                });
                wx.hideLoading();
            })
            .catch(e => {
                wx.hideLoading();
                console.log(e);
            });

    },

    onRecItemClick: function (e) {
        console.log(e);
        let colorCode = e.currentTarget.dataset.colorCode;
        let intentType = 'fromShopDetailPage';
        console.log(colorCode);
        wx.navigateTo({
            url: `/pages/content/content?colorCode=${colorCode}&intentType=${intentType}&shopCode=${this.data.shopBeanList[0].shopCode}`
        });
    },

    onTmplCopyShopAddress: function (e) {
        let address = e.currentTarget.dataset.address;
        wx.setClipboardData({
            data: address,
            success: (result) => {
                wx.showToast({
                    title: '地址已复制',
                    icon: 'none',
                });
            },
            fail: () => { },
            complete: () => { }
        });
    },

    onTmplGotoShopNav: function (e) {
        this.onNav();
    },

      /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(!isPull){
      wxShowToast('数据加载完毕');
      return;
    }
    let {pageNum} = this.data; 
    pageNum++;
    this.setData({
        pageNum
    })
    this._getNearbyShopGoodsList(pageNum);
  },


})