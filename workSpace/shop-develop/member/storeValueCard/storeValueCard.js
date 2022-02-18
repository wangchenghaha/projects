import {splitImg} from '../../utils/utils'
import { KEYSTORAGE } from '../../src/const'
const app = getApp();
const {STORE_VALUE_PAGE_BG_COLOR, STORE_VALUE, STORE_VALUE_PATH, ETO_BRAND, brand} = app.config;
const day = new Date().getDate();
const hours = new Date().getHours();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    STORE_VALUE_PATH,
    STORE_VALUE,
    bgColor: STORE_VALUE_PAGE_BG_COLOR,
    headerImg: splitImg(`store_value_card_header.jpg?v=${day}${hours}`),
    mainImg: splitImg(`store_value_card.jpg?v=${day}${hours}`),
    ruleImg: splitImg(`store_value_card_rule.jpg?v=${day}${hours}`),
    descImg: splitImg(`store_value_card_desc.jpg?v=${day}${hours}`)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.setUtmOptions(options);
  },
  onClick() {
    const utmOptions = wx.getStorageSync(KEYSTORAGE.utmOptions);
    const utmObj = {};
    if(utmOptions && utmOptions.length){
      utmOptions.forEach(item => {
        if(item.key && item.key.startsWith('utm')){
          utmObj[item.key] = item.value;
        }
      })
    }
    app.gioTrack('pageclick_camp_button', {
      brand: ETO_BRAND[brand],
      share_flag: 'N',
      utm_source: utmObj.utmSource || '',
      utm_medium: utmObj.utmMedium || '',
      utm_term: utmObj.utmTerm || '',
      utm_campaign: utmObj.utmCampaign || '',
      camp_button: '立即充值'
    })
  },
  goBack() {
    app.goBack()
  }
})
