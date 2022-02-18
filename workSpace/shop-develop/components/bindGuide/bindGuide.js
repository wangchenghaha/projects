// components/bindGuide/bindGuide.js
import {wxShowToast} from "../../utils/wxMethods";
import {bindGuide} from "../../service/guide";
import {KEYSTORAGE} from '../../src/const'

const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value: false,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    guideText: ''
  },
  lifetimes: {
    ready() {
      console.log(this.properties.show, '***')
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /* 绑定导购 */
    bindGuide() {
      if (!app.checkLogin()) {
        return;
      }
      const {guideText} = this.data;
      if (!guideText) {
        wxShowToast('请输入导购号');
        return;
      }
      if (guideText.length !== 6) {
        wxShowToast('请输入正确的导购号');
        return;
      }
      wx.showLoading({
        title: '加载中',
        mask: true
      });
      try {
        app.tdSdkEvent('pageclick_home_shopperbind_bind', {GUIDE_DAID: guideText})
        app.gioTrack('pageclick_shoppers', {
          bind_Id: guideText,
          store_Id: ''
        })
      } catch (e) {
      }
      const {nickName, openId, unionId} = wx.getStorageSync(KEYSTORAGE.wxInfo)
      bindGuide(unionId, guideText, nickName, openId).then(res => {
        this.setData({
          guideText: '',
        });
        wxShowToast(res);
        this.cancelBindGuide();
      }).catch(e => {
        this.cancelBindGuide()
        wxShowToast(e.message);
      })
    },
    guideValue(e) {
      this.setData({
        guideText: e.detail.value
      })
    },
    cancelBindGuide() {
      this.setData({
        show: false,
      })
    },
  }
})
