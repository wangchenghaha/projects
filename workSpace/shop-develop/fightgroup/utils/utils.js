import img from '../model/img-model'
const app = getApp();
let brand = app.config.brand;
let title = ''
let sharebg = img.share

switch (brand) {
    case 'JLINDEBERG':
        brand = 5
        title = '3人成团，壕放790元优惠券大礼包！全场通用！'
        break;
    case 'JACKJONES':
        brand = 2
        title = '3人成团，畅享270元优惠券大礼包！全场通用！'
        break;
    case 'SELECTED':
        brand = 4
        title = '邀请好友来拼团，一起领取100元神券礼包及精美潮流配饰！'
        break;
    case 'ONLY':
        brand = 1
        title = '闺蜜集结！组队抢新年转运红包封面！'
        break;
    case 'VEROMODA':
        brand = 3
        title = '3人成团，壕放340元优惠券大礼包！全场通用！'
        break;
    case 'FOL':
        brand = 6
        title = '送您153元专享礼包，一起放肆随心购！'
        break;
}
let _lastTime = null
const main = {
    debounce(fn, time = 300) {
        var timer = null
        return function() {
            var args = arguments
            var ctx = this
            clearTimeout(timer)
            timer = setTimeout(function() {
                fn.apply(ctx, args)
            }, time)
        }
    },
    judgeBigScreen() {
        let result = false;
        const res = wx.getSystemInfoSync();
        const rate = res.windowHeight / res.windowWidth;
        let limit = res.windowHeight == res.screenHeight ? 1.8 : 1.65; // 临界判断值
        if (rate > limit) {
            result = true;
        }
        return result;
    },
    getQueryVariable(url, variable) {
        // let query = url.split('?')[1]
        let vars = url.split("&");
        for (let i = 0; i < vars.length; i++) {
            let pair = vars[i].split("=");
            if (pair[0] == variable) { return pair[1]; }
        }
        return (false);
    },
    throttle(fn, gapTime) {
        if (gapTime == null || gapTime == undefined) {
            gapTime = 1000
        }
        return function() {
            let _nowTime = +new Date()
            if (_nowTime - _lastTime > gapTime || !_lastTime) {
                fn()
                _lastTime = _nowTime
            }
        }
    },
    baseshare(token) {
        let path = `/fightgroup/index/index`
        if (token) {
            path = `/fightgroup/index/index?token=${token}`
        }
        return {
            title,
            path,
            imageUrl: sharebg
        }
    },
    config: {
        brand
    }
}

export default main