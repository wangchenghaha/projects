// pintuan/components/chimaBounces/chimaBounces.js

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    selectType : String,
    //数据源
    bouncesData : Object,
    // 是否是参团
    isShare : Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 判断是否是iphoneX
    isIphoneX: getApp().globalData.isIPhoneX,
    money : 0,
    selectType : '',
    bouncesData : {},
    isShare : false,
    // 动画
    //动画效果
    animationOpacity:"",
    animationView:'',
    bgOpacity:1, //显示整体背景

  },
  ready:function(){
    var bouncesData = this.properties.bouncesData
    let selectType = this.properties.selectType
    var isShare = this.properties.isShare
    // console.log(`弹框接收的数据:${JSON.stringify(bouncesData)}`)

    var money = this.data.money
    if (selectType == 'center'){
      money = bouncesData.datas.color[bouncesData.defalutColor].price
    }
    else if (selectType == 'dandu'){
      money = bouncesData.datas.color[bouncesData.defalutColor].price
    }
    else{
      money = bouncesData.pintuanDatas.pintuanPrice
    }
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
    var offset = this.data.isIphoneX ? 34 : 0
    animationView.bottom(offset).step();

    this.setData({
      bgOpacity:1,
      animationOpacity: animationOpacity.export(),
      animationView:animationView.export(),
      bouncesData,
      isShare,
      selectType,
      money
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {

    // 选中事件
    onClick:function(e){
      let id = e.currentTarget.dataset.type;
      var name = e.currentTarget.dataset.name;
      var index = e.currentTarget.id;

      var bouncesData = this.data.bouncesData
      let sku = e.currentTarget.dataset.sku;
      switch (id) {
        case 'color':
        // let tempJson = {
        //   index,
        //   name,
        //   bouncesData
        // }
        //   this.triggerEvent('selectColor',tempJson)  
          break;
        case 'chima':
        bouncesData.buyNum = 1
        bouncesData.selectChima.index = index
        bouncesData.selectChima.name = name
        bouncesData.selectChima.sku = sku
        this.setData({
          bouncesData
        })
          break;
        case 'dandu':
        this.callBack(e,0);
        break;
        case 'pintuan':
        this.callBack(e,1);
        break;
        case 'jian':
        bouncesData.buyNum -= 1
        if (bouncesData.buyNum < 1){
          bouncesData.buyNum = 1
        }
        this.setData({
          bouncesData
        })
        break;
        case 'jia':
        if (bouncesData.selectChima.name != ''){
          bouncesData.buyNum += 1
          if (bouncesData.buyNum > bouncesData.kucuns[bouncesData.selectChima.sku]){
            bouncesData.buyNum = bouncesData.kucuns[bouncesData.selectChima.sku]
          }
          this.setData({
            bouncesData
          })
        }
        break;
      
        default:
          break;
      }
      // console.log(`选中的颜色:${JSON.stringify(selectColor)}`)
      // console.log(`选中的尺码:${JSON.stringify(selectChima)}`)
      
    },
    // 点击确定,回调参数
    callBack:function(e,index){
      if(this.data.bouncesData.selectChima.name == ''){
        wx.showModal({
          title: '提示', //提示的标题,
          content: '请选择尺码', //提示的内容,
          showCancel: false, //是否显示取消按钮,
          confirmText: '确定', //确定按钮的文字，默认为取消，最多 4 个字符,
          confirmColor: '#3CC51F', //确定按钮的文字颜色,
          success: res => {
            if (res.confirm) {
              console.log('用户点击确定')
            }
          }
        });
      }
      else{
        this.opacityHidden(e);
        var obj = {'selectColor':this.data.bouncesData.selectColor,'selectChima':this.data.bouncesData.selectChima,'buyNum':this.data.bouncesData.buyNum,'index':index}
        this.triggerEvent('callBack',obj)
      }
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
    setTimeout(() => {
      this.setData({
        bgOpacity:0,
      })
      this.triggerEvent('chimaHidden',e)
    }, 300);
    }
  }
  
})
