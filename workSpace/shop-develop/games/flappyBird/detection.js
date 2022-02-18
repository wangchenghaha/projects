
/**
 * 
 * 
 *      小鸟游戏 碰撞检测
 * 
 */
var detection = {}

const windowHeight = wx.getSystemInfoSync().windowHeight
const bili = windowHeight >= 800 ? 0.27 : 0.26  //底部草地占屏幕高度比例
detection.gameOver = (bird,pipe1,pipe2,pipe3,pipe4) => {
    const offset = -5    //检测点偏移
    
    // 顶部和底部
    if (bird.y < 0 || 
        bird.y + bird.imgInfo.height / 2 > windowHeight - windowHeight * bili){
        console.log(`游戏结束`)
        return true
    }
    // 管道
    if (bird.x + bird.imgInfo.width / 2 > pipe1.x && bird.x < pipe1.x + pipe1.imgWidth / 2){
        if (bird.y - offset < pipe1.r || bird.y + offset + bird.imgInfo.height / 2 > pipe1.r + 180){
            return true
        }
    }
    if (bird.x + bird.imgInfo.width / 2 > pipe2.x && bird.x < pipe2.x + pipe2.imgWidth / 2){
        if (bird.y - offset < pipe2.r || bird.y + offset + bird.imgInfo.height / 2 > pipe2.r + 180){
            return true
        }
    }
    if (bird.x + bird.imgInfo.width / 2 > pipe3.x && bird.x < pipe3.x + pipe3.imgWidth / 2){
        if (bird.y - offset < pipe3.r || bird.y + offset + bird.imgInfo.height / 2 > pipe3.r + 180){
            return true
        }
    }
    if (bird.x + bird.imgInfo.width / 2 > pipe4.x && bird.x < pipe4.x + pipe4.imgWidth / 2){
        if (bird.y - offset < pipe4.r || bird.y + offset + bird.imgInfo.height / 2 > pipe4.r + 180){
            return true
        }
    }
    // 计算分数
    
    return false
}
module.exports = {
    detection
}