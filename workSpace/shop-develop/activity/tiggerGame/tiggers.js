class tiggers { 
    constructor (pageContext,opts){
        this.page = pageContext
        this.height = opts.height
        this.len = opts.len

        this.transY1 = 1
        this.endY1 = 1
        this.transY2 = 1
        this.endY2 = 1
        this.transY3 = 1
        this.endY3 = 1

        this.speed = opts.speed
        this.callBack = opts.callBack
        this.page.start = this.start.bind(this)
        this.isCallBack = false //控制回调 只回调一次

        this.isStart = false    //防止连续点击
        this.page.setData({
            tiggersData : {
                transY1 : -opts.height,
                transY2 : -opts.height,
                transY3 : -opts.height
            }
        })
    }
    start(pageEnd1,pageEnd2,pageEnd3){
        this.isCallBack = false
        this.endY1 = pageEnd1
        this.endY2 = pageEnd2
        this.endY3 = pageEnd3
        
        let {height,len,transY1,endY1,transY2,endY2,transY3,endY3,speed,callBack,isStart} = this
        if (isStart) return
        this.isStart = true

        if (transY1 == 1 && transY2 == 1 && transY3 == 1){
            transY1 = -height
            transY2 = -height
            transY3 = -height
        }

        const sRange = Math.floor(Math.random() * 2 + 2)
        const totalHeight = len * height
        const halfSpeed = speed / 2
        const endDis1 = endY1 == 0 ? len * height : endY1 * height
        const endDis2 = endY2 == 0 ? len * height : endY2 * height
        const endDis3 = endY3 == 0 ? len * height : endY3 * height
        let i1 = 1; let i2 = 1; let i3 = 1;
        this.timer = setInterval(() => {
            if (i1 <= sRange){
                transY1 -= speed
                if (Math.abs(transY1) > totalHeight){
                    transY1 += totalHeight
                    i1++
                }
                // console.log(`全速:${Math.abs(transY1)},${totalHeight}`)
            }
            else if (i1 > sRange && i1 < sRange + 2){
                transY1 -= halfSpeed
                if (Math.abs(transY1) > totalHeight){
                    transY1 += totalHeight
                    i1++
                }
                // console.log(`半速`)
            }
            else{
                // console.log(`qqqq:${Math.abs(transY1)} ||||| ${endDis1}`)
                if (transY1 == endDis1) return
                let dropSpeed = (endDis1 + transY1) / halfSpeed
                dropSpeed = dropSpeed > halfSpeed ? halfSpeed : dropSpeed < 1 ? 1 : dropSpeed
                transY1 -= dropSpeed
                transY1 = Math.abs(transY1) > endDis1 ? transY1 = -endDis1 : transY1
                // console.log(`减速`)

            }
            this.timer1 = setTimeout(() => {
                if(i2 <= sRange){
                    transY2 -= speed
                    if (Math.abs(transY2) > totalHeight){
                        transY2 += totalHeight
                        i2++
                    }
                    // console.log(`全速:${Math.abs(transY2)},${totalHeight}`)
                }
                else if (i2 > sRange && i2 < sRange + 2){
                    transY2 -= halfSpeed
                    if (Math.abs(transY2) > totalHeight){
                        transY2 += totalHeight
                        i2++
                    }
                    // console.log(`半速:${Math.abs(transY2)},${totalHeight}`)
                }
                else{
                    if (transY2 == endDis2) return
                    let dropSpeed = (endDis2 + transY2) / halfSpeed
                    dropSpeed = dropSpeed > halfSpeed ? halfSpeed : dropSpeed < 1 ? 1 : dropSpeed
                    transY2 -= dropSpeed
                    transY2 = Math.abs(transY2) > endDis2 ? transY2 = -endDis2 : transY2
                    // console.log(`减速:${Math.abs(transY2)},${totalHeight}`)
                }
            }, 200);
            this.timer2 = setTimeout(() => {
                if (i3 <= sRange){
                    transY3 -= speed
                    if (Math.abs(transY3) > totalHeight){
                        transY3 += totalHeight
                        i3++
                    }
                    // console.log(`全速:${Math.abs(transY3)},${totalHeight}`)
                }
                else if (i3 > sRange && i3 < sRange + 2){
                    transY3 -= halfSpeed
                    if (Math.abs(transY3) > totalHeight){
                        transY3 += totalHeight
                        i3++
                    }
                }
                else{
                    let dropSpeed = (endDis3 + transY3) / halfSpeed;
                    if (endDis3 < 3) {
                        dropSpeed = dropSpeed > halfSpeed ? halfSpeed : dropSpeed < .1 ? .1 : dropSpeed
                    } else if (endDis3 < 5 && endDis3 >= 3) {
                        dropSpeed = dropSpeed > halfSpeed ? halfSpeed : dropSpeed < .3 ? .3 : dropSpeed
                    } else {
                        dropSpeed = dropSpeed > halfSpeed ? halfSpeed : dropSpeed < .5 ? .5 : dropSpeed
                    }
                    transY3 -= dropSpeed
                    transY3 = Math.abs(transY3) > endDis3 ? transY3 = -endDis3 : transY3
                    if (Math.abs(transY3) >= endDis3 && Math.abs(transY2) >= endDis2 && Math.abs(transY1) >= endDis1){
                        // console.log(`停止：${transY1}`)
                        clearInterval(this.timer)
                        clearTimeout(this.timer1)
                        clearTimeout(this.timer2)
                        this.isStart = false
                        this.transY1 = transY1
                        this.transY2 = transY2
                        this.transY3 = transY3
                        if (!this.isCallBack){
                            this.isCallBack = true
                            callBack && callBack()
                        }
                    }
                }
            }, 400);
            this.page.setData({
                tiggersData : {
                    transY1,
                    transY2,
                    transY3
                }
            })
        }, 1000 / 60);
    }
}
module.exports = {
    tiggers
}