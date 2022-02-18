import API from '../../api/index';
import main from "../../utils/utils";
/**
 * 弹框
 */
Component({
  options: {

  },
  properties: {
    showoption : {
      type : Object,
      value:{}
    },
    basecolor : {
      type : String,
      value : ''
    },
  },
  data: {
    imgUrl:API.CrmImgUrl,
  },
  attached() {
    var _this = this;
    let imgList = wx.getStorageSync("imgList");
    if(imgList){
      _this.setData({
        imgList: imgList
      });
    }else {
      main.getPictureList(API.getPictureList, '').then(res => {
        _this.setData({
          imgList: res.data.data,

        });
      });
    }
  },
  methods: {
    clicksure() {
      console.log('couponres----00000000000000000000000-->',this.data)
      this.triggerEvent('clicksure',this.data.showoption)
    },

  }
})