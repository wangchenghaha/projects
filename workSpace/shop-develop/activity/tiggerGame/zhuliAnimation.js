class zhuliAnimation {
    constructor (pageContext,opts){
        this.page = pageContext
        this.len = opts.len //个数
        this.ret = opts.ret //结束位置
        this.page.start = this.start.bind(this)
        this.callBack = opts.callBack
        this.speed = opts.speed

        this.speeds = opts.speed
    }
    start(){
        let range = Math.floor(Math.random() * 2 + 2)
        this.animation(range,0)
    }
    animation(range,count){
        let {len,ret,callBack,speeds} = this

        setTimeout(() => {
            count++
            if (count > range * len){
                // 减速
                this.speed = speeds * 2
            }
            if (count != (range + 1) * len + ret){
                // 圈数
                this.animation(range,count)
            }
            else{
                // 结束回调
                callBack && callBack()
            }
            // console.log(`速度:${this.speed}`)
            // console.log(`下标:${count % len == 0 ? len : count % len}`)
            this.page.setData({
                zhuliAnimationData : {
                    index : count % len == 0 ? len : count % len
                }
            })
            
        }, this.speed);
    }
}
module.exports = {
    zhuliAnimation
}