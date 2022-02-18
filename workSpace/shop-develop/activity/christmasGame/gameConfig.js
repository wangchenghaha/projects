class gameConfig {
    constructor(page,opts){
        this.page = page
        this.imgs = opts.imgs
        this.topHeight = opts.topHeight
        this.callback = opts.callback
        
        // 静态变量
        this.isHeng = false
        this.touchStartX = 0
        this.touchStartY = 0
        this.canTouch = true //联合this.isEndTouch控制人物移动
        this.isEndTouch = true  //是否松开手指

        this.page.animationiteration = this.animationiteration.bind(this)
        this.page.touchstart = this.touchstart.bind(this)
        this.page.touchmove = this.touchmove.bind(this)

        // 动态变量
        this.overTime = 0
        this.renwuIndex = 1
        this.renwuJump = false
        this.jumpDusi = 0


        this.shuAnimateStatu = 'paused',
        this.animateStatus = 'paused'
        

        let xuehuaDatas = []
        this.imgs.xuehuaArr.forEach(item => {
            xuehuaDatas.push(item)
        });

        this.page.setData({
            overTime : this.overTime,
            renwuIndex : this.renwuIndex,
            renwuJump : this.renwuJump,
            jumpDusi : this.jumpDusi,
            xuehuaDatas,
            shuAnimateStatu : this.shuAnimateStatu,
            animateStatus : this.animateStatus
        })
    }

    jiance(){
        // 下面数值都是px
        let windowHeight = wx.getSystemInfoSync().windowHeight
        console.log(`屏幕高度:${windowHeight}`)

        let a = this.topHeight / 750 * wx.getSystemInfoSync().windowWidth;
        console.log(`视图顶部区域:${Math.floor(a)}`)

        let gameArea = windowHeight - a
        console.log(`游戏区域:${gameArea}`)

        let renwuBottom = a + gameArea * 0.2 + (this.imgs.renwuImg.height / 750 * wx.getSystemInfoSync().windowWidth)
        console.log(`人物底部:${renwuBottom}`)
        let renwuTop = renwuBottom - 20
        console.log(`检测顶部:${renwuTop}`)
        

        this.jiance1(renwuTop,renwuBottom)
    }
    jiance1(renwuTop,renwuBottom){
        let _this = this
        const q = wx.createSelectorQuery()
        q.selectAll('.jorz').boundingClientRect()
        q.exec(function (res) {

            let arrs = res[0]
            for(let i=0;i<arrs.length;i++){
                if (arrs[i].top <= renwuBottom && arrs[i].bottom >= renwuTop){
                    if (_this.datas[i].mutou){
                        if (!_this.renwuJump){

                            if (_this.numJson.subIndex != _this.datas[i].subIndex){
                                _this.numJson.subIndex = _this.datas[i].subIndex
                                // 扣分
                                _this.numJson.currentNum = _this.datas[i].imgJson.numText
                                _this.numJson.totalNum += _this.datas[i].imgJson.num
                                if (_this.numJson.totalNum < 0){
                                    _this.numJson.totalNum = 0
                                }
                                _this.numJson.color = 'red'
                                _this.numJson.animate = _this.numJson.animate == 'fenshuAnimate' ? 'fenshuAnimate1' : 'fenshuAnimate'
                                _this.datas[i].imgJson.img = _this.imgs.toumingImg
                                _this.page.setData({
                                    datas : _this.datas,
                                    numJson : _this.numJson
                                })
                            }

                        }
                    }
                    else if(_this.renwuIndex == _this.datas[i].weizhi){
                        if (!_this.renwuJump){

                            if (_this.numJson.subIndex != _this.datas[i].subIndex){
                                _this.numJson.subIndex = _this.datas[i].subIndex
                                if (_this.datas[i].isJiangPin){
                                    // 加分
                                    _this.numJson.color = 'orange'
                                }
                                else{
                                    // 扣分
                                    _this.numJson.color = 'red'
                                }
                                _this.numJson.currentNum = _this.datas[i].imgJson.numText
                                _this.numJson.totalNum += _this.datas[i].imgJson.num
                                if (_this.numJson.totalNum < 0){
                                    _this.numJson.totalNum = 0
                                }
                                _this.numJson.animate = _this.numJson.animate == 'fenshuAnimate' ? 'fenshuAnimate1' : 'fenshuAnimate'
                                _this.datas[i].imgJson.img = _this.imgs.toumingImg
                                _this.page.setData({
                                    datas : _this.datas,
                                    numJson : _this.numJson
                                })
                            }
                            
                        }
                        else{
                            if (!_this.datas[i].isJiangPin){
                                if (_this.numJson.subIndex != _this.datas[i].subIndex){
                                    _this.numJson.subIndex = _this.datas[i].subIndex
                                    // 扣分
                                    _this.numJson.currentNum = _this.datas[i].imgJson.numText
                                    _this.numJson.totalNum += _this.datas[i].imgJson.num
                                    _this.numJson.color = 'red'
                                    if (_this.numJson.totalNum < 0){
                                        _this.numJson.totalNum = 0
                                    }
                                    _this.numJson.animate = _this.numJson.animate == 'fenshuAnimate' ? 'fenshuAnimate1' : 'fenshuAnimate'

                                    _this.datas[i].imgJson.img = _this.imgs.toumingImg
                                    _this.page.setData({
                                        datas : _this.datas,
                                        numJson : _this.numJson
                                    })
                                }
                            }
                        }

                    }
                }

            }
            // console.log(`aaaaaaa:${JSON.stringify(arrs)}`)
            if (_this.overTime > 0){
                _this.timeout3 = setTimeout(() => {
                    _this.jiance1(renwuTop,renwuBottom)
                }, 200);
            }
        })

    }

    makeDatas(i){

            const jiangArrsAll = [
                {
                    img : `${this.imgs.imgPath}jiang1.png`,
                    width : 182,
                    height : 205,
                    num : 120,
                    numText : '+120'
                },
                {
                    img : `${this.imgs.imgPath}jiang2.png`,
                    width : 152,
                    height : 177,
                    num : 80,
                    numText : '+80'
                },
                {
                    img : `${this.imgs.imgPath}jiang3.png`,
                    width : 138,
                    height : 176,
                    num : 100,
                    numText : '+100'
                },
                {
                    img : `${this.imgs.imgPath}jiang4.png`,
                    width : 187,
                    height : 235,
                    num : 200,
                    numText : '+200'
                }
            ]

            const zhangaiArrsAll = [
                {
                    img : `${this.imgs.imgPath}zhangai1.png`,
                    width : 206,
                    height : 431,
                    num : -100,
                    numText : '-100'
                },
                {
                    img : `${this.imgs.imgPath}zhangai2.png`,
                    width : 608,
                    height : 259,
                    num : -120,
                    numText : '-120'
                }
        
            ]

        const jiangArrsFOL = [
            {
                img : `${this.imgs.imgPath}jiang1.png`,
                width : 182,
                height : 205,
                num : 24,
                numText : '+24'
            },
            {
                img : `${this.imgs.imgPath}jiang2.png`,
                width : 152,
                height : 177,
                num : 16,
                numText : '+16'
            },
            {
                img : `${this.imgs.imgPath}jiang3.png`,
                width : 138,
                height : 176,
                num : 20,
                numText : '+20'
            },
            {
                img : `${this.imgs.imgPath}jiang4.png`,
                width : 187,
                height : 235,
                num : 40,
                numText : '+40'
            }
        ]

        const zhangaiArrsFOL = [
            {
                img : `${this.imgs.imgPath}zhangai1.png`,
                width : 206,
                height : 431,
                num : -20,
                numText : '-20'
            },
            {
                img : `${this.imgs.imgPath}zhangai2.png`,
                width : 608,
                height : 259,
                num : -24,
                numText : '-24'
            }
    
        ]

        let jiangArrs = [] 
        let zhangaiArrs = []

        if(getApp().config.brand === 'FOL'){
            jiangArrs = jiangArrsFOL
            zhangaiArrs = zhangaiArrsFOL
        } else {
            jiangArrs = jiangArrsAll
            zhangaiArrs = zhangaiArrsAll
        }

        // 位置
        let weizhiRan = Math.floor(Math.random() * 3 + 0)
        // 障碍物还是奖品
        let zorjRan = Math.floor(Math.random() * 101 + 0)

        let isJiangPin = false
        let mutou = false
        let imgJson = {}
        
        if (zorjRan >= 20 && zorjRan <= 90){
        isJiangPin = true
        let jiangpinRan = Math.floor(Math.random() * jiangArrs.length + 0)
        imgJson = jiangArrs[jiangpinRan]
        mutou = false
        this.isHeng = false
        }
        else{
        isJiangPin = false
        let zhangaiRan = Math.floor(Math.random() * zhangaiArrs.length + 0)
        imgJson = zhangaiArrs[zhangaiRan]
        mutou = false

        if (zhangaiRan == zhangaiArrs.length - 1){
            if (this.isHeng){
            imgJson = zhangaiArrs[0]
            mutou = false
            this.isHeng = false
            }
            else{
            this.isHeng = true
            mutou = true
            weizhiRan = 1
            }
        }
        }


        let json = {
        weizhi : weizhiRan,
        isJiangPin,
        imgJson,
        mutou,
        subIndex : Date.now() + i
        }

        return json

    }

    animationiteration(e){
        let index = e.currentTarget.id
        

        let json = this.makeDatas(index)

        this.datas.splice(index,1,json)
        this.page.setData({datas : this.datas})
    }

    /****************** 手指移动相关逻辑 ******************/
    touchstart(e){
        if (!this.canTouch){
        console.log(`a:${!this.canTouch}`)
        return
        }
        if (!this.isEndTouch){
        console.log(`b:${!this.isEndTouch}`)
        return
        }

        this.touchStartX = e.touches[0].pageX
        this.touchStartY = e.touches[0].pageY  
    }
    touchmove(e){
        if (!this.canTouch){
        return
        }
        if (!this.isEndTouch){
        return
        }
        
        // console.log(`移动:${JSON.stringify(e)}`)
        let tempX = e.touches[0].pageX
        let tempY = e.touches[0].pageY
        let x = tempX - this.touchStartX
        let y = tempY - this.touchStartY


        if (Math.abs(x) >= Math.abs(y)) {
            if (x < 0){
                this.jumpDusi = 0.2
                // 左
                if (this.renwuIndex == 0){
                    this.page.setData({jumpDusi : this.jumpDusi})
                    return
                }
                else{
                    this.renwuIndex -= 1
                }
            }
            else if (x > 0){
                this.jumpDusi = 0.2
                // 右
                if (this.renwuIndex == 2){
                    this.page.setData({jumpDusi : this.jumpDusi})
                    return
                }
                else{
                    this.renwuIndex += 1
                }
            }
            this.page.setData({
                renwuIndex : this.renwuIndex,
                jumpDusi : this.jumpDusi
            })

            this.canTouch = false
            this.timeout1 = setTimeout(() => {
                this.canTouch = true
            }, this.jumpDusi * 1000);
        }
        else{
        
            if (y < 0){
                
                this.jumpDusi = 0.5
                // 上
                this.renwuJump = true

                this.page.setData({
                    renwuJump : this.renwuJump,
                    jumpDusi : this.jumpDusi
                })

                
                this.timeout1 = setTimeout(() => {
                    this.renwuJump = false
                    this.page.setData({
                        renwuJump : this.renwuJump
                    })
                }, this.jumpDusi * 1000);

                this.canTouch = false
                this.isEndTouch = false
                this.timeout4 = setTimeout(() => {
                    this.canTouch = true
                    this.isEndTouch = true
                    this.touchStartX = e.touches[0].pageX
                    this.touchStartY = e.touches[0].pageY  
                }, this.jumpDusi * 2 * 1000);
            }
        }

    }

    downNum(){
        this.timeout2 = setTimeout(() => {
            this.overTime -= 1
            if (this.overTime == 0){

                this.shuAnimateStatu = 'paused',
                this.animateStatus = 'paused' //paused
                this.page.setData({
                    overTime : this.overTime,
                    shuAnimateStatu : this.shuAnimateStatu,
                    animateStatus : this.animateStatus
                })
                if (this.callback){
                    this.callback(this.numJson)
                }
            }
            else{
                this.page.setData({
                    overTime : this.overTime
                })
                this.downNum()
            }
            
        }, 1000);
    }
    reload(){
        this.shuAnimateStatu = 'running',
        this.animateStatus = 'running' //paused
        this.overTime = 30

        this.datas = []
        for (let i=0;i<6;i++){
            this.datas.push(this.makeDatas(i))
        }
        this.numJson = {
            totalNum : 0,
            currentNum : '',
            subIndex : 0,
            color : '',
            animate : 'fenshuAnimate'
        }
        
        this.page.setData({
            datas : this.datas,
            numJson : this.numJson,
            overTime : this.overTime,
            shuAnimateStatu : this.shuAnimateStatu,
            animateStatus : this.animateStatus
        })

        this.downNum()
        this.jiance()

    }
    dealloc(){
        if (this.timeout1){
            clearTimeout(this.timeout1)
        }
        if (this.timeout3){
            clearTimeout(this.timeout3)
        }
        if (this.timeout2){
            clearTimeout(this.timeout2)
        }
        if(this.timeout4){
            clearTimeout(this.timeout4)
        }
    }

}
module.exports = {
    gameConfig
}