const app = getApp();
let brand = app.config.brand;
let bgimg = ''
let bgimg_s = ''
let brandname = ''

switch (brand) {
    case 'JLINDEBERG':
      brand = 5
      brandname = ''
      bgimg = 'http://tc.woaap.com/lingzhi/newcoupon/jl-bg.png'
      bgimg_s = 'http://tc.woaap.com/lingzhi/newcoupon/jl-bg-s.png'
      break;
    case 'JACKJONES':
      brand = 2
      brandname = 'JACK&JONES'
      bgimg = 'http://tc.woaap.com/lingzhi/newcoupon/jj-bg.png'
      bgimg_s = 'http://tc.woaap.com/lingzhi/newcoupon/jj-bg-s.png'
      break;
    case 'SELECTED':
      brand = 4
      brandname = 'SELECTED'
      bgimg = 'http://tc.woaap.com/lingzhi/newcoupon/slt-bg.png'
      bgimg_s = 'http://tc.woaap.com/lingzhi/newcoupon/slt-bg-s.png'
      break;
    case 'ONLY':
      brand = 1
      brandname = 'ONLY'
      bgimg = 'http://tc.woaap.com/lingzhi/newcoupon/only-bg.png'
      bgimg_s = 'http://tc.woaap.com/lingzhi/newcoupon/only-bg-s.png'
      break;
    case 'VEROMODA':
      brand = 3
      brandname = 'VERO MODA'
      bgimg = 'http://tc.woaap.com/lingzhi/newcoupon/vm-bg.png'
      bgimg_s = 'http://tc.woaap.com/lingzhi/newcoupon/vm-bg-s.png'
      break;
    case 'FOL':
      brand = 6
      brandname = ''
      bgimg = 'http://tc.woaap.com/lingzhi/newcoupon/fol-bg.png'
      bgimg_s = 'http://tc.woaap.com/lingzhi/newcoupon/fol-bg-s.png'
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
    getQueryVariable(url,variable){
        let query = url.split('?')[1]
        if(query) {
          let vars = query.split("&");
          for (let i=0;i<vars.length;i++) {
            let pair = vars[i].split("=");
            if(pair[0] == variable){return pair[1];}
          }
          return(false);
        }
        return(false);
    },
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
    },
    // baseshare(token) {
    //     let path = `/fightgroup/index/index`
    //     if(token) {
    //         path = `/fightgroup/index/index?token=${token}`
    //     }
    //     return {
    //         title,
    //         path,
    //         imageUrl:sharebg
    //     }
    // },
    config : {
        brand,
        bgimg,
        bgimg_s,
        brandname
    }
}

export default main