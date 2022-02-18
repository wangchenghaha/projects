class gameConfigs {
    constructor(page,opts){
        this.imgPath = `https://cdn.bestseller.com.cn/assets/common/${getApp().config.brand}/courierImgs/`

        this.page = page
        this.callback = opts.callback
        this.gameImgs_select = opts.gameImgs_select
        this.gameImgs = opts.gameImgs
        this.page.touchend = this.touchend.bind(this)

        this.page.animationend = this.animationend.bind(this)
        this.page.textAnimationend = this.textAnimationend.bind(this)


        this.agin()
    }
    downNum(){
        this.overTime -= 1
        this.overTimeSlider = this.overTime / 30 * 100
        this.page.setData({overTime : this.overTime,overTimeSlider : this.overTimeSlider})

        if (this.overTime == 0){
            this.page.setData({
                gameStatus : 'paused',
                gameOver : true
            })
            if (this.callback){
                this.callback(this.totalNum)
            }
            return
        }
        else if (this.overTime > 20 && this.overTime <= 25){
            
            this.courierDatas.forEach((item, i) => {
                let yanchi = 0.4 * i
                if (i >= 4){
                    yanchi = 0.4 * (i - 1) + 0.1
                }
                item.yanchi = yanchi
                item.shichang = 1.5

                item.tempyanchi = yanchi
                item.tempshichang = 1.5
            });
        }
        else if (this.overTime >= 10 && this.overTime < 20){

            this.courierDatas.forEach((item, i) => {
                let yanchi = 0.3 * i
                if (i >= 3){
                    yanchi = 0.3 * (i - 1) + 0.1
                }
                item.yanchi = yanchi
                item.shichang = 1
                item.tempyanchi = yanchi
                item.tempshichang = 1
            });
        }
        else if (this.overTime >= 0 && this.overTime < 10){

            this.courierDatas.forEach((item, i) => {
                item.shichang = 0.8
                item.tempshichang = 0.8
            });
        }
        this.page.setData({courierDatas : this.courierDatas})
        this.timeout = setTimeout(() => {
            this.downNum()
        }, 1000);
    }
    getParams(bol,i){
      let tapIndexArr = [100,300,500,700,900,1100,1300,1500,1700,1900]
      let width = 261 //rpx
      let height = 290  //rpx
  
      let offset = Math.random() * 0.2 + 0.8
      width = width * offset
      height = height * offset
      
      let left = 0
      let maxRight = wx.getSystemInfoSync().windowWidth * 750 / wx.getSystemInfoSync().windowWidth - width
      let top = 0
      let maxBottom = (wx.getSystemInfoSync().windowHeight - wx.getSystemInfoSync().windowHeight * 0.22) * 750 / wx.getSystemInfoSync().windowWidth - height
  
      let x = Math.floor(Math.random() * maxRight + left)
      let y = Math.floor(Math.random() * maxBottom + top)
  
      let yanchi = 0.5 * i
      if (i >= 5){
          yanchi = 0.5 * (i - 1) + 0.2
      }
      if (bol){
        let json = {
          index : i,
          tapIndex : tapIndexArr[i],
          img : `${this.imgPath}${this.gameImgs[i]}`,
          width,
          height,
          x,y,
          yanchi,
          shichang : 2,
          animate : 'hideAnimate',

          tempshichang : 2,
          tempyanchi : yanchi
        }
        return json
      }
      else{
        let json = {
            x,y
        }
        return json
      }
    }
    agin(){
        this.overTime = 31
        this.overTimeSlider = 100
        this.totalNum = 0   //总积分
        // 保存点击内容
        this.saveTapArrs = []
        this.courierDatas = []
        for (let i=0;i<10;i++){
            this.courierDatas.push(this.getParams(true,i))
        }

        this.page.setData({
            courierDatas : this.courierDatas,
            gameStatus : 'running',
            gameOver : false
        })
        this.downNum()
    }
    dealloc(){
        clearTimeout(this.timeout)
    }
    touchend(e){
        let detail = e.currentTarget.dataset.detail
        

        let bol = false
        try {
            this.saveTapArrs.forEach(item => {
                if (item){

                    if (item.index == detail.index){
                        let a = item
                        let b = detail
                        a.yanchi = 0
                        b.yanchi = 0
                        a.shichang = 0
                        b.shichang = 0
                        a.text = ''
                        b.text = ''
                        a.img = ''
                        b.img = ''
                        if (JSON.stringify(a) === JSON.stringify(b)){
                            bol = true
                            throw new Error('点击过')
                        }
                    }
                    
                }
                
            });
            
        } catch (error) {
            
        }
        if (!bol){
            let num = 5

            let random = Math.floor(Math.random() * 101 + 0)
            let selectImgRandom = Math.floor(Math.random() * this.gameImgs_select.length + 0)
            if (random >= 10 && random <= 90){
                
                num = Math.floor(Math.random() * 2 + 5)
                
                detail.img = this.gameImgs_select[selectImgRandom]
                detail.shichang = this.courierDatas[detail.index].shichang

                this.courierDatas[detail.index].yanchi = 0
                this.courierDatas[detail.index].shichang = 0
            }

            detail.text = `+${num}`
            this.totalNum += num

            this.saveTapArrs.push(detail)

            this.page.setData({
                saveTapArrs : this.saveTapArrs,
                courierDatas : this.courierDatas
            })

        }

    }
    animationend(e){
        let index = e.currentTarget.id
        // console.log(`动画结束:${index}`)
        
        this.courierDatas[index].animate = this.courierDatas[index].animate == 'hideAnimate' ? 'hideAnimate1' : 'hideAnimate'
        this.courierDatas[index].x = this.getParams(false).x
        this.courierDatas[index].y = this.getParams(false).y
        this.courierDatas[index].tapIndex += 1
        this.courierDatas[index].yanchi = this.courierDatas[index].tempyanchi
        this.courierDatas[index].shichang = this.courierDatas[index].tempshichang
        this.page.setData({
            courierDatas : this.courierDatas
        })
    }
    textAnimationend(e){
        let index = e.currentTarget.id
        delete this.saveTapArrs[index]
        this.page.setData({saveTapArrs : this.saveTapArrs})
    }
}
module.exports = {
    gameConfigs
}