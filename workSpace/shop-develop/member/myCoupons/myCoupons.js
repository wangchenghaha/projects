// pages/main/index.js
const app = getApp();
//CDN地址
import { splitImg } from '../../utils/utils'
const brand = app.config.brand;

Page({
  data: {
    // 判断是否是iphoneX
    isIphoneX: getApp().globalData.isIPhoneX,
	  imgList: [
		  {
		  	brand: 'ONLY',
			  imgUrl: splitImg('my_coupon.jpg', 'ONLY')
		  },
		  {
			  brand: 'JACKJONES',
			  imgUrl: splitImg('my_coupon.jpg', 'JACKJONES')
		  },
		  {
			  brand: 'VEROMODA',
			  imgUrl: splitImg('my_coupon.jpg', 'VEROMODA')
		  },
		  {
			  brand: 'SELECTED',
			  imgUrl: splitImg('my_coupon.jpg', 'SELECTED')
		  },
		  {
			  brand: 'FOL',
			  imgUrl: splitImg('my_coupon.jpg', 'FOL')
		  },
	  ]
  },
  onLoad: function (options) {

  },
  handleData: function(){
    // 把当前品牌放第一个
	  let {imgList} = this.data;
	  imgList.forEach( (item, index) => {
      if(item.brand === brand){
        let curBrandList = imgList.splice(index, 1);
	      imgList = [...curBrandList, ...imgList]
      }
    });
    this.setData({imgList})
  },
  onReady: function () {

  },
  onShow: function (options) {
	  this.handleData();
    app.track()
    /* 统计代码 */
  },
  onHide: function () {
    // 页面隐藏
  },

  toCouponList: function (event) {
    const index = event.currentTarget.dataset.index;
	  let {imgList} = this.data;
    const curBrand = imgList[index].brand;
    wx.navigateTo({
      url: `/member/myCouponList/myCouponList?name=${app.config.ETO_BRAND[curBrand]}`
    });
  }
})
