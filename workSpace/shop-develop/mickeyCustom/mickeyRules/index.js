import main from "../base/mains.js"

Page({
  data: {
    alertType:"",
    loadImageList:[
      'https://alioss.woaap.com/bestseller/campaign2001/images/rules_bg.png',
      'https://alioss.woaap.com/bestseller/campaign2001/images/rules_back.png',
      'https://alioss.woaap.com/bestseller/campaign2001/images/rules_act_title.png',
      'https://alioss.woaap.com/bestseller/campaign2001/images/rules_game_title.png',
      'https://alioss.woaap.com/bestseller/campaign2001/images/rules_alert_bg.png',
      'https://alioss.woaap.com/bestseller/campaign2001/images/rules_game_text.png',
      'https://alioss.woaap.com/bestseller/campaign2001/images/rules_gift_text.png',
    ],
  },
  onLoad: function (options) {
    let {alertType} = options;
    this.setData({
      alertType,
    })
  },
  back(){
    main.navigateBack();
  }
})
