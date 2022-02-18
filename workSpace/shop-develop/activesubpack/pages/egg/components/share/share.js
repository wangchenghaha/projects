// activesubpack/pages/egg/components/share/share.js
/***
 * 展示图
 * 按钮
 */
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
    friendBtn: '',// 分享好友按钮图
    circleBtn: '',// 分享朋友圈图
    mainImageUrl: '',// 主图 显示图

    isShow: false, // 是否显示
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _shareCircle(){
      this.triggerEvent('sharecircle')
    },

    setShareConfig(obj){
      this.setData({
        friendBtn: obj.friendBtn || '',  // 分享好友按钮图
        circleBtn: obj.circleBtn || '',   // 分享朋友圈图
        mainImageUrl: obj.mainImageUrl || '', // 主图 显示图
      })
    },

    show(){
      this.setData({
        isShow: true
      })
    },

    close(){
      this.setData({
        isShow: false
      })
    }
  }
})
