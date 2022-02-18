import { helpAdd } from '../../service/redBagCover'
import { wxShowToast } from '../../../utils/wxMethods'
import { KEYSTORAGE } from '../../../src/const'
import { createGameUser, queryGameUser } from '../common'
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 被助力人ID
    userId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {userId} = options;
    if (userId) {
      this.setData({
        userId
      })
    }
  },
  async helpHer(){
    if(!app.checkLogin()){
      return
    }
    const {userId} = this.data;
    const { nickName, openId, avatarUrl } = wx.getStorageSync(KEYSTORAGE.wxInfo)
    if(!userId){
      wxShowToast('用户不存在')
      return
    }
    const gameUser = await queryGameUser();
    if(!gameUser){
      return
    }
    const param = {
      friendFacePic: avatarUrl,
      friendOpenid: openId,
      nickName,
      userId
    }
    try {
      const helpRes = await helpAdd(param);
      debugger
      console.log(helpRes)
    }catch (err){
      wxShowToast(err.message)
    }


  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },




  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
