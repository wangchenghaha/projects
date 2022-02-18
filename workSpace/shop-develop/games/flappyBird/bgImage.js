
/**
 * 
 * 
 *      小鸟游戏 背景逻辑
 * 
 */
class bgImage {
    constructor(brand,width,height,canvas,cvs,imgPath,callback){
        this.imgPath = imgPath
        this.x = 0
        this.y = 0
        this.width = width
        this.height = height
        this.canvas = canvas
        this.cvs = cvs
        
        const url = `${this.imgPath}/gameBg_${brand}.jpg`

        this.bgImg = this.canvas.createImage()
        this.bgImg.src = url
        this.bgImg.onload = (res) => {
            if (callback){
                callback()
            }
        }
    }

    draw(){
        this.cvs.drawImage(this.bgImg, this.x, this.y, this.width, this.height);
    }
}
module.exports = {
    bgImage
}