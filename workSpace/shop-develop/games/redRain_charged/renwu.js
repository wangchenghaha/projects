const renwuAction = {}
// 台阶坐标
const taijie = {
  b : 385,
  l : 225,
  // bottom、left目标距离都是70
  offsetL : 76,
  offsetB : 84
}
renwuAction.setTaijie = (that,bgImgHeight) => {
    bgImgHeight = bgImgHeight > 0 ? bgImgHeight : 2488
    let {totalTaijie,renwuJson,processValue} = that.data
    if (totalTaijie >= 0 && totalTaijie < 100){
      renwuJson.b = taijie.b
      renwuJson.l = taijie.l
      renwuJson.tol = renwuJson.l + taijie.offsetL
      renwuJson.type = 'r'
    } else if (totalTaijie >= 100 && totalTaijie < 200){
      renwuJson.b = taijie.b + taijie.offsetB
      renwuJson.l = taijie.l + taijie.offsetL
      renwuJson.tol = renwuJson.l + taijie.offsetL
      renwuJson.type = 'r'
    } else if (totalTaijie >= 200 && totalTaijie < 300){
      renwuJson.b = taijie.b + taijie.offsetB * 2
      renwuJson.l = taijie.l + taijie.offsetL * 2
      renwuJson.tol = renwuJson.l + taijie.offsetL
      renwuJson.type = 'r'
    } else if (totalTaijie >= 300 && totalTaijie < 400){
      renwuJson.b = taijie.b + taijie.offsetB * 3
      renwuJson.l = taijie.l + taijie.offsetL * 3
      renwuJson.tol = renwuJson.l - taijie.offsetL
      renwuJson.type = 'l'
    } else if (totalTaijie >= 400 && totalTaijie < 500){
      renwuJson.b = taijie.b + taijie.offsetB * 4
      renwuJson.l = taijie.l + taijie.offsetL * 2
      renwuJson.tol = renwuJson.l - taijie.offsetL
      renwuJson.type = 'l'
    } else if (totalTaijie >= 500 && totalTaijie < 600){
      renwuJson.b = taijie.b + taijie.offsetB * 5
      renwuJson.l = taijie.l + taijie.offsetL
      renwuJson.tol = renwuJson.l + taijie.offsetL
      renwuJson.type = 'r'
    } else if (totalTaijie >= 600 && totalTaijie < 700){
      renwuJson.b = taijie.b + taijie.offsetB * 6
      renwuJson.l = taijie.l + taijie.offsetL * 2
      renwuJson.tol = renwuJson.l - taijie.offsetL
      renwuJson.type = 'l'
    } else if (totalTaijie >= 700 && totalTaijie < 800){
      renwuJson.b = taijie.b + taijie.offsetB * 7
      renwuJson.l = taijie.l + taijie.offsetL
      renwuJson.tol = renwuJson.l + taijie.offsetL
      renwuJson.type = 'r'
    } else if (totalTaijie >= 800 && totalTaijie < 900){
      renwuJson.b = taijie.b + taijie.offsetB * 8
      renwuJson.l = taijie.l + taijie.offsetL * 2
      renwuJson.tol = renwuJson.l + taijie.offsetL
      renwuJson.type = 'r'
    } else if (totalTaijie >= 900 && totalTaijie < 1000){
      renwuJson.b = taijie.b + taijie.offsetB * 9
      renwuJson.l = taijie.l + taijie.offsetL * 3
      renwuJson.tol = renwuJson.l - taijie.offsetL
      renwuJson.type = 'l'
    } else if (totalTaijie >= 1000 && totalTaijie < 1100){
      renwuJson.b = taijie.b + taijie.offsetB * 10
      renwuJson.l = taijie.l + taijie.offsetL * 2
      renwuJson.tol = renwuJson.l - taijie.offsetL
      renwuJson.type = 'l'
    } else if (totalTaijie >= 1100 && totalTaijie < 1200){
      renwuJson.b = taijie.b + taijie.offsetB * 11
      renwuJson.l = taijie.l + taijie.offsetL
      renwuJson.tol = renwuJson.l + taijie.offsetL
      renwuJson.type = 'r'
    } else if (totalTaijie >= 1200 && totalTaijie < 1300){
      renwuJson.b = taijie.b + taijie.offsetB * 12
      renwuJson.l = taijie.l + taijie.offsetL * 2
      renwuJson.tol = renwuJson.l + taijie.offsetL
      renwuJson.type = 'r'
    } else if (totalTaijie >= 1300 && totalTaijie < 1400){
      renwuJson.b = taijie.b + taijie.offsetB * 13
      renwuJson.l = taijie.l + taijie.offsetL * 3
      renwuJson.tol = renwuJson.l + taijie.offsetL
      renwuJson.type = 'r'
    } else if (totalTaijie >= 1400 && totalTaijie < 1500){
      renwuJson.b = taijie.b + taijie.offsetB * 14
      renwuJson.l = taijie.l + taijie.offsetL * 4
      renwuJson.tol = renwuJson.l - taijie.offsetL
      renwuJson.type = 'l'
    } else if (totalTaijie >= 1500 && totalTaijie < 1600){
      renwuJson.b = taijie.b + taijie.offsetB * 15
      renwuJson.l = taijie.l + taijie.offsetL * 3
      renwuJson.tol = renwuJson.l - taijie.offsetL
      renwuJson.type = 'l'
    } else { 
      renwuJson.b = taijie.b + taijie.offsetB * 15
      renwuJson.l = taijie.l + taijie.offsetL * 3
      renwuJson.tol = renwuJson.l - taijie.offsetL
      renwuJson.type = 'l'
    }
    renwuJson.tob = renwuJson.b + taijie.offsetB


    let height = 40
    if (totalTaijie >= 0 && totalTaijie < 700){
      height = bgImgHeight
    }
    else if (totalTaijie >= 700 && totalTaijie < 1200){
      height = bgImgHeight / 7
    }
    wx.pageScrollTo({
        scrollTop: height,
        duration: 300
      });
    processValue = 85 * (totalTaijie % 100 / 100)
    that.setData({
      renwuJson,
      jumpAnimate : '',
      processValue
    })

  }
  renwuAction.setJindu = (that,bgImgHeight) => {
    let {processValue,totalTaijie,jumpAnimate} = that.data
    processValue = 85 * (totalTaijie % 100 / 100)
    if (processValue === 0 && totalTaijie < 1600){
      jumpAnimate = 'jump'
    }
    if (totalTaijie >= 1600){
      processValue = 85
    }
    that.setData({
      processValue,
      totalTaijie,
      jumpAnimate
    })

    if (jumpAnimate !== ''){
      setTimeout(() => {
        renwuAction.setTaijie(that,bgImgHeight)
      }, 900);

    }
  }

  // 判断游戏是否过期
  renwuAction.checkGameTime = (startTime,endTime) => {
    const currentTime = new Date().getTime()
    if (startTime < currentTime && endTime > currentTime){
        // 在活动范围
        return true
    }
    wx.showModal({
        title: '提示',
        content: '不在活动时间范围内!',
        showCancel: false
    });
    return false
  }
  module.exports = {
    renwuAction
  }
