// components/footer/footer.js
import { sendWxCoupon } from '../../service/mini'
import { keepRecordInfo } from '../../service/init'
import { KEYSTORAGE } from '../../src/const'
import { splitImg } from '../../utils/utils'
const service = 'service', business = 'business';
const app = getApp();
const { brand, cdn, versionName, showUserServer } = app.config;
Component({
  /**
   * 组件的属性列表
   */
  properties: {  },

  /**
   * 组件的初始数据
   */
  data: {
    version: versionName,
    reportPhone: '12377',
    textList: [
      {
        value: '营业执照',
        type: business,
        show: true
      },
      {
        value: '用户服务协议及隐私政策',
        type: service,
        show: showUserServer
      }
    ],
    // 营业执照
    business: {
      show: false,
      img: `${cdn}/assets/h5/${brand}/image/Businesslicense.jpg`,
    },
    recordInfo: {},
    recordImg: splitImg('bah.png', 'common')
  },
  lifetimes: {
    attached: function () {
      this.getKeepRecordInfo();
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onClick(e){
      let eventType = e.currentTarget.dataset.type;
      switch (eventType){
        case business:
          this.showBusiness(e);
          break;
        case service:
          this.goService();
          break;
        case 'sendCoupon':
          this.sendWxCoupon();
          break;
      }
    },
    getKeepRecordInfo() {
      keepRecordInfo().then(res => {
        if(res && res[brand]){
          this.setData({recordInfo: res[brand]})
        }
      })
    },
    showBusiness(e){
      let business = this.data.business;
      business.show = !business.show;
      this.setData({business});
    },
    goService(e){
      wx.navigateTo({url: '/weMall/userService/userService'})
    },
    makePhone(){
      const {reportPhone} = this.data;
      if(reportPhone){
        wx.makePhoneCall({
          phoneNumber: reportPhone
        })
      }
      
    },
    sendWxCoupon: function () {
      if(brand === 'JACKJONES'){
        let openId = wx.getStorageSync(KEYSTORAGE.openid) || wx.getStorageSync('wxOpenID');
        if(openId){
          sendWxCoupon(openId).then(res => {}).catch(err => {
            console.log(err.message)
          })
        }
      }
    }
  }
})
