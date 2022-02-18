let _lastTime = null
class Utils {
    constructor() {
        this.throttle = this.throttleFn(); // 节流
        this.debounce = this.debounceFn(); // 防抖
    }
    
    throttleFn() {
        var lastTime = 0;
        return function (handler, wait = 1000) {
            var nowTime = new Date().getTime();
            if (nowTime - lastTime > wait) {
                handler && handler();
                lastTime = nowTime;
            }
        }
    }
    // throttle(fn, gapTime) {
    //     if (gapTime == null || gapTime == undefined) {
    //         gapTime = 1000
    //     }
    //     return function () {
    //         let _nowTime = + new Date()
    //         if (_nowTime - _lastTime > gapTime || !_lastTime) {
    //             fn()
    //             _lastTime = _nowTime
    //         }
    //     }
    // }

    /**
     * 防抖适用场景：搜索框
     * @param {function} handler 进行防抖的函数
     * @param {number} delay 等待时间ms
     */
    debounceFn() {
        var timer = null;
        return function (handler, delay = 1000) {
            clearTimeout(timer);
            timer = setTimeout(function () {
                handler && handler();
            }, delay);
        }
    }

    /**
     * 判断大小屏幕
     */
    judgeBigScreen() {
        let result = false;
        const res = wx.getSystemInfoSync();
        const rate = res.windowHeight / res.windowWidth;
        let limit = res.windowHeight == res.screenHeight ? 1.8 : 1.652; // 临界判断值
        if (rate > limit) {
            result = true;
        }
        return result;
    }

    // 处理入参
    // 整理options参数
    formatOptions(options) {
        return new Promise((resolve, reject) => {
            if (!options || !Object.keys(options).length) {
                resolve({
                    big_channel: 'QTQD',
                    small_channel: 'QTQD',
                    utm_term: 'VM_Princess20200520',
                    utm_campaign: 'VM_Princess',
                    is_share: 0
                })
            } else {
                if (!options.scene) {
                    let Objects = Object.assign({}, options)
                    if (!Objects.hasOwnProperty('big_channel')) {
                        Objects.big_channel = ''
                    }
                    if (!Objects.hasOwnProperty('small_channel')) {
                        Objects.small_channel = ''
                    }
                    if (!Objects.hasOwnProperty('utm_term')) {
                        Objects.utm_term = ''
                    }
                    if (!Objects.hasOwnProperty('utm_campaign')) {
                        Objects.utm_campaign = ''
                    }
                    if (!Objects.hasOwnProperty('is_share')) {
                        Objects.is_share = 0
                    }
                    resolve(Objects)
                } else {
                    let Objects = new Object()
                    let scene = decodeURIComponent(options.scene)
                    let arrPara = scene.split("&")
                    arrPara.forEach(el => {
                        let arr = el.split('=')
                        Objects[arr[0]] = unescape(arr[1]) || ''
                    })
                    if (!Objects.hasOwnProperty('big_channel')) {
                        Objects.big_channel = ''
                    }
                    if (!Objects.hasOwnProperty('small_channel')) {
                        Objects.small_channel = ''
                    }
                    if (!Objects.hasOwnProperty('utm_term')) {
                        Objects.utm_term = ''
                    }
                    if (!Objects.hasOwnProperty('utm_campaign')) {
                        Objects.utm_campaign = ''
                    }
                    if (!Objects.hasOwnProperty('is_share')) {
                        Objects.is_share = 0
                    }
                    resolve(Objects)
                }
            }
        })
    }
    GetQueryString(url, name) {
        console.log(url, name);
        const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`);
        const link = decodeURIComponent(url);
        const r = link.split('?')[1].match(reg);

        if (r != null) return unescape(r[2]);
        return null;
    }

    // 分享
    share() {
        let op = wx.getStorageSync('princessOtions');
        let { big_channel, small_channel, utm_term, utm_campaign } = op
        return {
            imageUrl: 'https://tc.woaap.com/lingzhi/princess/share.png',
            title: '玩小游戏赢好礼，解锁你的本命公主心！',
            path: `/subPackFile/prc/p/a/index?big_channel=${big_channel}&small_channel=${small_channel}&utm_term=${utm_term}&utm_campaign=${utm_campaign}&is_share=1`
        }
    }
}
export default new Utils()