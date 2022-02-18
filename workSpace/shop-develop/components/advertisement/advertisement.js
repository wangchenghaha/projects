// components/advertisement/advertisement.js
import {splitImg, isToday} from "../../utils/utils";
import {wxCopyText} from "../../utils/wxMethods";
import  {gloryKing} from '../../service/index'
import  {fileIsExist} from '../../service/init'
import {wxLogin, unionIdByCode, getLzInfo} from '../../service/user'
import {EVENTS, KEYSTORAGE} from "../../src/const";
import {getCRMInfo} from "../../service/member";
import events from "../../src/events";
import {wxShowToast} from "../../utils/wxMethods";
const app = getApp();
const {brand, etoBrand, CHANNEL_ID} = app.config;
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isShow: Boolean,
    page:{
      type: String,
      value: '',
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    adImg: '',
    linkUrl: '',
    options: {},
    couponPage: ''
  },
  lifetimes: {
    ready(){
      this.loadImg()
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    async loadImg(){
      let adImg = '';
      let pages = getCurrentPages(); //获取加载的页面
      let currentPage = pages[pages.length-1]; //获取当前页面的对象
      if(this.properties.page === 'search'){
        adImg = splitImg('advertisement_0601.jpg');
      }else{
        adImg = splitImg('advertisement_0427.png');
      }
      // 根据utm_term加载图片
      const imgVersion = `${new Date().getDate()}${new Date().getHours()}${new Date().getMinutes()}`
      const termImg = splitImg(`${currentPage.options.utm_term.trim()}.png?v=${imgVersion}`);
      this.setData({
        options: currentPage.options,
        adImg: termImg
      })
      this.getCouponPage()
    },
    async getCouponPage(){
      const res = await gloryKing();
      const { options } = this.data;
      if(res.couponPage){
        this.setData({
          couponPage: res.couponPage[options.utm_term] || ''
        })
      }
    },
    goLink(){
      /*const couponPage = {
        ONLY: {
          all: 'businessCouponSubpack/pages/index/index?channel=channel60b474456b577&delivery_id=7899',
          new: 'businessCouponSubpack/pages/index/index?channel=channel6089087a110bf&delivery_id=7438',
          old: 'businessCouponSubpack/pages/index/index?channel=channel608909f7342d9&delivery_id=7441'

        },
        VEROMODA: {
          all: 'businessCouponSubpack/pages/index/index?channel=channel60b0c03158bc0&delivery_id=7895',
          new: 'businessCouponSubpack/pages/index/index?channel=channel608521e9b365c&delivery_id=7345',
          old: 'businessCouponSubpack/pages/index/index?channel=channel608522868b189&delivery_id=7347',
        }
      };*/
      const {options, couponPage} = this.data;
      app.tdSdkEvent('pageclick_camp_button', {
        // 是否分享进入
        share_flag: 'N',
        campaign_button: '领券',
        ...options
      })
      app.navigateTo(couponPage);
      /*let unionId = wx.getStorageSync(KEYSTORAGE.unionid);
      const {nickName = '', avatarUrl = ''} = wx.getStorageSync(KEYSTORAGE.wxInfo)
      if(!unionId || !nickName){
        const code = await wxLogin();
        wx.showLoading({
          title: '加载中...'
        });
        const wxInfo = await unionIdByCode(code);
        wx.setStorageSync(KEYSTORAGE.wxInfo, wxInfo);
        unionId = wxInfo.unionid
      }
      let crInfo = wx.getStorageSync(KEYSTORAGE.crmInfo);
      if(!crInfo){
        let param = {
          brand: etoBrand,
          unionId: wx.getStorageSync(KEYSTORAGE.unionid) || ''
        };
        wx.showLoading({
          title: '加载中...'
        });
        try {
          const {nickName = '', avatarUrl = ''} = wx.getStorageSync(KEYSTORAGE.wxInfo);
          const lzParam = {
            nickName, avatarUrl,unionId,
            openId: app.getOpenId(),
          };
          const lzInfo = await getLzInfo(lzParam);
          wx.setStorageSync(KEYSTORAGE.loginInfo, lzInfo);
          crInfo = await getCRMInfo(param);
          wx.hideLoading();
          wx.setStorageSync(KEYSTORAGE.crmInfo, crInfo);
        }catch (e) {
          // app.navigateTo('pages/search/search');
          wx.hideLoading();
          app.navigateTo(couponPage[brand].new);
          return
        }
      }
      app.navigateTo(couponPage[brand].old);*/
    },
    close(){
      this.setData({isShow: false})
    }
  }
})
