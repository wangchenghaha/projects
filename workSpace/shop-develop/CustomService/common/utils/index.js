
let _lastTime = null
export default {
    checkUnionid() {
        return new Promise((resolve,reject) => {
            
        })
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
    }
}