// pages/tujianView/tujianView.js
const imgPath = `https://cdn.bestseller.com.cn/assets/common/${getApp().config.brand}/attackNian/`

Page({

  /**
   * 页面的初始数据
   */
  data: {
    backImg : `${imgPath}backImg.png`,
    topImg : `${imgPath}tujian-topImg.png`,
    // 鼠、牛、虎、兔、龙、蛇、马、羊、猴、鸡、狗、猪
    datas : [
      {
        img : `${imgPath}tujian-img1.png`,
        subDatas : [
          {
            id : 1,
            name : '摇钱鼠',
            isunlock : false,
            defImg : `${imgPath}tujian_0_def.png`,
            sltImg : `${imgPath}tujian_0.png`
          },
          {
            id : 2,
            name : '牛将军',
            isunlock : false,
            defImg : `${imgPath}tujian_1_def.png`,
            sltImg : `${imgPath}tujian_1.png`
          }
        ]
      },
      {
        img : `${imgPath}tujian-img2.png`,
        subDatas : [
          {
            id : 3,
            name : '虎丞相',
            isunlock : false,
            defImg : `${imgPath}tujian_2_def.png`,
            sltImg : `${imgPath}tujian_2.png`
          },
          {
            id : 4,
            name : '登月兔',
            isunlock : false,
            defImg : `${imgPath}tujian_3_def.png`,
            sltImg : `${imgPath}tujian_3.png`
          }
        ]
      },
      {
        img : `${imgPath}tujian-img2.png`,
        subDatas : [
          {
            id : 5,
            name : '小龙女',
            isunlock : false,
            defImg : `${imgPath}tujian_4_def.png`,
            sltImg : `${imgPath}tujian_4.png`
          },
          {
            id : 6,
            name : '吉利蛇',
            isunlock : false,
            defImg : `${imgPath}tujian_5_def.png`,
            sltImg : `${imgPath}tujian_5.png`
          }
        ]
      },
      {
        img : `${imgPath}tujian-img2.png`,
        subDatas : [
          {
            id : 7,
            name : '马统领',
            isunlock : false,
            defImg : `${imgPath}tujian_6_def.png`,
            sltImg : `${imgPath}tujian_6.png`
          },
          {
            id : 8,
            name : '暖羊羊',
            isunlock : false,
            defImg : `${imgPath}tujian_7_def.png`,
            sltImg : `${imgPath}tujian_7.png`
          }
        ]
      },
      {
        img : `${imgPath}tujian-img2.png`,
        subDatas : [
          {
            id : 9,
            name : '孙小圣',
            isunlock : false,
            defImg : `${imgPath}tujian_8_def.png`,
            sltImg : `${imgPath}tujian_8.png`
          },
          {
            id : 10,
            name : '铁公鸡',
            isunlock : false,
            defImg : `${imgPath}tujian_9_def.png`,
            sltImg : `${imgPath}tujian_9.png`
          }
        ]
      },
      {
        img : `${imgPath}tujian-img2.png`,
        subDatas : [
          {
            id : 11,
            name : '科技狗',
            isunlock : false,
            defImg : `${imgPath}tujian_10_def.png`,
            sltImg : `${imgPath}tujian_10.png`
          },
          {
            id : 12,
            name : '猪小能',
            isunlock : false,
            defImg : `${imgPath}tujian_11_def.png`,
            sltImg : `${imgPath}tujian_11.png`
          }
        ]
      },
      
    ]
  },

  downLoadZT(){

    let _this = this
    // 字体下载
      let path = `url(${imgPath}江西拙楷.ttf)`
      wx.loadFontFace({
        family: 'jxzk',
        source: path,
        success: e => {

        }
      });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    this.downLoadZT()

    let tempDatas = wx.getStorageSync('attackNianBoxDatas');
    let datas = this.data.datas
    tempDatas.forEach(item => {
      datas.forEach(items => {
        items.subDatas.forEach(itemss => {
          if (item.zodiacId == itemss.id){
            itemss.isunlock = true
          }
        })
      });
    });
    this.setData({
      datas
    })
  },

  backTap(){
    wx.navigateBack({
      delta: 1
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  }
})