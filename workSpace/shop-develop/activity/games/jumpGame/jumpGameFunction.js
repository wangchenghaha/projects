import {splitGameImg} from '../../../utils/utils'
const app = getApp();
const brand = app.config.brand
let isFol = brand === 'FOL'

class jumpGameFunction {
  constructor(gameConst,callBack){
      this.gameConst = gameConst
      this.callBack = callBack

      this._clearInterval()
  }
  // 创建位置
  makeDatas(suiji) {
   
    let perCentage = Math.floor(Math.random() * 100 + 0)
    let imgJson = ''
    //  logo灯牌出现的概率为20%
    if(perCentage >= 10 && perCentage <= 90){
      let index = Math.floor(Math.random() * 3 + 0)
      imgJson = this.gameConst.yunImgArrs[index]
    } else {
      let index = Math.floor(Math.random() * 2 + 0)
      imgJson = this.gameConst.yunILogoArrs[index]
    }

    let width = imgJson.widthPX
    let left = Math.floor(Math.random() * (wx.getSystemInfoSync().windowWidth - width + 1) + 0)
    let height = imgJson.heightPX
    let image = imgJson.img

    let json = {
        width,
        left,
        height,
        image
    }

    if (suiji){
        return json
    }
    else{
      if (this.gameConst.yunDatas.length == 0){
        json.left = wx.getSystemInfoSync().windowWidth * 0.5
      }
        this.gameConst.yunDatas.push(json)
        this.gameConst.returnDatas()
    }
  }

  // 记录云彩位置
  reloadYunOffset(){

      // 记录云彩位置
      this.gameConst.yunTop1 = wx.getSystemInfoSync().windowHeight * 0.2 * 0.5 - this.gameConst.yunDatas[this.gameConst.jianceIndex0].height / 750 * wx.getSystemInfoSync().windowWidth / 2
      this.gameConst.yunTop2 = wx.getSystemInfoSync().windowHeight * 0.2 + wx.getSystemInfoSync().windowHeight * 0.2 * 0.5 - this.gameConst.yunDatas[this.gameConst.jianceIndex1].height / 750 * wx.getSystemInfoSync().windowWidth / 2
      this.gameConst.yunTop3 = wx.getSystemInfoSync().windowHeight * 0.2 * 2 + wx.getSystemInfoSync().windowHeight * 0.2 * 0.5 - this.gameConst.yunDatas[this.gameConst.jianceIndex2].height / 750 * wx.getSystemInfoSync().windowWidth / 2
      this.gameConst.yunTop4 = wx.getSystemInfoSync().windowHeight * 0.2 * 3 + wx.getSystemInfoSync().windowHeight * 0.2 * 0.5 - this.gameConst.yunDatas[this.gameConst.jianceIndex3].height / 750 * wx.getSystemInfoSync().windowWidth / 2
      this.gameConst.yunTop5 = wx.getSystemInfoSync().windowHeight * 0.2 * 4 + wx.getSystemInfoSync().windowHeight * 0.2 * 0.5 - this.gameConst.yunDatas[this.gameConst.jianceIndex4].height / 750 * wx.getSystemInfoSync().windowWidth / 2
      this.gameConst.returnDatas()
  }

  // 开始动画
  startAnimate(num){

  let a = 0

  this.interval1 = setInterval(() => {
    if (num - Math.abs(a) >= 0 && num - Math.abs(a) < this.gameConst.jumpSpeed){
      clearInterval(this.interval1)
      let speed = num - Math.abs(a)

                  let winHeight = wx.getSystemInfoSync().windowHeight

                  this.gameConst.transformY -= speed
                  a -= speed
                  this.gameConst.returnDatas()


                  this.gameConst.currentImg = this.gameConst.animateImgN

                  a = this.gameConst.jumpTop - num
                        this.interval4 = setInterval(() => {

                          this.gameConst.transformY += this.gameConst.jumpSpeed
                          a += this.gameConst.jumpSpeed
                          this.gameConst.cssAnimateTime = 0.1
                          this.gameConst.returnDatas()

                          if (Math.floor(winHeight - a) <= 0){
                            clearInterval(this.interval4)

                                      console.log(`没有检测到`)
                                      this.gameConst.jumpTop = winHeight - this.gameConst.imgHeightPX
                                      this.gameConst.transformY = 0

                                      if (this.gameConst.isFirst){
                                        setTimeout(() => {
                                          this.startAnimate(this.gameConst.jumpHeight)
                                        }, 50);
                                        
                                      }
                                      else{
                                        this.gameConst.fenshuArr.push(this.gameConst.fenshu)
                                        this.callBack()
                                      }
                          }
                          else{
                              let sSpeed = -1

                                if (Math.floor(this.gameConst.yunTop5) - (Math.floor(a) + Math.floor(this.gameConst.imgHeightPX)) >= 0 && Math.floor(this.gameConst.yunTop5) - (Math.floor(a) + Math.floor(this.gameConst.imgHeightPX)) < this.gameConst.jumpSpeed){
                                  if (this.gameConst.transformX + this.gameConst.imgWidthPX > this.gameConst.yunDatas[this.gameConst.jianceIndex4].left && this.gameConst.transformX < this.gameConst.yunDatas[this.gameConst.jianceIndex4].left + this.gameConst.yunDatas[this.gameConst.jianceIndex4].width){

                                    sSpeed = Math.floor(this.gameConst.yunTop5) - (Math.floor(a) + Math.floor(this.gameConst.imgHeightPX))
                                  

                                }

                              }
                              else if (Math.floor(this.gameConst.yunTop4) - (Math.floor(a) + Math.floor(this.gameConst.imgHeightPX)) >= 0 && Math.floor(this.gameConst.yunTop4) - (Math.floor(a) + Math.floor(this.gameConst.imgHeightPX)) < this.gameConst.jumpSpeed){
                                if (this.gameConst.transformX + this.gameConst.imgWidthPX > this.gameConst.yunDatas[this.gameConst.jianceIndex3].left && this.gameConst.transformX < this.gameConst.yunDatas[this.gameConst.jianceIndex3].left + this.gameConst.yunDatas[this.gameConst.jianceIndex3].width){

                                  sSpeed = Math.floor(this.gameConst.yunTop4) - (Math.floor(a) + Math.floor(this.gameConst.imgHeightPX))
                                

                              }

                            }
                            if (sSpeed >= 0){
                              clearInterval(this.interval4)

                              this.gameConst.cssAnimateTime = 0
                              this.gameConst.returnDatas()

                              setTimeout(() => {
                                this.startAnimate1(sSpeed,a)
                              }, 50);
                            }



                          }

                        }, 50);
      
    }
    else{
      this.gameConst.currentImg = this.gameConst.animateImgS
      this.gameConst.transformY -= this.gameConst.jumpSpeed
      a -= this.gameConst.jumpSpeed
      this.gameConst.cssAnimateTime = 0.1
      this.gameConst.returnDatas()
    }
  }, 50);

}

startAnimate1(speed,a){
  this.gameConst.transformY += speed
  a += speed
  
    if ((Math.floor(a) + Math.floor(this.gameConst.imgHeightPX)) == Math.floor(this.gameConst.yunTop5)){


      console.log(`检测到了yunTop5`)
      
      
      
      this.gameConst.jumpTop = this.gameConst.yunTop5 - this.gameConst.imgHeightPX
      this.gameConst.transformY = 0
      

      this.gameConst.returnDatas()

      this.startAnimate(this.gameConst.jumpHeight + 40)
  }
  else if ((Math.floor(a) + Math.floor(this.gameConst.imgHeightPX)) == Math.floor(this.gameConst.yunTop4)){


    console.log(`检测到了yunTop4`)
    
    
    
          this.gameConst.isFirst = false

          this.gameConst.jumpTop = this.gameConst.yunTop4 - this.gameConst.imgHeightPX
          this.gameConst.transformY = 0

          

          
      if (parseInt(this.gameConst.currentNumber) >= parseInt(this.gameConst.tongguanNum)){

          this.makeDatasTG()
          this.gameConst.showTwoGame = true
          this.gameConst.returnDatas()
          

          setTimeout(() => {
              this.startAnimateTG()
          }, 1000);
      }
      else{
          this.startAnimate(this.gameConst.jumpHeight - 50)
          this.scroTop()
      }

  }
}


// 滚动/重置位置/加分(碰撞检测到后核心函数)
scroTop(){
  let nextIndex = 1
  let nextNum = this.gameConst.tzNumber
  this.gameConst.currentNumber = parseInt(this.gameConst.currentNumber) + parseInt(nextNum)
  this.gameConst.zongNumber = parseInt(this.gameConst.zongNumber) + parseInt(nextNum)
  // 随机分数(10的1到10倍)
  this.gameConst.fenshu = isFol? parseInt(this.gameConst.currentNumber) : parseInt(this.gameConst.fenshu) + Math.floor(Math.random() * 11 + 1) * 10

  this.gameConst.currentIndex -= nextIndex
  this.gameConst.jianceIndex0 -= 1
  this.gameConst.jianceIndex1 -= 1
  this.gameConst.jianceIndex2 -= 1

  this.gameConst.jianceIndex4 -= 1
  this.gameConst.jianceIndex3 -= 1

  this.gameConst.jinbiAnimate = this.gameConst.jinbiAnimate == 'jinbiAnimate' ? 'jinbiAnimate1' : 'jinbiAnimate'


  if (this.gameConst.currentIndex < 0){
      this.gameConst.currentIndex = this.gameConst.yunDatas.length - Math.abs(this.gameConst.currentIndex)
  }

  if (this.gameConst.jianceIndex0 < 0){
    this.gameConst.jianceIndex0 = this.gameConst.yunDatas.length - 1
  }
  if (this.gameConst.jianceIndex1 < 0){
      this.gameConst.jianceIndex1 = this.gameConst.yunDatas.length - 1
  }
  if (this.gameConst.jianceIndex2 < 0){
      this.gameConst.jianceIndex2 = this.gameConst.yunDatas.length - 1
  }
  if (this.gameConst.jianceIndex4 < 0){
      this.gameConst.jianceIndex4 = this.gameConst.yunDatas.length - 1
  }
  if (this.gameConst.jianceIndex3 < 0){
      this.gameConst.jianceIndex3 = this.gameConst.yunDatas.length - 1
  }
  
  // if(getApp().config.brand == 'FOL' || getApp().config.brand == 'VEROMODA'){
  //   let random = Math.floor(Math.random() * 100 + 1)
  //   if (random >= 0 && random <= 20 && this.gameConst.bouncedTextJson.canShow){
  //     this.gameConst.bouncedTextJson.canShow = false
  //     wx.showToast({
  //       title: this.gameConst.bouncedTextJson.texts[this.gameConst.bouncedTextJson.index],
  //       icon: 'none',
  //       image: '',
  //       duration: 1500,
  //       mask: false,
  //       success: (result)=>{
  //         this.gameConst.bouncedTextJson.canShow = true
  //         this.gameConst.bouncedTextJson.index += 1
  //         if (this.gameConst.bouncedTextJson.index > this.gameConst.bouncedTextJson.texts.length - 1){
  //           this.gameConst.bouncedTextJson.index = 0
  //         }
  //       },
  //       fail: ()=>{},
  //       complete: ()=>{}
  //     });
  //   }
  // }

    this.gameConst.returnDatas()

    setTimeout(() => {
      
      // 改变位置
      let topIndex1 = this.gameConst.currentIndex - 1 < 0 ? this.gameConst.yunDatas.length - 1 : this.gameConst.currentIndex - 1

      // 重置屏幕外云彩位置
      this.gameConst.yunDatas.splice(topIndex1,1,this.makeDatas(true))

      this.gameConst.returnDatas()

    }, this.gameConst.reloadSpeed);
    
    
}

makeDatasTG(){
  let arrs = []
  this.gameConst.datas = []

  for (let i=0;i<5;i++){
    arrs = []
    for (let j=0;j<6;j++){
      let json = {
        canShow : true,
        width : (wx.getSystemInfoSync().windowWidth - 100 - 10 * 10) / 6,
        height : (wx.getSystemInfoSync().windowWidth - 100 - 10 * 10) / 6
      }
      arrs.push(json)
    }
    this.gameConst.datas.push(arrs)
  }
  this.gameConst.cssAnimateTime = 0.2
  this.gameConst.top = 0
  this.gameConst.indexImgBG = splitGameImg('bg2.png','jumpGame0501')
  this.gameConst.currentImg = this.gameConst.animateImgS
  this.gameConst.returnDatas()
}

startAnimateTG(){
  
  let offset = 10
  const left = 75


  const gameTop = this.gameConst.jumpTop
  const gameBottom = gameTop + this.gameConst.imgHeightPX
  this.interval5 = setInterval(() => {
  this.gameConst.top += this.gameConst.tgBottomSpeed
  this.gameConst.returnDatas()

  this.gameConst.datas.forEach((item,index) => {
      item.forEach((items,indes) => {
        let tempLeft = indes == 0 ? left : (items.width + offset) * indes + left
        let tempBottom = index == 0 ? this.gameConst.top + items.height : (items.height + offset) * index + this.gameConst.top + items.height

        if (tempBottom > gameTop && tempBottom <= gameBottom){
          if (tempLeft + items.width >= this.gameConst.transformX && tempLeft <= this.gameConst.transformX + this.gameConst.imgWidthPX){
            if (items.canShow){
              items.canShow = false
              this.gameConst.currentNumber = parseInt(this.gameConst.currentNumber) + parseInt(this.gameConst.tzNumber)
              this.gameConst.zongNumber = parseInt(this.gameConst.zongNumber) + parseInt(this.gameConst.tzNumber)

            }
          }
        }
      });
      
    });


    if (this.gameConst.top >= wx.getSystemInfoSync().windowHeight){
      clearInterval(this.interval5)
      console.log(`结束`)
      this.gameConst.fenshuArr.push(this.gameConst.fenshu)
      this.clearBounces(false)
    }
  }, 50);
}
checkLife(){

  if (this.gameConst.life > 0){
    this.gameConst.oneBounces = true
  }
  else{
    this.gameConst.twoBounces = true
  }
  this.gameConst.returnDatas()
}
// 设置关卡数据
levedSpeed () {
  /*
  *
  *   1倍速 : 1,400,500,300,3
  *   2倍速 : 2,350,400,600,6
  *   3倍速及以上 : 3,300,300,900,9
  * 
  *  */
  let index = this.gameConst.currentLeved
  index += 1
// 15
  if (index == 1){
    this.gameConst.jumpSpeed = 15
    this.gameConst.duration = 400
    this.gameConst.reloadSpeed = 500
    this.gameConst.tongguanNum = isFol ? 58 : 400
    this.gameConst.tgBottomSpeed = 15
    
    this.gameConst.tzNumber = isFol ? 1 : 7
    this.gameConst.indexImgBG = splitGameImg('bg1.png','jumpGame0501')
  }
  else if (index == 2){
    this.gameConst.jumpSpeed = 20
    this.gameConst.duration = 350
    this.gameConst.reloadSpeed = 400
    this.gameConst.tongguanNum = isFol ? 123 : 400
    this.gameConst.tgBottomSpeed = 20

    this.gameConst.tzNumber =isFol ? 2 : 20
    this.gameConst.indexImgBG = splitGameImg('bg1.png','jumpGame0501')
  }
  else if (index == 3){
    this.gameConst.jumpSpeed = 25
    this.gameConst.duration = 300
    this.gameConst.reloadSpeed = 300
    this.gameConst.tongguanNum = isFol ? 223 : 4500
    this.gameConst.tgBottomSpeed = 25

    this.gameConst.tzNumber = isFol ? 3 : 30
    this.gameConst.indexImgBG = splitGameImg('bg1.png','jumpGame0501')
  }
  else {
    let a = index - 3
    this.gameConst.jumpSpeed = 30 * a
    this.gameConst.duration = 300 - 50 * a < 100 ? 100 : 300 - 50 * a
    this.gameConst.reloadSpeed = 300 - 100 * a < 100 ? 100 : 300 - 100 * a
    this.gameConst.tongguanNum = isFol ? 223 * (a + 1) + 100 : 4500 * (a + 1) + 100
    this.gameConst.tgBottomSpeed = 30

    this.gameConst.tzNumber =  isFol ? 4 : 40
    this.gameConst.indexImgBG = splitGameImg('bg1.png','jumpGame0501')
  }
  
  this.gameConst.currentLeved = index
  this.gameConst.returnDatas()

  setTimeout(() => {
    this.startAnimate(this.gameConst.jumpHeight)
  }, 1000);
}
// 还原弹框状态
clearBounces(jixu){
  this.gameConst.isFirst = true

  if (jixu){
    this.gameConst.fenshuArr = []
    this.gameConst.currentLeved = this.gameConst.currentLeved - 1
    this.gameConst.currentNumber = 0
  }
  this.gameConst.fenshu = 0

  // 还原坐标
  let winHeight = wx.getSystemInfoSync().windowHeight
  this.gameConst.jumpTop = winHeight - this.gameConst.imgHeightPX
  this.gameConst.showTwoGame = false

  this.gameConst.oneBounces = false
  this.gameConst.twoBounces = false
  this.levedSpeed()
}
// 返回时候 清除定时任务
  _clearInterval(){
    console.log(`清除定时任务`)
    if (this.interval1){
      clearInterval(this.interval1)
    }
    if (this.interval4){
      clearInterval(this.interval4)
    }
    if (this.interval5){
      clearInterval(this.interval5)
    }
  }
}
module.exports = {
  jumpGameFunction
}
