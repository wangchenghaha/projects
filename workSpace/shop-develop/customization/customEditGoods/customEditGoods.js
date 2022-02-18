// pages/privateCustomView/privateCustomView.js
import{privateSaveImage} from "../privateSaveImage"
import { splitImg,objToQuery } from '../../utils/utils'
import {uploadImage} from "../../service/upload";
import { URL } from '../../src/const.js'
// 上传图片路径

const upLoadPath = {
  moduleName : `/assets/wechat/${getApp().config.brand}/dingzhi/`
}
const systemInfo = {
  vWidth : wx.getSystemInfoSync().windowWidth,
  vHeight : wx.getSystemInfoSync().windowHeight
}
var moreAreaArrs = {
  0 : [],
  1 : []
} //记录超出区域id
var tiebiaoMaxNum = 99999  //控制贴标最大数量
import {getCustomizationlimitJson} from '../../service/customization'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 遮罩层相关
    touming : 0.3,
    systemInfo : {
      vWidth : wx.getSystemInfoSync().windowWidth,
      vHeight : wx.getSystemInfoSync().windowHeight
    },
    // 中间显示的文字
    centerStr : '',
    calueStrJson : {},
    fixedRightArr: [
      {
        type: 'home',
        img: splitImg('icon_home.png', 'common'),
        isShow: true,
      }
    ],
    // 上传图片
    upLoadArrs : [],
    // 区分定制还是贴图
    type : '',
    // 商品数据
    jsonData : '',
    // slider
    isSlider : false,
    // 是否是删除
    isDelete : false,
    // 是否超过区域
    isMoreArea : false,
    // 拖图区域
    vWidth : 0,
    // 缩放时不可移动
    isScale : false,
    // swiperIndex
    swiperIndex : 0,
    // 正反面
    zfArrs : {
      titles : ["正面","背面"],
      selectIndex : 0,
      bgImage : [
        {
          top : 0,
          bottom : 0,
          left : 0,
          right : 0,
          width : 0,
          height : 0,
          image : ''
        },
        {
          top : 0,
          bottom : 0,
          left : 0,
          right : 0,
          width : 0,
          height : 0,
          image : ''
        }
      ]
    },
    // 图片组数据
    imageArrs : {
      0 : [],
      1 : []
    },
    // 轮播图片高度
    swiperImageHeight:0

  },
  onClick: function(e){
    let type = e.currentTarget.dataset.type;
    switch(type){
      case 'home':
        getApp().goBack();
        break;
    }
  },
  // 获取图片高度
  getImageHeight : function (e) {
      var imgh=e.detail.height;
      var imgw=e.detail.width;
      var swiperH=systemInfo.vWidth*imgh/imgw;
  
      this.setData({swiperImageHeight : swiperH});
  },
  // 正反面按键
  zfTap : function(e){
    let id = e.currentTarget.id
    let zfArrs = this.data.zfArrs
    zfArrs.selectIndex = parseInt(id)
    this.setData({
      zfArrs,
      swiperIndex : id
    })
    let centerStr = '快来给我设计图案吧'
    let a = zfArrs.bgImage[zfArrs.selectIndex].left + zfArrs.bgImage[zfArrs.selectIndex].top + zfArrs.bgImage[zfArrs.selectIndex].right + zfArrs.bgImage[zfArrs.selectIndex].bottom
    if (a == 2){
      centerStr = '暂未开放定制区域哟'
    }
    this.setData({centerStr})
  },
  stopTouchMove: function() {
    return false;
  },
  // 属性回调
  selectAttr : function(e){
    // console.log(`选中的:${JSON.stringify(e)}`)
    let imageArrs = this.data.imageArrs

    let id = -1
    imageArrs[this.data.swiperIndex].forEach((item , index) => {
      if (item.text){
        item.font = e.detail.font,
        item.bold = e.detail.bold,
        item.ziti = e.detail.ziti,
        item.zitiZh = e.detail.zitiZh,
        item.color = e.detail.color
        item.canshow = true
        id = index
      }
    })
    if (id != -1){
      imageArrs[this.data.swiperIndex].forEach((item,index) => {
        if (id != index){
          item.canshow = false
        }
      })
      this.setData({imageArrs})
      this.checkSliderArea()
    }
    // console.log(`属性aaa:${JSON.stringify(imageArrs)}`)
  },
  // 底部事件
  selectTap : function(e){
    // console.log(`选中的:${JSON.stringify(e)}`)
    if (this.data.type != '1'){
      if (this.data.imageArrs[this.data.swiperIndex].length >= tiebiaoMaxNum){
        wx.showModal({
          title: '提示',
          content: `贴标最多${tiebiaoMaxNum}个`,
          showCancel: false,
          confirmText: '确定',
          confirmColor: '#3CC51F',
          success: (result) => {
            if(result.confirm){
              
            }
          },
          fail: ()=>{},
          complete: ()=>{}
        });
        return
      }
    }
    let zfArrs = this.data.zfArrs
    let a = zfArrs.bgImage[zfArrs.selectIndex].left + zfArrs.bgImage[zfArrs.selectIndex].top + zfArrs.bgImage[zfArrs.selectIndex].right + zfArrs.bgImage[zfArrs.selectIndex].bottom
    if (a == 2){
      wx.showModal({
        title: '提示',
        content: `${zfArrs.titles[zfArrs.selectIndex]}没有定制区域`,
        showCancel: false,
        confirmText: '确定',
        confirmColor: '#3CC51F',
        success: (result) => {
          if(result.confirm){
          }
        },
        fail: ()=>{},
        complete: ()=>{}
      });
      return
    }
    let imageArrs = this.data.imageArrs
    // 如果有text字段，则替换
    let id = -1
    imageArrs[this.data.swiperIndex].forEach((item , index) => {
      if (item.text){
        id = index
        item.canshow = true
      }
    });
    if (id != -1 && e.detail.text){
      // 替换
      imageArrs[this.data.swiperIndex].forEach((item , index) => {
        if (id != index){
          item.canshow = false
        }
      })

      let json = imageArrs[this.data.swiperIndex][id]
      Object.assign(json,e.detail)
      imageArrs[this.data.swiperIndex].splice(id,1,json)
    }
    else{
      // 添加
      let offset = -1

      let json = {
        width : 0,
        height : 0,
        max_width : systemInfo.vWidth * (this.data.zfArrs.bgImage[this.data.zfArrs.selectIndex].width) - 2,
        max_height : this.data.swiperImageHeight * (this.data.zfArrs.bgImage[this.data.zfArrs.selectIndex].height) - 2,
        top : offset,
        left : offset,
        scale : 1,
        rotate : 0,
        canshow : true
      }
      if (!e.detail.text){
        json.pic = `https://cdn.bestseller.com.cn/${e.detail.graphic_pic_url}`
      }
      else{
        json.width = json.max_width
      }
      Object.assign(json,e.detail)
      if (json.graphic_pic_url){
        var that = this
        wx.getImageInfo({
          src: json.pic,
          success: (result)=>{
            json.bendiPic = result.path
            let id = -1
            imageArrs[that.data.swiperIndex].forEach((item,index) => {
              if (item.canshow){
                id = index
              }
              if (id != -1){
                imageArrs[that.data.swiperIndex][id] = json
                that.setData({imageArrs})
              }
            })

          }
        });
      }

      imageArrs[this.data.swiperIndex].forEach(item => {
        item.canshow = false
      });
      imageArrs[this.data.swiperIndex].push(json)
      moreAreaArrs[this.data.swiperIndex].push(false)
    }


    // console.log(`aaa:${JSON.stringify(imageArrs)}`)
    this.setData({imageArrs})

    this.checkSliderArea()
  },
  typeGetHeight : function(e){
    let imgw=e.detail.width;
    let imgh=e.detail.height;
    let id = e.currentTarget.id
    let imageArrs = this.data.imageArrs
    let json = imageArrs[this.data.swiperIndex][id]
    if (this.data.type == 2){
      json.width = parseFloat(imgw)
    }
    else{
      let oriScale = imgh / imgw

      let maxWidth = json.max_width
      let maxHeight = json.max_height
      let scale = maxHeight / maxWidth

      if (oriScale < scale){
        json.width = maxWidth
      }
      else{
        json.width = maxHeight * imgw / imgh
      }
    }
    // console.log(`等比适配:${json.width}`)
    imageArrs[this.data.swiperIndex][id] = json
    this.setData({imageArrs})
    this.checkSliderArea()
  },
  touchStart : function(e){
    if (this.data.isScale){return}
    if (this.data.isDelete){return}
    let id = e.currentTarget.dataset.id
    let imageArrs = this.data.imageArrs
    imageArrs[this.data.swiperIndex].forEach(item => {
      item.canshow = false
    });
    let json = imageArrs[this.data.swiperIndex][id]
    json.canshow = true
    json.x = e.touches[0].clientX
    json.y = e.touches[0].clientY

    imageArrs[this.data.swiperIndex][id] = json
    this.setData({imageArrs})
  },
  touchMove : function(e){
    if (this.data.isScale){return}
    if (this.data.isDelete){return}
    let id = e.currentTarget.dataset.id
    let imageArrs = this.data.imageArrs
    let json = imageArrs[this.data.swiperIndex][id]
    let x = e.touches[0].clientX
    let y = e.touches[0].clientY

    json.left += x - json.x
    json.top += y - json.y
    json.x = x
    json.y = y
// console.log(`yidong:${JSON.stringify(json.left)}`)
    imageArrs[this.data.swiperIndex][id] = json
    this.setData({imageArrs})
  },
  touchEnd : function(e){
    if (this.data.isScale){return}
    if (this.data.isDelete){return}
    // console.log(`移动结束:${JSON.stringify(e)}`)
    this.checkSliderArea()

  },
  scaleStart : function(e){
    this.setData({isScale : true})
  },
  scaleEnd : function(e){
    // console.log(`缩放结束:${JSON.stringify(e)}`)
    this.setData({isScale : false})
  },
  scaleMove : function(e){
    // console.log(`aaa:${JSON.stringify(e)}`)

    let id = e.currentTarget.id
    let imageArrs = this.data.imageArrs
    let json = imageArrs[this.data.swiperIndex][id]
    if (json.pic){
      // 获取拖动的位置
      let x = e.touches[0].clientX
      x -= this.data.vWidth
      // 中心点
      let zhognxindian = json.left + json.width
      let rx = x / zhognxindian
  
      if (rx < 0.3){
        rx = 1 - 0.3 - rx
      }
      // console.log(`缩放系数:${rx}`)
      // console.log(`缩放结束:${JSON.stringify(e)}`)
      json.scale = rx
      imageArrs[this.data.swiperIndex][id] = json
    }
    else{
      let x = e.touches[0].clientX
      let location = x - this.data.vWidth
      if (x < this.data.vWidth + 20){
        location = 20
      }
      else if (x > this.data.vWidth + json.max_width){
        location = json.max_width
      }
      json.width = location
    }
    this.setData({imageArrs})
  },
  closed : function(e){
    let id = e.currentTarget.id
    let imageArrs = this.data.imageArrs
    imageArrs[this.data.swiperIndex].splice(id,1)
    moreAreaArrs[this.data.swiperIndex].splice(id,1)
    
    this.setData({imageArrs,isDelete:true})
    setTimeout(() => {
      this.setData({isDelete : false})
    }, 200);
  },
  // 角度
  sliderMove : function(e){
    let value = e.detail
    let rotate = value / 0.57
    rotate = rotate > 360 ? 360 : rotate.toFixed(0)
    // console.log(`aaaa:${rotate}`)

    // console.log(`旋转角度:${rotate / 0.57}`)
    let imageArrs = this.data.imageArrs
    imageArrs[this.data.swiperIndex].forEach(item => {
      if (item.canshow){
        item.rotate = rotate
      }
    });
    this.setData({imageArrs,isSlider : true})
    if (imageArrs[this.data.swiperIndex].length > 0){
      this.checkSliderArea()
    }
  },
  sliderEnd : function(e){
    this.setData({isSlider : false})
  },

  // 计算每行字数
  checkStrNum : function(index){

    return new Promise((resolve,reject) => {
      let imageArrs = this.data.imageArrs
      let calueStrJson = this.data.calueStrJson
      
      let jsons = imageArrs[index]
      let haveStr = false
      
      jsons.forEach((item,index) => {
        if (item.text){
          haveStr = true
          Object.assign(calueStrJson,item)
          calueStrJson.splitArrs = calueStrJson.text.split('')
          this.setData({calueStrJson})
        }
      })
      if (!haveStr){
        resolve()
        return
      }

      let classID = ''
      let rectArrs = []
      calueStrJson.splitArrs.forEach((item,index) => {
        classID = `#calueStr${index}`

        wx.createSelectorQuery().select(classID).boundingClientRect(function(rect){
          if (rect){
            let json = {
              index,
              item,
              width : rect.width
            }
            rectArrs.push(json)
            if (rectArrs.length == calueStrJson.splitArrs.length){
              // 开始计算
              // 先从小到大排序
              for (let i=0;i<rectArrs.length - 1;i++){
                for (let j=0;j<rectArrs.length - 1 - i;j++){
                  if (rectArrs[j].index > rectArrs[j + 1].index){
                    let temp = rectArrs[j]
                    rectArrs[j] = rectArrs[j + 1]
                    rectArrs[j + 1] = temp
                  }
                }
              }
              // console.log(`排序hou:${JSON.stringify(rectArrs)}`)
              // console.log(`数据:${JSON.stringify(calueStrJson)}`)

              let str = ''
              let strs = []
              let lenWidth = 0
              rectArrs.forEach(item => {
                lenWidth += item.width
                if (lenWidth > calueStrJson.areaJson.width){
                  strs.push(str)

                  str = item.item
                  lenWidth = item.width
                }
                else{
                  str += item.item
                }
              })
              strs.push(str)
              let textArrs = strs
              resolve(textArrs)
              // console.log(`结果:${JSON.stringify(calueStrJson)}`)

            }
          }
        }).exec()
      })


    })
  },
  // 生成图 并保存
  save : function(){
    let upLoadArrs = this.data.upLoadArrs
    upLoadArrs = []
    this.setData({upLoadArrs})

    let str = ''
    for (let i=0;i<2;i++){
      moreAreaArrs[i].forEach(item => {
        if (item){
          str = '超出区域'
        }
      })
    }

    // console.log(`aaa:${JSON.stringify(this.data.imageArrs)}`)
    if (str == ''){
      wx.showLoading({
        title: '生成中',
        mask: true
      });
      for(let i=0;i<2;i++){
        this.data.imageArrs[i].forEach(item=>{
          if (item.graphic_pic_url){
            if (!item.bendiPic){
              setTimeout(() => {
                this.save()
              }, 1000);
              return
            }
          }
        })
      }
      this.checkArea().then(item => {
        // 计算每行显示个数
        this.checkStrNum(0).then((textArrs) => {
          this.checkStrNum(1).then((textArrs1) => {
            
            new privateSaveImage(this,{
              imageHeight : this.data.swiperImageHeight,
              imgs : this.data.imageArrs,
              zfs : this.data.zfArrs,
              textArrs : textArrs,
              canID : 'asd',
              callBack : (json) => {
                // 回调
                if (json.index == 0){
                  new privateSaveImage(this,{
                    imageHeight : this.data.swiperImageHeight,
                    imgs : this.data.imageArrs,
                    zfs : this.data.zfArrs,
                    textArrs : textArrs1,
                    canID : 'asd1',
                    callBack : (json1) => {
                      console.log(`生成回调:${JSON.stringify(json)}`)
                      console.log(`生成回调1:${JSON.stringify(json1)}`)
                      // return
                      // 回调

                      this.uploadFiles(json,json1)
                      
                    }
                  })
                }
              }
            })

          })
        })

      })
    }
    else{
      wx.showToast({
        title: str,
        icon: 'none'
      });
    }
  },
  async uploadFiles(json,json1){
    let uploadFile = await uploadImage(json.path, upLoadPath);
    console.log(`上传结果${0}:${JSON.stringify(uploadFile)}`)

    let jsons = {
      id : 0,
      data : uploadFile[0],
      textImagePath : json.textImagePath
    }
    this.fengzhuang(jsons)

    let uploadFile1 = await uploadImage(json1.path, upLoadPath);
    console.log(`上传结果1${1}:${JSON.stringify(uploadFile1)}`)

    jsons = {
      id : 1,
      data : uploadFile1[0],
      textImagePath : json1.textImagePath
    }
    this.fengzhuang(jsons)

  },
  fengzhuang : function(json){
    let upLoadArrs = this.data.upLoadArrs
    upLoadArrs.push(json)
    this.setData({upLoadArrs})
    // console.log(`aaa:${JSON.stringify(upLoadArrs)}`)
    if (upLoadArrs.length == 2){
      if (upLoadArrs[0].id > upLoadArrs[1].id){
        let temp = upLoadArrs[0]
        upLoadArrs[0] = upLoadArrs[1]
        upLoadArrs[1] = temp
      }
      // console.log(`结果:${JSON.stringify(upLoadArrs)}`)
      let gscolPicPath = this.data.imageArrs[0].length > 0 ? upLoadArrs[0].data : this.data.imageArrs[1].length > 0 ? upLoadArrs[1].data : upLoadArrs[0].data
      

      let jsonData = this.data.jsonData.jsonData
      let colorAndChima = this.data.jsonData.colorAndChimaArrs
      let arrs = []
      let json = {
        "goodsName":jsonData.template_name,
        "goodsCount":1,
        "gscolPicPath":gscolPicPath,
        "price":jsonData.sale_price,
        "originalPrice":jsonData.original_price,
        "discount":1,
        "colorName":colorAndChima[0].title,
        "sizeName":colorAndChima[1].title,
        "gcsSku":colorAndChima[1].sku,
        "goodsColorCode":jsonData.sku,
        "clearingType":4,
        "picFront":upLoadArrs[0].data,
        "picBack":upLoadArrs[1].data,
        "customRemark": ''
      }
      let str = ''
      let str1 = ''
      let str2 = ''
      for (let i=0;i<2;i++){
        this.data.imageArrs[i].forEach(item => {
          // 找文字
          if (item.text){
            if (i == 0){
              str1 = item.text + `,${item.font}` + `,${item.bold}` + `,${item.zitiZh}` + `,${item.ziti}` + `,${item.color}` + ','
            }
            else{
              str2 = item.text + `,${item.font}` + `,${item.bold}` + `,${item.zitiZh}` + `,${item.ziti}` + `,${item.color}` + ','
            }
          }
        })
      }
      str1 = str1.substr(0,str1.length - 1)
      str2 = str2.substr(0,str2.length - 1)
      str = `${str1};${str2}`
      Object.assign(json,{customRemark : str})
      arrs.push(json)
      // 绘图
      let price = 0
      let sku = ''
      let strPathF = ''
      let strPathB = ''
      for (let i=0;i<2;i++){

        this.data.imageArrs[i].forEach(item => {
          if (item.graphic_type && item.graphic_type == 'graphic'){
              if (parseInt(item.graphic_price) > parseInt(price)){
                  price = item.graphic_price
                  sku = item.graphic_sku
              }
              if (i == 0){
                strPathF += `/${item.graphic_pic_url}`
                strPathF += ','
              }
              else{
                strPathB += `/${item.graphic_pic_url}`
                strPathB += ','
              }
          }
        });
      }
      strPathF = strPathF != '' ? strPathF.substr(0,strPathF.length - 1) : ''
      strPathB = strPathB != '' ? strPathB.substr(0,strPathB.length - 1) : ''
      let ht = {
        "goodsName":"绘图",
        "goodsCount":1,
        "gscolPicPath":strPathF == '' ? strPathB.split(',')[0] : strPathF.split(',')[0],
        "price":price,
        "originalPrice":price,
        "discount":1,
        "colorName":"ACC",
        "sizeName":"ACC",
        "gcsSku":sku,
        "goodsColorCode":sku.substr(0,12),
        "picFront":strPathF,
        "picBack":strPathB
      }
      arrs.push(ht)
      for (let i=0;i<2;i++){

        this.data.imageArrs[i].forEach(item => {
          if (item.graphic_type && item.graphic_type == 'label'){
            let tbJson = {
              "goodsName":"贴标",
              "goodsCount":1,
              "gscolPicPath":`/${item.graphic_pic_url}`,
              "price":item.graphic_price,
              "originalPrice":item.graphic_price,
              "discount":1,
              "colorName":"ACC",
              "sizeName":"ACC",
              "gcsSku":item.graphic_sku,
              "goodsColorCode":item.graphic_sku.substr(0,12),
              "picFront":i == 0 ? `/${item.graphic_pic_url}` : '',
              "picBack": i == 1 ? `/${item.graphic_pic_url}` : ''
              }
              arrs.push(tbJson)
          }
        });
      }
      // 找自定义图片，上传
      let zdyArrsF = []
      let zdyArrsB = []
      for (let i=0;i<2;i++){

        this.data.imageArrs[i].forEach(item => {
          if (item.pic && !item.graphic_name){
            if (i == 0){
              zdyArrsF.push(item.pic)
            }
            else{
              zdyArrsB.push(item.pic)
            }
          }
        });
      }
      if (str != ''){
        // 文字图片
        if (upLoadArrs[0].textImagePath != ''){
          zdyArrsF.push(upLoadArrs[0].textImagePath)
        }
        if (upLoadArrs[1].textImagePath != ''){
          zdyArrsB.push(upLoadArrs[1].textImagePath)
        }
      }
      if (zdyArrsF.length > 0 || zdyArrsB.length > 0){
        // 上传
        this.zdy(zdyArrsF,zdyArrsB,arrs,0)
      }
      else{
        wx.hideLoading();
        let a = arrs[1].picFront
        let b = arrs[1].picBack
        if (a.substr(a.length - 1,1) == ','){
          arrs[1].picFront = a.substr(0,a.length - 1)
        }
        if (b.substr(b.length - 1,1) == ','){
          arrs[1].picBack = b.substr(0,b.length - 1)
        }
        wx.setStorageSync('dzRequstDatas', arrs);
        wx.navigateTo({
          url: `../customPreView/customPreView?type=${this.data.type}`
        });
      // console.log(`aaaaaa封装数据:${JSON.stringify(arrs)}`)
      }
    }
  },
  zdy : function(zdyArrsF,zdyArrsB,arrs,index){
    // console.log(`zdy：${index}`)
    let tempZDYArrs = [zdyArrsF,zdyArrsB]

    let zdyStrF = ''
    let zdyStrB = ''
    let tempArrs = []
    let that = this

    let str = ''
    let url = URL.UPLOAD_IMAGE;
    url += objToQuery(upLoadPath)
    if(tempZDYArrs[index].length > 0){
      tempZDYArrs[index].forEach((itemc,indexc)=>{
  
        wx.uploadFile({
          url, //仅为示例，非真实的接口地址
          filePath: itemc,
          name: 'file',
          header: {
            token: wx.getStorageSync('token'),
            'content-type': 'multipart/form-data'
          },
          formData: {
            method: 'POST'   //请求方式
          },
          success (res){
            const data = JSON.parse(res.data)
            // console.log(`自定义图片上传:${JSON.stringify(data.data[0])}`)
            if (index == 0){
              zdyStrF += data.data[0]
              zdyStrF += ','
            }
            else{
              zdyStrB += data.data[0]
              zdyStrB += ','
            }
            str = index == 0 ? zdyStrF : zdyStrB
            // str = str.substr(0,str.length - 1)
            tempArrs.push(str)
            if (tempArrs.length == tempZDYArrs[index].length){

              str += index == 0 ? arrs[1].picFront : arrs[1].picBack
              arrs[1].picFront = index == 0 ? str : arrs[1].picFront
              arrs[1].picBack = index == 1 ? str : arrs[1].picBack


              if (index == 0){
                that.zdy(zdyArrsF,zdyArrsB,arrs,1)
              }
              else{
                if (arrs[1].price == 0){
                  let sku = '2001F1000888F10'
                  arrs[1].gcsSku = sku
                  arrs[1].goodsColorCode = sku.substr(0,12)
                  arrs[1].gscolPicPath = str.split(',')[0]
                  arrs[1].price = 65
                  arrs[1].originalPrice = 65
                }
                // console.log(`bbbbbb封装数据:${JSON.stringify(arrs)}`)
                wx.hideLoading();
                let a = arrs[1].picFront
                let b = arrs[1].picBack
                if (a.substr(a.length - 1,1) == ','){
                  arrs[1].picFront = a.substr(0,a.length - 1)
                }
                if (b.substr(b.length - 1,1) == ','){
                  arrs[1].picBack = b.substr(0,b.length - 1)
                }

                wx.setStorageSync('dzRequstDatas', arrs);
                wx.navigateTo({
                  url: `../customPreView/customPreView?type=${that.data.type}`
                });
              }

            }
  
  
          },
          fail (err) {
            console.log(`aaaaaaaaaaaaaaaaa:${JSON.stringify(err)}`)
          }
        })
      })
    }
    else if (index == 0){
      this.zdy(zdyArrsF,zdyArrsB,arrs,1)
    }
    else{
      if (arrs[1].price == 0){
        let sku = '2001F1000888F10'
        arrs[1].gcsSku = sku
        arrs[1].goodsColorCode = sku.substr(0,12)
        arrs[1].gscolPicPath = str.split(',')[0]
        arrs[1].price = 65
        arrs[1].originalPrice = 65
      }
      // console.log(`bbbbbb封装数据:${JSON.stringify(arrs)}`)
      wx.hideLoading();
      let a = arrs[1].picFront
      let b = arrs[1].picBack
      if (a.substr(a.length - 1,1) == ','){
        arrs[1].picFront = a.substr(0,a.length - 1)
      }
      if (b.substr(b.length - 1,1) == ','){
        arrs[1].picBack = b.substr(0,b.length - 1)
      }
      wx.setStorageSync('dzRequstDatas', arrs);
      wx.navigateTo({
        url: `../customPreView/customPreView?type=${that.data.type}`
      });
    }
  },
  // 只记录位置
  checkArea : function(){
    return new Promise((resolve,reject) => {
      let id = -1
      let imageArrs = this.data.imageArrs
      let json = {}
      imageArrs[this.data.swiperIndex].forEach((item,index) => {
        if (item.canshow){
          json = item
          id = index
        }
      })
      if (id == -1){
        resolve()
        return
      }
      let that = this
      let classID = `#view-id${id}`
      // 检测普通view
      wx.createSelectorQuery().select(classID).boundingClientRect(function(rect){
        if (rect){
          
          let left = rect.left
          let top = rect.top
          let right = rect.right
          let bottom = rect.bottom
          let width = rect.width
          let height = rect.height
    
          json.areaJson = {
            left,top,right,bottom,width,height
          }
          imageArrs[that.data.swiperIndex][id] = json
    
          that.setData({imageArrs})
        }
        resolve()
      }).exec()
    })
  },
  // 检测超过范围
  checkSliderArea : function(){
    let id = -1
    let imageArrs = this.data.imageArrs
    imageArrs[this.data.swiperIndex].forEach((item,index) => {
      if (item.canshow){
        id = index
      }
    })
    if (id == -1){
      resolve()
      return
    }

    let that = this
    let classID = `#rotate-id${id}`
    this.checkArea()
    // 检测普通view
    wx.createSelectorQuery().select(classID).boundingClientRect(function(rect){
      let areaLeft = systemInfo.vWidth * that.data.zfArrs.bgImage[that.data.zfArrs.selectIndex].left
      let areaTop = that.data.swiperImageHeight * that.data.zfArrs.bgImage[that.data.zfArrs.selectIndex].top
      let areaRight = systemInfo.vWidth * that.data.zfArrs.bgImage[that.data.zfArrs.selectIndex].right
      let areaBotom = that.data.swiperImageHeight * that.data.zfArrs.bgImage[that.data.zfArrs.selectIndex].bottom
      let left = rect.left
      let top = rect.top
      let right = rect.right
      let bottom = rect.bottom
      let offset = 1


      areaLeft = Math.floor(areaLeft)
      areaTop = Math.floor(areaTop)
      areaRight = Math.floor(areaRight)
      areaBotom = Math.floor(areaBotom)
      left = Math.floor(left)
      top = Math.floor(top)
      right = Math.floor(right)
      bottom = Math.floor(bottom)

      if (that.data.zfArrs.selectIndex == 1){
        // 背面
        left = systemInfo.vWidth + left
        right = systemInfo.vWidth + right
      }
      // console.log(`普通:${JSON.stringify(rect)}`)
      // console.log(`区域:${areaLeft}/${areaTop}/${areaRight}/${areaBotom}/${that.data.swiperImageHeight}`)

      let isMoreArea = that.data.isMoreArea
      isMoreArea = false
      if (left < areaLeft - offset || top < areaTop - offset){
        isMoreArea = true
      }
      else if (right > systemInfo.vWidth - areaRight + offset * 2 || bottom >  that.data.swiperImageHeight - areaBotom + offset * 2){
        isMoreArea = true
      }
      that.setData({isMoreArea})
      if (isMoreArea){
        wx.showToast({
          title: '超出区域',
          icon: 'none'
        });
      }
      moreAreaArrs[that.data.swiperIndex][id] = isMoreArea
    }).exec()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    let str = options.type == 1 ? '定制' : '贴标'
    wx.setNavigationBarTitle({
      title: str
    });
    
    let jsonData = this.data.jsonData
    let vWidth = systemInfo.vWidth
    if (options.tiebiao){
      let tiebiao = JSON.parse(options.tiebiao)
      let json = wx.getStorageSync('dzJsonData');
      json = JSON.parse(json)
      json.jsonData.pic_front = tiebiao.front
      json.jsonData.pic_back = tiebiao.back
      jsonData = json
    }
    else{
      wx.setStorageSync('dzJsonData', options.datas);
      jsonData = JSON.parse(options.datas)
    }

    // console.log(`接收的数据:${JSON.stringify(jsonData)}`)
    // console.log(`bbb:${JSON.stringify(this.data.type)}`)

    let zfArrs = this.data.zfArrs
    zfArrs.bgImage.forEach((item,index) => {
      if (index == 0){
        item.top = parseFloat(jsonData.jsonData.top_front / 100)
        item.bottom = parseFloat(jsonData.jsonData.bottom_front / 100)
        item.left = parseFloat(jsonData.jsonData.left_front / 100)
        item.right = parseFloat(jsonData.jsonData.right_front / 100)
        item.image = jsonData.jsonData.pic_front
      }
      else{
        item.top = parseFloat(jsonData.jsonData.top_back / 100)
        item.bottom = parseFloat(jsonData.jsonData.bottom_back / 100)
        item.left = parseFloat(jsonData.jsonData.left_back / 100)
        item.right = parseFloat(jsonData.jsonData.right_back / 100)
        item.image = jsonData.jsonData.pic_back
      }
      item.width = 1 - (item.left + item.right)
      item.height = 1 - (item.top + item.bottom)
      item.width = parseFloat(item.width.toFixed(2))
      item.height = parseFloat(item.height.toFixed(2))
    })
    // console.log(`正反数据:${JSON.stringify(zfArrs)}`)
    vWidth = vWidth * zfArrs.bgImage[zfArrs.selectIndex].left
    this.setData({jsonData,type : options.type,vWidth : vWidth,zfArrs})


    let centerStr = '快来给我设计图案吧'
    let a = zfArrs.bgImage[zfArrs.selectIndex].left + zfArrs.bgImage[zfArrs.selectIndex].top + zfArrs.bgImage[zfArrs.selectIndex].right + zfArrs.bgImage[zfArrs.selectIndex].bottom
    if (a == 2){
      centerStr = '暂未开放定制区域哟'
    }
    this.setData({centerStr})
    this._getCustomizationlimitJson()
  },
  _getCustomizationlimitJson: function(){
    wx.showLoading({
      title: 'loading',
      mask: true
    })
    getCustomizationlimitJson().then(res => {

      tiebiaoMaxNum = res.tiebiaoNum
    }).catch(err =>{

    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
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

  },

})