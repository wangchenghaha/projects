
import {splitGameImg} from '../../utils/utils'

// s默认 n跳起
const animateImgArrs = [
    {
        n : splitGameImg('2021_51_man.png','jumpGames'),
        s : splitGameImg('2021_51_man.png','jumpGames'),
        widthRPX : getApp().config.brand == 'JACKJONES' ? 90 : 116
    },
    {
        n : splitGameImg('2021_51_woman.png','jumpGames'),
        s : splitGameImg('2021_51_woman.png','jumpGames'),
        widthRPX : getApp().config.brand == 'JACKJONES' ? 90 : 116
    }
]


class jumpGameConst {
    constructor (pageContext,opts) {
        this.page = pageContext
        // 判断ios还是android
        this.isIos = false
        

        this.animateIndex = opts.animateIndex
        this.animateImgN = animateImgArrs[this.animateIndex].n
        this.animateImgS = animateImgArrs[this.animateIndex].s

        this.yunImgArrs = [
            {
                img : splitGameImg('jumpGame_yun1.png','jumpGames'),
                widthPX : (getApp().config.brand == 'JACKJONES' ? 177 : 208) / 750 * wx.getSystemInfoSync().windowWidth,
                heightPX : (getApp().config.brand == 'JACKJONES' ? 51 : 118) / 750 * wx.getSystemInfoSync().windowWidth
            },
            {
                img : splitGameImg('jumpGame_yun2.png','jumpGames'),
                widthPX : (getApp().config.brand == 'JACKJONES' ? 132 : 221) / 750 * wx.getSystemInfoSync().windowWidth,
                heightPX : (getApp().config.brand == 'JACKJONES' ? 101 : 120) / 750 * wx.getSystemInfoSync().windowWidth
            },
            {
                img : splitGameImg('jumpGame_yun3.png','jumpGames'),
                widthPX : (getApp().config.brand == 'JACKJONES' ? 90 : 165) / 750 * wx.getSystemInfoSync().windowWidth,
                heightPX : (getApp().config.brand == 'JACKJONES' ? 90 : 96) / 750 * wx.getSystemInfoSync().windowWidth
            },
            {
                img : splitGameImg('jumpGame_yun4.png','jumpGames'),
                widthPX : (getApp().config.brand == 'JACKJONES' ? 113 : 85) / 750 * wx.getSystemInfoSync().windowWidth,
                heightPX : (getApp().config.brand == 'JACKJONES' ? 63 : 52) / 750 * wx.getSystemInfoSync().windowWidth
            },
            {
                img : splitGameImg('jumpGame_yun5.png','jumpGames'),
                widthPX : (getApp().config.brand == 'JACKJONES' ? 302 : 164) / 750 * wx.getSystemInfoSync().windowWidth,
                heightPX : (getApp().config.brand == 'JACKJONES' ? 39 : 105) / 750 * wx.getSystemInfoSync().windowWidth
            },
            {
                img : splitGameImg('jumpGame_yun6.png','jumpGames'),
                widthPX : (getApp().config.brand == 'JACKJONES' ? 177 : 164) / 750 * wx.getSystemInfoSync().windowWidth,
                heightPX : (getApp().config.brand == 'JACKJONES' ? 51 : 105) / 750 * wx.getSystemInfoSync().windowWidth
            }
        ]
        this.chenghaoArrs = {
            'A' : 
            {
                img : splitGameImg('1.png','jumpGames'),
                width : 155
            },
            'B' : { 
                img : splitGameImg('2.png','jumpGames'),
                width : 155
            },
            'C' : {
                img : splitGameImg('3.png','jumpGames'),
                width : 155
            },
            'D' : {
                img : splitGameImg('4.png','jumpGames'),
                width : 155
            },
            'E' : {
                img : splitGameImg('5.png','jumpGames'),
                width : 155
            },
            'F' : {
                img : splitGameImg('6.png','jumpGames'),
                width : 155
            }
        }

        this.chenghaoJson = {}

        
        this.touchstart = 0
        this.touchend = 0

        this.imgHeightRPX = 0
        this.imgHeightPX = 0

        this.yunTop1 = 0
        this.yunTop2 = 0
        this.yunTop3 = 0
        this.yunTop4 = 0
        this.yunTop5 = 0
        // 检测用的下标
        this.jianceIndex0 = 0
        this.jianceIndex1 = 1
        this.jianceIndex2 = 2

        this.jianceIndex4 = 4
        this.jianceIndex3 = 3


        // 游戏页背景图片
        this.indexImgBG = splitGameImg('jumpGame_indexBG1.png','jumpGames'), 



        // 设置游戏速度
        // 当前关卡
        this.currentLeved = 0
        // 跳跃速度
        this.jumpSpeed = 0
        // 滚动速度
        this.duration = 0
        // 刷新障碍物坐标速度
        this.reloadSpeed = 0
        // 通过分数
        this.tongguanNum = 0
        // 通关下落速度
        this.tgBottomSpeed = 0
        
        // 是否是刚开始 刚开始落地能再起
        this.isFirst = true
        // 生命
        this.life = 0
        // 重置jumpTop时 css动画时间
        this.cssAnimateTime = 0.2

        // 跳转高度
        let tempOffset = getApp().config.brand == 'JACKJONES' ? 0.9 : 0.7
        this.jumpHeight = Math.floor(wx.getSystemInfoSync().windowHeight * 0.2 / tempOffset)

        // 创建云彩数据
        this.yunDatas = []
        
        this.currentIndex = 0
        this.currentImg = this.animateImgS
        this.imgWidth = animateImgArrs[this.animateIndex].widthRPX
        this.imgWidthPX = this.imgWidth / 750 * wx.getSystemInfoSync().windowWidth
        this.transformX = 0
        this.transformY = 0
        this.currentNumber = 0  //当前金币
        this.zongNumber = 0 //全部金币数(增加)
        this.tzNumber = 10

        // 分数、每局都清空
        this.fenshu = 0
        this.fenshuArr = []

        // 金币动画
        this.jinbiAnimate = ''

        // 控制通关后弹框
        this.oneBounces = false
        this.twoBounces = false
        
        this.jumpTop = wx.getSystemInfoSync().windowHeight


        // 通关关卡
        this.showTwoGame = false
        this.datas = []
        this.top = 0
        this.transformXTG = (wx.getSystemInfoSync().windowWidth - this.imgWidth / 750 * wx.getSystemInfoSync().windowWidth) / 2
        
        // fol vm需求
        this.bouncedTextJson = {
            canShow : true,
            index : 0,
            texts : getApp().config.brand == 'FOL' ? ['哈尔滨杉杉奥莱店稀罕你','沈阳赛特奥莱店等待你','青岛莱西店想念你','上海百联奥莱店欢喜侬','福州天泽奥莱店惦记你','广州海印又一城店嘿范内','深圳华南城奥莱店钟意你','昆明砂之船奥莱店恋着你','成都佛罗伦萨店好想你','重庆西部奥莱店喜欢你','长沙友阿奥莱店欢喜你','南昌优客奥莱店作兴嫩','武汉百联奥莱店盼望你','西安西恩奥莱店爱介你','兰州杉杉奥莱店祝福你','乌鲁木齐久岛店邀请你','太原杉杉奥莱店待见你','郑州杉杉奥莱店相中恁','石家庄北国奥莱店爱上你','北京首创奥莱店欢迎你'] : ["会穿衣+10","会化妆+5","会搭配+20","会P图+5","颜值高+15","情商高+10","VERO MODA+30"]
        }
    }

    returnDatas(){
        let {chenghaoJson,currentLeved,fenshu,cssAnimateTime,jinbiAnimate,zongNumber,currentNumber,oneBounces,twoBounces,life,indexImgBG,showTwoGame,datas,top,transformXTG,yunDatas,duration,currentIndex,currentImg,imgWidth,transformX,transformY,jumpTop} = this

        this.page.setData({
            chenghaoJson,
            currentLeved,
            fenshu,
            cssAnimateTime,
            jinbiAnimate,
            zongNumber,
            currentNumber,
            oneBounces,
            twoBounces,
            life,
            indexImgBG,
            showTwoGame,
            datas,
            top,
            transformXTG,
            yunDatas,
            duration,
            currentIndex,
            currentImg,
            imgWidth,
            transformX,
            transformY,
            jumpTop
        })
    }
}

module.exports = {
    jumpGameConst
}