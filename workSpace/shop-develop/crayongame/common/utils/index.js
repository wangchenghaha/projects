let _lastTime = null
class Utils {
    /**
   * 节流适用场景：表单提交
   * @param {function} handler 进行节流的函数
   * @param {number} wait 等待时间ms
   */
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
    throttle(fn, gapTime) {
        if (gapTime == null || gapTime == undefined) {
            gapTime = 1000
        }
        return function () {
            let _nowTime = + new Date()
            if (_nowTime - _lastTime > gapTime || !_lastTime) {
                fn()
                _lastTime = _nowTime
            }
        }
    }

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

    // 处理小程序formData


    formData(obj = {}) {
        let result = ''
        for (let name of Object.keys(obj)) {
            let value = obj[name];
            result +=
                '\r\n--XXX' +
                '\r\nContent-Disposition: form-data; name="' + name + '”' +
                '\r\n' +
                '\r\n' + value
        }
        return result + '\r\n--XXX--'

    }

    // 处理入参
    // 整理options参数
    formatOptions(options) {
        return new Promise((resolve, reject) => {
            if (!options || !Object.keys(options).length) {
                resolve({
                    big_channel: 'WXGZ',
                    small_channel: 'WXGZ',
                    utm_term: 'LBXX20200425',
                    utm_campaign: 'LaBiXiaoXin',
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
        let op = wx.getStorageSync('crayonOtions');
        let { big_channel, small_channel, utm_term, utm_campaign } = op
        return {
            imageUrl:'https://tc.woaap.com/lingzhi/crayon/poster/share.png',
            title:'玩小游戏赢好礼，小新帮你打败不开心！',
            path: `/crayongame/pages/index/index?big_channel=${big_channel}&small_channel=${small_channel}&utm_term=${utm_term}&utm_campaign=${utm_campaign}&is_share=1`
        }
    }
}
export default new Utils()