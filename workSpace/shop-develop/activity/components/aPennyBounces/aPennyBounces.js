// activity/components/aPennyBounces/aPennyBounces.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    currentSelectIndex : Number,
    jsonDatas : Object,
    kucunArrs : Array
  },

  /**
   * 组件的初始数据
   */
  data: {
    currentSelectIndex : -1,
    jsonDatas : {},
    kucunArrs : [],
    //动画效果
    animationOpacity:"",
    animationView:'',

    imageUrl : '',  //图片
    colorArrs : [], //颜色分类
    chimaArrs : [],  //尺码分类
    kucunNum : 0,
    // 默认选中尺码
    defaultSelectSize : -1
  },
ready : function(){
  var jsonDatas = this.properties.jsonDatas
  var currentSelectIndex = this.properties.currentSelectIndex
  var kucunArrs = this.properties.kucunArrs

  this.setData({
    jsonDatas,
    currentSelectIndex,
    kucunArrs
  })
  this.didSelect()
  // console.log(`aaaaaaa:${JSON.stringify(jsonDatas[currentSelectIndex].color[jsonDatas[currentSelectIndex].default].thumImage)}`)

  // 启动动画
  var animationOpacity = wx.createAnimation({
      
    duration: 300,
    timingFunction: "ease",

  })
  var animationView = wx.createAnimation({
      
    duration: 300,
    timingFunction: "ease",

  })
  animationOpacity.opacity(0.5).step();
  animationView.bottom(0).step();

  this.setData({
    animationOpacity: animationOpacity.export(),
    animationView:animationView.export()
  })
},
  /**
   * 组件的方法列表
   */
  methods: {
    // 选中事件
    onClick:function(e){
      let index = e.currentTarget.id;
      let id = e.currentTarget.dataset.type;

      var jsonDatas = this.data.jsonDatas
      var type = ''
      switch (id) {
        case 'color':
          jsonDatas[this.data.currentSelectIndex].colorDefault = index
          jsonDatas[this.data.currentSelectIndex].sizeDefault = -1
          type = 'selectColor'
          break;
        case 'chima':
          jsonDatas[this.data.currentSelectIndex].sizeDefault = index
          type = 'selectChima'
          break;
      
        default:
          break;
      }
      this.triggerEvent(type,index)
      this.setData({jsonDatas})
      this.didSelect()
    },
    // 隐藏动画
    opacityHidden:function(e){
      
      var animationOpacity = wx.createAnimation({
          
        duration: 300,
        timingFunction: "ease",
  
      })
      var animationView = wx.createAnimation({
          
        duration: 300,
        timingFunction: "ease",
  
      })
      animationOpacity.opacity(0).step();
      animationView.bottom(-400).step();
  
      this.setData({
        animationOpacity: animationOpacity.export(),
        animationView:animationView.export()
      })
    },
    bouncesHidden:function(){
      this.opacityHidden()

      setTimeout(() => {
        this.triggerEvent('bouncesHidden')
      }, 300);
    },
    submit:function(){
      if (this.data.jsonDatas[this.data.currentSelectIndex].sizeDefault < 0){
        wx.showModal({
          title: '提示', //提示的标题,
          content: '请选择尺码', //提示的内容,
          showCancel: false, //是否显示取消按钮,
          confirmText: '确定', //确定按钮的文字，默认为取消，最多 4 个字符,
          confirmColor: '#3CC51F', //确定按钮的文字颜色,
          success: res => {
          }
        });
      }
      else{
        this.opacityHidden()

        setTimeout(() => {
          this.triggerEvent('bounceSubmit')
        }, 300);
      }
    },

    didSelect : function(){
      var jsonDatas = this.data.jsonDatas
      var currentSelectIndex = this.data.currentSelectIndex
      var kucunArrs = this.data.kucunArrs

      var imageUrl = this.data.imageUrl
      var colorArrs = this.data.colorArrs
      var chimaArrs = this.data.chimaArrs
      var kucunNum = this.data.kucunNum
    // console.log(`aaaaaaa:${jsonDatas[currentSelectIndex].colorDefault}`)
      imageUrl = jsonDatas[currentSelectIndex].color[jsonDatas[currentSelectIndex].colorDefault].image
      colorArrs = jsonDatas[currentSelectIndex].color
      chimaArrs = jsonDatas[currentSelectIndex].color[jsonDatas[currentSelectIndex].colorDefault].sizes

      let colorSKU = colorArrs[jsonDatas[currentSelectIndex].colorDefault].colorCode
      if (jsonDatas[currentSelectIndex].sizeDefault >= 0){
        let chimaSKU = chimaArrs[jsonDatas[currentSelectIndex].sizeDefault].sku

        kucunArrs.forEach(a=>{

          a[colorSKU].data.forEach(item=>{
            if (item.sku == chimaSKU){
              kucunNum = item.num
            }
          })
        })
      }
      else{
        kucunArrs.forEach(a=>{
          kucunNum = a[colorSKU].num
        })
      }
    
      this.setData({
        jsonDatas,
        currentSelectIndex,
        kucunNum,
    
        imageUrl,
        colorArrs,
        chimaArrs
      })

      // 尺码默认选中
      if(this.data.defaultSelectSize == -1){
        var selectIndex = -1
        kucunArrs.forEach(a=>{
          a[colorSKU].data.forEach((item,index)=>{
            if (item.num > 0 && selectIndex == -1){
              selectIndex = index
            }
          })
        })
        jsonDatas[this.data.currentSelectIndex].sizeDefault = selectIndex
    
        this.triggerEvent('selectChima',selectIndex)
        this.setData({
          defaultSelectSize : selectIndex,
          jsonDatas
        })
      }
    }
  }
})
