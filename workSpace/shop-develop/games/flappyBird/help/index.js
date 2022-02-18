// pages/flappyBird/help/index.js
const imgPath = `https://cdn.bestseller.com.cn/assets/common/${getApp().config.brand}/birdGame/`
import {help,searchUserInfo,createUser} from '../netWork'
import {EVENTS, KEYSTORAGE} from '../../../src/const'
import events from "../../../src/events"
const app = getApp();
let canTap = false
Page({

    /**
     * 页面的初始数据
     */
    data: {
        helpBgImg : `${imgPath}/helpBg.jpg`,
        helpImg : `${imgPath}/help_${app.config.brand}.png`,
        goHomeImg : `${imgPath}/goHome1.png`,

        // 来自分享的数据
        userData : {},
        // 当前用户的信息
        myUserData : {}
    },

    /**
     * 接受授权成功刷新页面
     */
     handleEvent: function (event, type) {
        if (type == EVENTS.EVENT_GAMECRMINFO && event) {
            //  获取手机号成功
            this.request()
        } 
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const json = JSON.parse(options.params)
        this.setData({
            userData : json
        })
        events.register(this, EVENTS.EVENT_GAMECRMINFO)

        app.setUtmOptions(json)
        canTap = false
    },
    tap(e){
        if (!canTap){
            return
        }
        const id = e.currentTarget.id
        if (id === `1`){
            // 支援
            if (Object.keys(this.data.userData).length > 0){
                var openID = wx.getStorageSync('wxOpenID');
                help({
                    friendOpenid : openID,   //打开链接人的openid
                    userId : this.data.userData.userid,   //发链接人的is
                    friendFacePic : this.data.myUserData.facePic,  //打开链接人的openid
                    nickName : this.data.myUserData.nickName  //打开连接人的nickname
                }).then(e => {

                })
            }
        } else if (id === '2'){
            
            // 去首页
            wx.navigateTo({
                url: `../home/index`
            });
        }
    },

    request(){

        let openID = wx.getStorageSync('wxOpenID');
        let myUserData = this.data.userData
        searchUserInfo(openID).then(res => {

            if (!res) {
                let wxInfo = wx.getStorageSync(KEYSTORAGE.wxInfo);
                let userInfo = wx.getStorageSync(KEYSTORAGE.gameCRMInfo)
                let phone = userInfo.phone
                if (phone.length == 12) {
                    phone = phone.substr(0, 11)
                }

                // 创建用户
                let json = {
                    phone: phone,
                    openid: openID,
                    nickName: wxInfo.nickName,
                    facePic: wxInfo.avatarUrl,
                    memberno: userInfo.memberno,
                    crmCreatedTime: userInfo.joindate
                }
                
                createUser(json).then(e => {
                    canTap = true
                    myUserData = e
                    this.setData({myUserData})
                })

            } else {
                canTap = true
                myUserData = res
                this.setData({myUserData});
            }

        })
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

        wx.showLoading({
            title: '加载中……',
            mask: true
          });
          setTimeout(() => {
            wx.hideLoading();
            if (!wx.getStorageSync(KEYSTORAGE.gameCRMInfo) || !wx.getStorageSync(KEYSTORAGE.wxPhone)){
              app.navigateTo('member/login/login?game=true')
              return;
            }
            else if (wx.getStorageSync(KEYSTORAGE.gameCRMInfo)){
                this.request()
            }
           
          }, 1000);
    },
    goHome(){
        app.goBack()
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