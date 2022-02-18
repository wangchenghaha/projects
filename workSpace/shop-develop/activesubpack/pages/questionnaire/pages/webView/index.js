Page({
    data:{
        navHeight:0,
        src:''
    },
    setNav() {
        this.selectComponent('#comp-nav-dynamic').setOptions({
            navBackgroundInit: '#ffffff', // 导航栏背景颜色-初始值
            navBackgroundRoll: '#ffffff', // 导航栏背景颜色-滚动值
            titleColorInit: '#000000', // 文本颜色-初始值 16进制
            titleColorRoll: '#000000', // 文本颜色-滚动值 16进制
            titleTextInit: '', // 标题文字-初始值
            titleTextRoll: '', // 标题文字-滚动值
            historyShow: true, // 历史图标是否显示
            scrollMin: 0, // 最小滚动间距，单位px
            scrollMax: 200, // 最大滚动间距，单位px
            homeShow: true, // home图标是否显示
            homeJudgeStack: true, // home图标显示是否判断页面栈
            homePath: '/pages/newsModule/pages/index/index', // home页面路径
            homeColorInit: 'black', // home图标颜色-初始值 white / black
            homeColorRoll: 'black', // home图标颜色-滚动值 white / black
        })
        this.setData({
            navHeight: this.selectComponent('#comp-nav-dynamic').getNavHeight(),
        })
    },
    onLoad(options){
        this.setNav()
        this.setData({
            src:options.src || ''
        })
    }
})