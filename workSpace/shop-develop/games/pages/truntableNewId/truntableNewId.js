const app = getApp();
const cdn = app.config.cdn;
const brand = app.config.brand;


Page({
  data: {
    picUrl: `${cdn}/assets/common/${brand}/image/`,
    voteTitle: null,
  },
  voteTitle: function (e) {
    this.data.voteTitle = e.detail.value;
  },
  jump:function(){
    if (this.data.voteTitle){
      if (this.data.voteTitle.replace(/[^0-9.]/g, '')){
        if (this.data.voteTitle.length ==7){
          console.log('ok')
          wx.setStorageSync("zpId", this.data.voteTitle);
          wx.navigateTo({
            url: '/games/pages/truntableNew/truntableNew'
          });
        }else{
          wx.showToast({
            title: '输入有误',
            icon: 'loading',
            duration: 1500
          });
        }
      }else{
        wx.showToast({
          title: '请输入数字',
          icon: 'loading',
          duration: 1500
        });
      }
    }else{
      wx.showToast({
        title: '请输入7位Id号',
        icon: 'loading',
        duration: 1500
      });
    }
    console.log('5646456465')
    console.log(this.data.voteTitle)
  }
})
