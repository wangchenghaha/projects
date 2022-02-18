// import img from '../model/img-model'
const app = getApp();
let brand = app.config.brand;

let title = ''
let sharebg = ''

switch (brand) {
    case 'JLINDEBERG':
      brand = 5
      title = '五人成团，壕放470元神券大礼包！全场通用！'
      break;
    case 'JACKJONES':
      brand = 2
      title = '五人成团，壕放390元神券大礼包！全场通用！'
      break;
    case 'SELECTED':
      brand = 4
      title = '五人成团，壕放390元神券大礼包！全场通用！'
      break;
    case 'ONLY':
      brand = 1
      title = '五人成团，壕放390元神券大礼包！全场通用！'
      break;
    case 'VEROMODA':
      brand = 3
      title = '五人成团，壕放1680元神券大礼包！全场通用！'
      break;
    case 'FOL':
      brand = 6
      title = '五人成团，壕放390元神券大礼包！全场通用！'
      break;
  }

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
    baseshare(token) {
        let path = `/fightgroup/index/index`
        if(token) {
            path = `/fightgroup/index/index?token=${token}`
        }
        return {
            title,
            path,
            imageUrl:sharebg
        }
    },
    config : {
        brand
    }
}

export default main