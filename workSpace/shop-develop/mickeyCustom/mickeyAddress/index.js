import API from '../api/index'
import main from "../base/mains.js"
import {urls} from "../base/url.js"

Page({
  data: {
    receive_name: "",
    receive_address: "",
    receive_phone: "",
    subAlert:false,
    record_id:'',
    saved:false, //是否保存过，如果保存过 隐藏提交按钮 不可编辑输入框
    loadImageList:[
      'https://alioss.woaap.com/bestseller/campaign2001/images/rules_bg.png',
      'https://alioss.woaap.com/bestseller/campaign2001/images/write_submit.png',
      'https://alioss.woaap.com/bestseller/campaign2001/images/write_title.png',
      'https://alioss.woaap.com/bestseller/campaign2001/images/rules_alert_bg.png',
      'https://alioss.woaap.com/bestseller/campaign2001/images/write_input_bg.png',
      'https://alioss.woaap.com/bestseller/campaign2001/images/write_sub_alert.png',
      'https://alioss.woaap.com/bestseller/campaign2001/images/write_sub_close.png',
    ],
    from:'',
  },
  onLoad: function (options) {
    wx.hideShareMenu()
    let {record_id, showOnly=false, from = ''} = options;
    this.setData({
      record_id,
      saved:showOnly,
      from,
    })
    if(showOnly){
      let reqData = {
        id: record_id,
      }
      main.request(API.getAddress, reqData, "GET").then(res => {
        let {errcode, errmsg} = res.data;
        if(errcode ==  0){
          let {user_name, address, phone} = res.data.data
          this.setData({
            receive_name: user_name,
            receive_address: address,
            receive_phone: phone,
          })
        } else {
          main.showToast(errmsg)
        }
        // console.log(res, res.data)
      })
    }

  },
  changeValue(e){
    console.log(e)
    let key = e.currentTarget.dataset.key;
    this.setData({
      [key]:e.detail.value
    })
  },
  close(){
    this.setData({
      subAlert:false,
    })
    if(this.data.from == 'luck'){
      main.navigateBack(2);
    }
    if(this.data.from == 'myGift'){
      main.navigateBack(3);
    }

  },
  submit(){
    if(this.data.receive_name == ""){
      main.showToast("收货人姓名不能为空");
      return;
    }
    if(this.data.receive_address == ""){
      main.showToast("收货地址不能为空");
      return;
    }
    // if(/^1[3456789]\d{9}$/.test(this.data.receive_phone)){
    if(!/^\d+$/.test(this.data.receive_phone)){
        main.showToast("联系电话格式错误")
        return;
    }
    let reqData = {
      user_name:this.data.receive_name,
      phone: this.data.receive_phone,
      address: this.data.receive_address,
      id: this.data.record_id,
    }
    main.request(API.disney, reqData, "POST").then(res => {
      let {errcode, errmsg} = res.data;
      if(errcode ==  0){
        this.setData({
          subAlert:true,
          saved:true
        })
      } else {
        main.showToast(errmsg)
      }
      // console.log(res, res.data)
    })

  }
})
