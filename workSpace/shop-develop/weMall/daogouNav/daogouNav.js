// pages/userDaogou/daogouNav/daogouNav.js
import {splitImg, judgeUrl, dateIsOverDue, objToQuery} from '../../utils/utils'
import {getConfigJSON} from '../../service/init'
import {getSendCoupon} from "../../service/wsc";
import {weMemberOutLogin} from '../../service/weMember'
import {wxShowToast} from "../../utils/wxMethods";

const {URL_CDN, KEYSTORAGE} = require('../../src/const.js');
const app = getApp();
const {brand, WE_MEMBER_APP_ID, WE_MEMBER_BRAND} = app.config;
let curOptions = {};
let checked = false;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 判断是否是iphoneX
    isIphoneX: app.globalData.isIPhoneX,
    ulData: [
      {
        id: 1,
        imgSrc: splitImg('wsc_card1.jpg'),
        isShow: true,
        linkUrl: '/weMall/daogouMbList/daogouMbList',
        eName: 'click_推荐搭配',
        tdEventName: 'pageclick_wemall_recommend',
        // gioName: 'pageclick_share_recommend',
        gioName: 'pageclick_share_recommend',
      },
      {
        id: 2,
        imgSrc: splitImg('wsc_card2.jpg'),
        isShow: true,
        linkUrl: '/weMall/daogouXuanze/daogouXuanze',
        eName: 'click_自由组合',
        tdEventName: 'pageclick_wemall_combine',
        gioName: 'pageclick_share_free_combination'
      },
      {
        id: 10,
        imgSrc: splitImg('wsc_card10.jpg'),
        isShow: true,
        linkUrl: '/weMall/liveList/liveList',
        eName: 'click_weMall直播',
        tdEventName: 'click_weMall_live',
        gioName: 'pageclick_share_live'
      },
      {
        id: 12,
        imgSrc: splitImg('wsc_card_redbook.jpg'),
        isShow: false,
        linkUrl: '/weMall/redBook/list/list',
        eName: 'click_weMall小红书',
        tdEventName: 'click_weMall_xiaohognshu',
        gioName: 'pageclick_share_rec_redbook'
      },
      {
        id: 4,
        imgSrc: splitImg('wsc_card4.jpg'),
        isShow: true,
        linkUrl: '/pages/index/index',
        eName: 'click_转发单品',
        tdEventName: '',
      },
      {
        id: 5,
        imgSrc: splitImg('wsc_card5.jpg'),
        isShow: true,
        linkUrl: '/weMall/daogouYeji/daogouYeji',
        eName: 'click_业绩查询',
        tdEventName: 'pageclick_wemall_performance',
      },
      {
        id: 6,
        imgSrc: splitImg('wsc_card6.jpg'),
        isShow: true,
        linkUrl: '/weMall/daogouLearn/daogouLearn',
        eName: 'click_无师自通',
        tdEventName: 'pageclick_wemall_instruction',
        gioName: 'pageclick_share_wszt'
      },
      /*{
        id: 7,
        imgSrc: splitImg('wsc_card7.jpg'),
        isShow: true,
        linkUrl: '/weMall/guideVideo/guideVideo',
        eName: 'click_导购社区',
        tdEventName: '',
      },*/
      {
        id: 9,
        imgSrc: splitImg('wsc_card9.jpg'),
        isShow: false,
        linkUrl: '/pintuan/pintuanList/pintuanList',
        eName: 'click_weMall拼团',
        tdEventName: 'click_weMall_pintuan',
      },
      {
        id: 8,
        imgSrc: splitImg('wsc_card8.jpg'),
        isShow: false,
        linkUrl: '/weMall/sendCoupon/sendCoupon',
        eName: 'click_零售会员管理中心',
        tdEventName: 'click_weMember',
        appId: WE_MEMBER_APP_ID,
        path: 'pages/card/pages/cardReceipt/cardReceipt',
        jumpMini: false, // true 不跳
      },
      {
        id: 3,
        imgSrc: splitImg('wsc_card3.jpg'),
        isShow: true,
        linkUrl: '/weMall/daogouWshop/daogouWshop',
        eName: 'click_活动软文',
        tdEventName: 'pageclick_wemall_newcampaign',
        gioName: 'pageclick_share_activity'
      },
      // {
      //   id: 13,
      //   imgSrc: splitImg('wsc_upload_video.jpg', 'ONLY'),
      //   isShow: true,
      //   linkUrl: '/weMall/daogouUvideo/daogouUvideo',
      //   eName: 'click_活动软文',
      //   // tdEventName: 'pageclick_wemall_newcampaign',
      // },
    ],
    btnList: [
      {
        type: 'qrCode',
        image: '/images/daogou_qrcode.png',
        text: '我的二维码',
        bgColor: '#0da8c9',
        show: true,
      },
      {
        type: 'logout',
        image: splitImg('icon_logout.png', 'common'),
        text: '退出登录',
        bgColor: '#000',
        show: false
      }
    ],
    showTip: false,
    tipImg: splitImg('forward.gif?v=1'),
    weMall: {},
    checkArr: [
      {text: '我已知晓，7天内不再提醒'}
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.setData({ulData: translateArray(ulData,2)});
    /*清除掉公众号打开的导购模板存储的页面*/
    wx.removeStorageSync('sharePage');
    curOptions = options;
    this.isWeMemberLogin(options);
    this._collectData('login');
    this.getBrandConfig();
    // this.getCoupon();

  },

  isWeMemberLogin(options){
    wx.removeStorageSync(KEYSTORAGE.curPath);
    if(options.status !== 'login'){
      wx.switchTab({
        url: '/pages/weMember/weMember'
      })
    }
  },
  // 阻止跳转小程序
  stopJump(){
    wx.showModal({
      title: '提示',
      content: '即将隆重上线  敬请期待！',
      success (res) { }
    });
  },
  // 获取导购信息
  handleGuideInfo: function () {
    let {employeeId = ''} = wx.getStorageSync(KEYSTORAGE.guideInfo);
    let {btnList, ulData} = this.data;
    const phoneType = wx.getStorageSync(KEYSTORAGE.phoneType);
    const systemInfo = wx.getSystemInfoSync();
    if(employeeId.startsWith('FX')){
      const showItemArr = ['推荐搭配', '自由组合', '转发单品', '业绩查询'].map(item => item = `click_${item}`);
      ulData.forEach((item, index) => {
        item.isShow = showItemArr.includes(item.eName)
      });
      btnList[0].show = false;
      this.setData({ulData, btnList})
    }else{
      if(phoneType === 1){
        if(systemInfo && systemInfo.model && systemInfo.model.toUpperCase().includes('IPAD')){
          btnList[1].show = true;
          this.setData({btnList});
        }
      }
      const modifyID = 8;// 需要修改的索引
      ulData.forEach(item=> {
        if(item.id === modifyID){
          const queryObj = {
            key: wx.getStorageSync(KEYSTORAGE.sessionKey),
            employeeId,
            deviceType: wx.getStorageSync(KEYSTORAGE.deviceType),
            device: encodeURIComponent(systemInfo.model)
          };
          item.path += objToQuery(queryObj);
        }
      });
    }
    this.setData({ulData});
    try {
      app.tdSdkEvent('pageclick_home_shoppers', {
        GUIDE_DAID: guideInfo.employeeId,
        GUIDE_SHOP: guideInfo.shopCode,
        PHONE: guideInfo.MOBILE_PHONE || guideInfo.phone || '',
      })
    }catch (e) {}
  },
  // 导购发券
  getCoupon: function () {
    getSendCoupon().then(res => {
      if (res && res.sendCoupon) {
        let ulData = this.data.ulData;
        ulData[ulData.length - 1].isShow = res.sendCoupon.show;
        if (res.sendCoupon.list && res.sendCoupon.list.length) {
          this.setData({ulData})
        }
      }
    })
  },

  async getBrandConfig() {
    let { ulData} = this.data;
    let localWeMallTime = wx.getStorageSync('weMallTime');
    let {configJson = {}} = app.globalData;
    if(Object.keys(configJson).length === 0){
      configJson = await getConfigJSON();
      app.globalData.configJson = configJson
    }
    const {weMall, guideNavWeMemberShow, weMallPinTuan, WeMallLive, weMallRedBook = false} = configJson;
    for (let item of ulData) {
      if(item.eName.includes('零售会员管理中心')){
        item.isShow = guideNavWeMemberShow
      }
      if(item.eName.includes('拼团')){
        item.isShow = weMallPinTuan
      }
      if(item.eName.includes('小红书')){
        item.isShow = weMallRedBook
      }
      if(weMall && weMall.isShow){
        if (item.eName.includes('业绩查询')) {
          item.linkUrl += '?rankList=show';
        }
      }

    }
    if (weMall && weMall.isShow) {
      weMall.weMallImg = judgeUrl(weMall.weMallImg);
      if (localWeMallTime) {
        weMall.isShow = dateIsOverDue(localWeMallTime, 7);
      }
      this.setData({weMall})
    }
    this.setData({ ulData });
    this.handleGuideInfo();
    /*getConfigJSON().then(res => {
      console.log(app.globalData,'**')
    }).catch(err => console.error(err));*/
  },
  checkboxChange: function (e) {
    if (e.detail.value.length) {
      checked = true;
      wx.setStorageSync('weMallTime', Date.now())
    } else {
      checked = false;
      wx.removeStorageSync('weMallTime')
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.setStorageSync('shareCar', []);
    wx.setStorageSync('coverImg', '');
  },
  onClick: function (e) {
    let dataId = e.currentTarget.dataset.id;
    const dataType = e.currentTarget.dataset.type;
    switch (dataType) {
      case 'qrCode':
        this.daogouQRCode();
        break;
      case 'logout':
        this.logout();
        break;
      case 'close':
        this.setData({showTip: false});
        app.goBack();
        break;
      case 'back':
        app.gioTrack('pageclick_share_back')
        app.goBack();
        break;
    }
  },
  toNextPage: function (e) {
    let {index} = e.currentTarget.dataset;
    const navList = this.data.ulData;
    let {eName, linkUrl, tdEventName, gioName, id} = navList[index];
    try {
      if (tdEventName) {
        app.tdSdkEvent(tdEventName, {
          GUIDE_DAID: wx.getStorageSync(KEYSTORAGE.guideInfo).employeeId
        })
      }
      if(gioName){
        app.gioTrack(gioName)
      }
    } catch (e) {}
    if (id === 4) {
      this.setData({showTip: true});
    } else {
      wx.navigateTo({url: linkUrl});
    }
    this._collectData(eName)
  },
  weMallClick: function () {
    let {linkUrl} = this.data.weMall;
    if(linkUrl){
      app.navigateTo(linkUrl);
    }
    this.closeWeMall();
  },
  closeWeMall: function () {
    let {weMall} = this.data;
    weMall.isShow = false;
    this.setData({weMall})
  },
  logout: function () {
    let param = {
      key: wx.getStorageSync(KEYSTORAGE.sessionKey),
      brand: WE_MEMBER_BRAND[brand]
    };
    weMemberOutLogin(param).then(res => {
      app.goBack();
    }).catch(err => wxShowToast(err.message))
  },
  // 收集用户行为
  _collectData: function (eName) {
    let collectParam = Object.assign(curOptions, {eventName: eName});
    app._collectData2(collectParam);
  },
  daogouQRCode: function (e) {
    app.gioTrack('pageclick_share_myQR')
    wx.navigateTo({
      url: '/weMall/daogouQRCode/daogouQRCode'
    });

  }

})
