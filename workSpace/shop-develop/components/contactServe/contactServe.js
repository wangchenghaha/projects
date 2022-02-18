// components/contactServe/contactServe.js
import {getCurrentUrl, judgeUrl, splitImg} from "../../utils/utils";
import { wxCopyText } from "../../utils/wxMethods";
import {awardActivity} from "../../service/order";
const app = getApp();
const {brand, CUSTOMER_WX_NAME, SERVER_HOT_LINE} = app.config;
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
    brand,
    serve:{
      img: brand === 'FOL' ? '' : splitImg('helpBounced.jpg'),
      wxNum: CUSTOMER_WX_NAME,
    },
    serveHotLine: SERVER_HOT_LINE
  },
  lifetimes: {
    attached: function() {
      // 在组件实例进入页面节点树时执行
      this.awardActivity();
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    awardActivity(){
      console.log(this.data.brand)
      let param = {
        orderType:0,
        pageType:1,
        pageAddress: 'pages/index/index'
      };
      awardActivity(param).then( res => {
        if(res && res.length){
          let {serve} = this.data;
          for(let item of res){
            if(item.pageRule){
              console.log(item)
              serve = {
                img: judgeUrl(item.imgUrl),
                wxNum: item.pageRule
              }
              this.setData({serve});
              break;
            }
          }
        }
      })
    },
    copy(){
      const {wxNum} = this.data.serve
      this.triggerEvent('copyName', wxNum)
      wxCopyText(wxNum)
    },
    save(){
      this.triggerEvent('saveImg')
      app.saveImage(this.data.serve.img)
    },
    close(){
      this.triggerEvent('closeServe', false)
    },
    call(){
      wx.makePhoneCall({
        phoneNumber: SERVER_HOT_LINE
      })
    }
  }
})
