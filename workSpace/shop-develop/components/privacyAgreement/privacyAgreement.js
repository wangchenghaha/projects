const app = getApp();
const { appName } = app.config;
import { KEYSTORAGE } from '../../src/const'
import { initSDK } from '../../service/service'
import { splitImg } from '../../utils/utils'
import { wxShowToast } from '../../utils/wxMethods'
Component({
    /**
     * 组件的属性列表
     */
    properties: {

    },

    /**
     * 组件的初始数据
     */
    data: {
      appName,
      logo: splitImg('logo-white-69.png')
    },

    /**
     * 组件的方法列表
     */
    methods: {
      agreePrivacy(){
        wx.setStorageSync(KEYSTORAGE.AGREE_PRIVACY, true);
        app.goBack();
      },
      disagree(){
        wx.clearStorageSync();
        wx.showLoading();
        initSDK().then(res => {
          wx.hideLoading()
          app.goBack();
        }).catch(err => {
          console.log(err);
          wxShowToast('请重试');
        })
      },
      goClause(){
        app.navigateTo('weMall/userService/userService?tab=1')
      }
    }
})
