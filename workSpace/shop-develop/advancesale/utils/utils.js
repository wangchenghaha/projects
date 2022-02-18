const app = getApp();
let brand = app.config.brand;

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
        // let query = url.split('?')[1]
        let vars = url.split("&");
        for (let i=0;i<vars.length;i++) {
          let pair = vars[i].split("=");
          if(pair[0] == variable){return pair[1];}
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
        brand
    }
}

export default main