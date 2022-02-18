// components/saleSum/saleSum.js
import {salesView, getStaffSale } from "../../../service/saleState";
import {KEYSTORAGE} from "../../../src/const";
const {shopCodeArr} = getApp().config;
let employeeId = '';
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    employeeId: String,
    salesView: Array
  },
  /*
  * 组件生命周期函数，在组件布局完成后执行，此时可以获取节点信息
  * */
  ready: function(){
    employeeId = this.properties.employeeId;
    this.saleView();
  },

  /**
   * 组件的初始数据
   */
  data: {
    salesView:[],
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 导购业绩概览
    saleView() {
      let {shopCode} = wx.getStorageSync(KEYSTORAGE.guideInfo);
      if(shopCodeArr && shopCodeArr.includes(shopCode.toLocaleUpperCase())){
        return
      }
      let guideSaleView = wx.getStorageSync('guideSaleView');
      // 判断本地是否有销售数据
      if(guideSaleView){
        this.setData({salesView: guideSaleView})
      }else{
        this._getSalesView()
      }
    },
    _getSalesView(){
      let t1 = setTimeout( () => {
        wx.showLoading({
          title:'加载中',
          mask: true
        });
      }, 800);
      const timeObj = {
        day: '今日',
        week: '周至今',
        month: '月至今',
        year: '年至今',
      };
      salesView(employeeId).then(res => {
        let salesView =  [];
        if(res.length){
          res[0].time = 'day';
          for(let item of res){
            if(item.time === 'day'){
              item.saleName = timeObj.day;
              salesView.push(item);
              break;
            }
          }
        }
        // BI数据
        getStaffSale(employeeId).then(BIRes => {
          if(BIRes && Array.isArray(BIRes) && BIRes.length){
            for(let item of BIRes){
              if(item.time !== 'day'){
                item.saleName = timeObj[item.time];
                salesView.push(item)
              }
            }
          }else{
            salesView = [];
            for(let key in timeObj){
              salesView.push({
                saleName: timeObj[key],
                num: 0,
                money:0
              })
            }
          }
          clearTimeout(t1);
          wx.hideLoading();
          this.setData({salesView});
          // 把当前请求的数据存到本地
          wx.setStorageSync('guideSaleView', salesView);
        });
      }).catch(err => {
        clearTimeout(t1);
        wx.hideLoading();
        wx.showToast({
          title: err.message,
          icon: 'none',
          duration: 2000
        })
      })
    }
  }
});
