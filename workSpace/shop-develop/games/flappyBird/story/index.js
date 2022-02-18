// pages/flappyBird/story/index.js
const imgPath = `https://cdn.bestseller.com.cn/assets/common/${getApp().config.brand}/birdGame/`
Page({

    /**
     * 页面的初始数据
     */
    data: {
        autoPlay : true,

        imgs : [`${imgPath}/story1.jpg`,`${imgPath}/story2.jpg`,`${imgPath}/story3_1.jpeg`]

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
    },
    change(e){
        if (e.detail.current === 2){
            this.setData({
                autoPlay : false
            })
        }
    },
    btnTap(){
        wx.navigateTo({
            url: `../home/index`
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