import {splitGameImg, timeFormat} from '../../utils/utils'

class gameConfig {
    constructor(page,opts){
        this.page = page
        this.imgs = opts.imgs
        this.topHeight = opts.topHeight
        this.callback = opts.callback
        
        // 静态变量
        this.touchStartX = 0

        this.page.animationiteration = this.animationiteration.bind(this)
        this.page.touchstart = this.touchstart.bind(this)
        this.page.touchmove = this.touchmove.bind(this)
        this.page.touchend = this.touchend.bind(this)

        // 动态变量
        this.overTime = 0
        this.animationPlayState = 'paused',
      
        this.page.setData({
            overTimer : timeFormat(this.overTime),
            animationPlayState : this.animationPlayState,
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

        // let renwuBottom = a + gameArea * 0.2 + (this.imgs.renwuImg.height / 750 * wx.getSystemInfoSync().windowWidth)
        let renwuBottom =  wx.getSystemInfoSync().windowHeight - 68;
        console.log(`人物底部:${renwuBottom}`)
        let renwuTop = renwuBottom - 138
        console.log(`检测顶部:${renwuTop}`)

        this.jiance1(renwuTop)
    }
    jiance1(renwuTop){
        let _this = this
        let {transformX, datas, showPoint, currentPoint, pointAnimate, zadianshu} = this.page.data
        const q = wx.createSelectorQuery()
        q.selectAll('.views').boundingClientRect()
        q.exec(function (res) {
            let arrs = res[0]
            for(let i=0;i<arrs.length;i++){
                if(arrs[i].dataset.data){
                    if (arrs[i].bottom >= renwuTop){
                        if(arrs[i].left >= transformX && arrs[i].left <= transformX + 90){
                            datas[i].imageUrl = "";
                            showPoint = true;
                            if(datas[i].Type  === 'HongBao'){
                                currentPoint = currentPoint + datas[i].jifen
                            } else {
                                zadianshu = zadianshu + 1;
                                currentPoint = currentPoint - datas[i].jifen
                            }
                            if(zadianshu >= 3){
                                _this.overGame();
                            }
                            pointAnimate = pointAnimate == 'fenshuAnimate' ? 'fenshuAnimate1' : 'fenshuAnimate'
                            _this.page.setData({
                                datas,
                                showPoint,
                                currentPoint,
                                pointAnimate,
                                zadianshu,
                                points: datas[i].Type  === 'HongBao' ? '+'+datas[i].jifen : '-'+ datas[i].jifen,
                                txtColor:  datas[i].Type  === 'HongBao' ? '#FFD700' : '#696969',
                            })
                        }
                    }
                }
            }
            if (_this.overTime > 0){
                _this.timeout3 = setTimeout(() => {
                    _this.jiance1(renwuTop)
                }, 250);
            }
        })

    }

    makeData(index, anim){
        // 宽度* 随机0.8~1倍
        let offset = Math.random() * 0.2 + 0.8
        let width = 120 * offset
        let height = width

        // 角度 -10~10随机
        let angle = Math.floor(Math.random() * 20 + -10)
        // 位置 5~右边距 - 5
        let left = Math.floor(Math.random() * (wx.getSystemInfoSync().windowWidth * 750 / wx.getSystemInfoSync().windowWidth - width - 5) + 5)
        // 速度1~2
        let speed = Math.random() * 1 + 1.5

        // 积分 1~5
       // let jifen = Math.floor(Math.random() * 6 + 3)
        // z-index
        let z_index = index + 1
        // 红包图片
        let hongbaoImg = Math.floor(Math.random() * 6 + 1)

        let json = {
            width,
            height,
            angle,
            left,
            speed,
            z_index,
           // jifen,
            hongbaoImg,
            animation : anim,
            createTime: new Date().getTime(),
        }
        let zorjRan = Math.floor(Math.random() * 101 + 0)
        if(zorjRan >= 10 && zorjRan <= 90){
            json.Type = "HongBao"
            json.jifen = 10,
            json.imageUrl = splitGameImg('hongbao_img.png', 'redEnvelop')
        } else {
            json.Type = "ZaoDan"
            json.width = 160 * offset;
            json.height = json.width;
            json.jifen = 5,
            json.imageUrl = splitGameImg('zadian_img.png', 'redEnvelop')
        }
        return json;
    }


    makeYudian(index){
        let _this = this;
        // 宽度 45~80随机
        let width = 50
        let height = 187
        // 位置 5~右边距 - 5
        let left = Math.floor((Math.random() * (wx.getSystemInfoSync().windowWidth * 750 / wx.getSystemInfoSync().windowWidth - width - 5)) + 5)
        // 速度1~4
        let speed = 3
        // z-index
        let z_index = index + 1

        let json = {
            width,
            height,
            left,
            speed,
            z_index,
            animation : 'animate'
        }
        let yudianDatas = _this.page.data.yudianDatas
        
        yudianDatas.push(json)
        _this.page.setData({yudianDatas})
        if (index < 10){
            _this.timeout1 = setTimeout(() => {
                _this.makeYudian(index + 1)
            }, 500);
        }
    }

    animationiteration(e){
        let {datas} = this.page.data;
        let data = e.currentTarget.dataset.data;
        for (let i = 0; i < datas.length; i++) {
            if(datas[i].z_index === data.z_index){
                if(datas[i].createTime === data.createTime){
                    this.page.makeDatas(i, 999)
                }
            }
        }
    }

    /****************** 手指移动相关逻辑 ******************/
    touchstart(e){
        if (!e.touches){
            return
          }
        this.page.setData({
            touchstart: e.touches[0].pageX
        })
    }

    touchmove(e){
        if (!e.touches){
            return
        }
        let {transformX, touchstart, touchend, imgWidth} = this.page.data;
        let tempX = e.touches[0].pageX 
        transformX = tempX - touchstart + touchend
        // 移动图片边界计算
        if (transformX < 0){
            transformX = 0
        } else if (transformX > wx.getSystemInfoSync().windowWidth - imgWidth / 750 * wx.getSystemInfoSync().windowWidth){
            transformX = wx.getSystemInfoSync().windowWidth - imgWidth / 750 * wx.getSystemInfoSync().windowWidth
        }
        this.page.setData({
            transformX,
        })
    }

    touchend(e){ 
        let {transformX} = this.page.data;
        this.page.setData({
            touchend: transformX,
        })
    }

    downNum(){
        this.timeout2 = setTimeout(() => {
            this.overTime -= 1
            if (this.overTime == 0){

                this.animationPlayState = 'paused',
                this.page.setData({
                    overTimer : timeFormat(this.overTime),
                    animationPlayState : this.animationPlayState,
                })
                if (this.callback){
                    this.callback(this.numJson)
                }
            }
            else{
                this.page.setData({
                    overTimer : timeFormat(this.overTime),
                })
                this.downNum()
            }
            
        }, 1000);
    }

    overGame(){
        this.dealloc()
        this.animationPlayState = 'paused',
        this.overTime = 0
        this.page.setData({
            overTimer : timeFormat(this.overTime),
            animationPlayState : this.animationPlayState,
            zadianshu: 0,
        })
        if (this.callback){
            this.callback(this.numJson)
        }
    }

    reload(){
        this.animationPlayState = 'running',
        this.overTime = 30

        this.datas = []
        for (let i=0;i<2;i++){
            this.datas.push(this.makeData(i))
        }
        this.numJson = {
            totalNum : 0,
            currentNum : '',
            subIndex : 0,
            color : '',
            pointAnimate : 'fenshuAnimate'
        }
        
        this.page.setData({
            datas : this.datas,
            numJson : this.numJson,
            overTimer : timeFormat(this.overTime),
            animationPlayState : this.animationPlayState,
        })

        this.downNum()
        this.jiance()

    }
    dealloc(){
        if(this.timeout1){
            clearTimeout(this.timeout1)
        }
        if (this.timeout2){
            clearTimeout(this.timeout2)
        }
        if (this.timeout3){
            clearTimeout(this.timeout3)
        }
    }

}
module.exports = {
    gameConfig
}