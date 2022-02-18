// pages/components/bouncedView/bouncedView.js
import { getIMGList } from '../../../service/customization'

var index = 0

// 图片格式
const imgFormat = ['png','jpg','jpeg']
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    type : String

  },

  /**
   * 组件的初始数据
   */
  data: {
    // 没下载完不能点击图案
    canTouchTA : false,
    // 区分定制还是贴图
    type : '',
    // 弹框透明背景
    opacityView : '',
    bounecsViewAnimation : '',
    canShow : false,
    // 适配iphoneX
    iphoneXHeight : 0,
    // 键盘动画
    jpAnimation : '',
    // 控制输入框自动唤起
    auto_focus : {
      value : '',
      status : true
    },
    // 输入框字数
    strNum : 0,
    // 字号
    zihao : {
      index : 1,
      datas : [
        {
          number : '13',
          title : '小体'
        },
        {
          number : '18',
          title : '中体'
        },
        {
          number : '25',
          title : '大体'
        }
      ]
    },
    // 是否加粗
    isBold : false,
    // 颜色
    colors : {
      index : 0,
      datas : ["#ffffff","#bbbcbc","#75787a","#3c3935","#12181f",
      "#adc5e9","#4ba6db","#4599d8","#1b46b4","#bcd1ad","#bcd1ad",
      "#71d34c","#8eca77","#449731","#31702e","#f1f0aa","#fcf150",
      "#f8de4a","#edc041","#ec692c","#5c361a","#e39893","#e54a33",
      "#d84523","#722b2c","#dfbbe1","#d47cc8","#cc3392","#7e265f","#7b1777"]
    },
    // 字体 颜色 还是字号
    topTapIndex : -1,
    // 字体
    ziti : {
      index : 0,
      datas : [
        {title : '宋体',family : 'SimSun'},{title : '百度综艺简体',family : 'zyjt'},
        {title : '汉真广标',family : 'hzgb'},{title : '华康少女体',family : 'hksnt'},
        {title : '浪漫雅圆',family : 'yy'},{title : '蒙纳简超刚黑',family : 'cgh'},
        {title : '时尚中黑简体',family : 'zhjt'},{title : '苏新诗卵石体',family : 'lst'},
        {title : '粗汉体',family : 'cht'}
      ]
    },
    // 自定义图案
    zdyArrs : [{
      id : 999,
      pic : ''
    }],
    // 系列
    xilieArrs : {
      selectIndex : 0,
      number : 2,
      height : 330,
      datas : []
    },
    // 底部文字
    bottomDatas : {
      selectIndex : 0,
      datas : [
        {
          title : "自定义图案",
          width : 20,
          image : 'https://cdn.bestseller.com.cn/assets/wechat/JACKJONES/image/DZzdy.png',
          image_sel : 'https://cdn.bestseller.com.cn/assets/wechat/JACKJONES/image/DZzdy-sel.png'
        },
        {
          title : "图案",
          width : 20,
          image : 'https://cdn.bestseller.com.cn/assets/wechat/JACKJONES/image/DZtuan.png',
          image_sel : 'https://cdn.bestseller.com.cn/assets/wechat/JACKJONES/image/DZtuan-sel.png'
        },
        {
          title : "文字",
          width : 20,
          image : 'https://cdn.bestseller.com.cn/assets/wechat/JACKJONES/image/DZwenzi.png',
          image_sel : 'https://cdn.bestseller.com.cn/assets/wechat/JACKJONES/image/DZwenzi-sel.png'
        },
        {
          title : "保存并预览",
          width : 40
        }
      ]
    }

  },
  ready:function(){
    let xilieArrs = this.data.xilieArrs
    let type = this.data.type
    type = this.properties.type
    index = 0
    this.setData({type})

    let iphoneXHeight = this.data.iphoneXHeight
    let that = this
    wx.getSystemInfo({
        success: function(res){
          // console.log(`系统信息:${JSON.stringify(res)}`)
          if(res.model.substring(0, 8) === 'iPhone X'){
            // 分成3份
            xilieArrs.height = 490
            xilieArrs.number = 3
            iphoneXHeight = 68
          }
          else if(res.screenHeight >= 800){

            // 分成3份
            xilieArrs.height = 490
            xilieArrs.number = 3
            iphoneXHeight = 0
            
          }
          else{
            // 分成2份
            xilieArrs.height = 330
            xilieArrs.number = 2
            iphoneXHeight = 0
          }
          that.setData({xilieArrs,iphoneXHeight})
          that.getListData()
        }
    })
    let animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease'
    });
    animation.bottom((90 + this.data.iphoneXHeight) * (wx.getSystemInfoSync().windowWidth / 750)).step();
    this.setData({jpAnimation : animation.export()})

    // 字体下载
    this.data.ziti.datas.forEach(item => {
      let path = `url(https://cdn.bestseller.com.cn/assets/wechat/${getApp().config.brand}/fonts/${item.title}.ttf)`
      wx.loadFontFace({
        family: item.family,
        source: path
      });
    })

      let bottomDatas = this.data.bottomDatas
      bottomDatas.selectIndex = 1
      this.setData({bottomDatas})

  },

  /**
   * 组件的方法列表
   */
  methods: {
      // 获取数据
  getListData : function(){
    let str = 'graphic'
    if (this.data.type == '2'){
      str = 'label'
    }
    let xilieArrs = this.data.xilieArrs
    getIMGList({graphic_type : str}).then(item => {
      wx.hideLoading();

      item.forEach(item => {
        let json = {
          title : item.graphic_collection,
          datas : item.graphic_datas
        }
        xilieArrs.datas.push(json)
      });

      this.setData({xilieArrs,canTouchTA:true})
      this.fenArrs(0)
    }).catch(err => {
      wx.hideLoading();
    })
  },
    save : function(e){
      this.triggerEvent('save')
    },
    attr : function(e){

      let json = {
        font : this.data.zihao.datas[this.data.zihao.index].number,
        bold : this.data.isBold,
        zitiZh : this.data.ziti.datas[this.data.ziti.index].title,
        ziti : this.data.ziti.datas[this.data.ziti.index].family,
        color : this.data.colors.datas[this.data.colors.index]
      }
      this.triggerEvent('selectAttr',json)
    },
    submit : function(){
      if (this.data.auto_focus.value != '' && !this.data.auto_focus.status){
        let json = {
          text : this.data.auto_focus.value.replace(/\n/g,''),
          font : this.data.zihao.datas[this.data.zihao.index].number,
          bold : this.data.isBold,
          zitiZh : this.data.ziti.datas[this.data.ziti.index].title,
          ziti : this.data.ziti.datas[this.data.ziti.index].family,
          color : this.data.colors.datas[this.data.colors.index]
        }
        this.triggerEvent('selectTap',json)
      }
    },
    onClick : function(e){
      // console.log(`aaa:${JSON.stringify(e)}`)
      let type = e.currentTarget.dataset.type
      let id = e.currentTarget.id
      if (type == 'zdy'){
        let typeId = e.currentTarget.dataset.id
        let zdyArrs = this.data.zdyArrs
        if (typeId == 999){
          // 加号
          let that = this
          wx.chooseImage({
            count: 1,
            sizeType: ['compressed'],
            sourceType: ['album'],
            success (res) {
              // tempFilePath可以作为img标签的src属性显示图片
              // console.log(`相机/相册结果:${JSON.stringify(res)}`)
              let path = res.tempFiles[0].path

              var index= path.lastIndexOf(".");

              var ext = path.substr(index+1);

              if (imgFormat.includes(ext) || imgFormat.includes(ext.toUpperCase())){

                let json = {
                  id : index++,
                  pic : path
                }
                zdyArrs.splice(zdyArrs.length - 1,0,json)
                that.setData({zdyArrs})

              }
              else{
                wx.showModal({
                  title: '提示',
                  content: `仅支持${imgFormat.join(',')}格式`,
                  showCancel: false
                });
              }

            }
          })
        }
        else{
          // id,sku,pic
          this.triggerEvent('selectTap',zdyArrs[id])
        }
      }
      else if(type == "xilie"){
        let json = e.currentTarget.dataset.item
        this.triggerEvent('selectTap',json)
      }
    },
    cu : function(e){
      let isBold = this.data.isBold
      isBold = !isBold
      this.setData({isBold})

      this.attr()
    },
      bouncedViewTap : function(e){
        // console.log(`a:${JSON.stringify(e)}`)
        let type = e.currentTarget.dataset.type
        let id = e.currentTarget.id
        if (type == 'ziti'){
          let ziti = this.data.ziti
          ziti.index = id
          this.setData({ziti})
        }
        else if (type == 'yanse'){
          let colors = this.data.colors
          colors.index = id
          this.setData({colors})
        }
        else if (type == 'zihao'){
          let zihao = this.data.zihao
          zihao.index = id
          this.setData({zihao})
        }
        this.attr()
      },
      bouncedTap : function(e){
        // console.log(`a:${JSON.stringify(e)}`)
        let type = e.currentTarget.dataset.type
        let topTapIndex = this.data.topTapIndex
        if (type == 'ziti'){
          topTapIndex = 0
        }
        else if (type == 'yanse'){
          topTapIndex = 1
        }
        else if (type == 'zihao'){
          topTapIndex = 2
        }

        this.setData({canShow : true})
        let animation = wx.createAnimation({
          duration: 300,
          timingFunction: 'ease'
        });
    
        let animation1 = wx.createAnimation({
          duration: 300,
          timingFunction: 'ease'
        });
        animation.opacity(0.5).step();
        animation1.translateY(0).step();
    
        this.setData({
          opacityView : animation.export(),
          bounecsViewAnimation : animation1.export(),
          topTapIndex
        })
      },

    bouncesTap_colsed : function(){
      let animation = wx.createAnimation({
        duration: 300,
        timingFunction: 'ease'
      });

      let animation1 = wx.createAnimation({
        duration: 300,
        timingFunction: 'ease'
      });
      animation.opacity(0).step();
      animation1.translateY(500).step();

      this.setData({
        opacityView : animation.export(),
        bounecsViewAnimation : animation1.export()
      })
      var that = this
      setTimeout(() => {
        that.setData({canShow : false})
      }, 350);
    },
    topTap : function(e){
      let id = e.currentTarget.id
      let xilieArrs = this.data.xilieArrs
      xilieArrs.selectIndex = id
      this.setData({xilieArrs})

    },
    bottomTap : function(e){
      let id = e.currentTarget.id
      if (!this.data.canTouchTA && id == 1){
        return
      }
      let bottomDatas = this.data.bottomDatas
      bottomDatas.selectIndex = id
      this.setData({bottomDatas})
    },
    // inputTap : function(){
    //   let auto_focus = this.data.auto_focus
    //   auto_focus.status = true
    //   this.setData({auto_focus})
    // },
    inputEnd : function(e){
      // console.log(`键盘收回:${JSON.stringify(e)}`)

      let height = (90 + this.data.iphoneXHeight) * (wx.getSystemInfoSync().windowWidth / 750)


      let animation = wx.createAnimation({
        duration: 300,
        timingFunction: 'ease'
      });
      animation.bottom(height).step();



      let str = e.detail.value
      let auto_focus = this.data.auto_focus
      auto_focus.status = false

      if (str.indexOf('\n' != -1)){
        let arrs = str.split('\n')
        if (arrs.length > 2){
          str = arrs[0] + '\n' + arrs[1]
        }
      }
      auto_focus.value = str
      this.setData({auto_focus,strNum : str.length,jpAnimation : animation.export()})
    },
    inputLineChange : function(e){
      // console.log(`aaa:${JSON.stringify(e)}`)
      if (e.detail.lineCount > 2){
      }
    },
    inputChange : function(e){
      // console.log(`输入中:${JSON.stringify(e)}`)
      let curs = e.detail.cursor
      this.setData({strNum : curs})

    },
    bindfocus : function(e){
      // console.log(`键盘:${JSON.stringify(e)}`)
      let height = e.detail.height


      let animation = wx.createAnimation({
        duration: 300,
        timingFunction: 'ease'
      });
      animation.bottom(height).step();
      this.setData({jpAnimation : animation.export()})

    },
    fenArrs : function(cIndex){
      let xilieArrs = this.data.xilieArrs
      let number = xilieArrs.number
      let arrs = xilieArrs.datas[cIndex].datas

      let arrs1 = []
      let arrs2 = []
      let arrs3 = []
      arrs.forEach((item , index) => {
        if (number == 2){
          if (index % number == 0){
            arrs1.push(item)
          }
          else{
            arrs2.push(item)
          }
        }
        else{
          if (index % number == 0){
            arrs1.push(item)
          }
          else if (index % number == 1){
            arrs2.push(item)
          }
          else{
            arrs3.push(item)
          }
        }
      })
      arrs = []
      arrs.splice(0,0,arrs1)
      arrs.splice(1,0,arrs2)
      if (number == 3){
        arrs.splice(2,0,arrs3)
      }
      // console.log(`拆分后的数组:${JSON.stringify(arrs)}`)
      // console.log(`长度:${arrs.length}`)
      xilieArrs.datas[cIndex].datas = arrs
      this.setData({xilieArrs})
      if (cIndex+1 < xilieArrs.datas.length){
        this.fenArrs(cIndex+1)
      }
    }
  }
})
