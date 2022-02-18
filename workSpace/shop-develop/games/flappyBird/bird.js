
/**
 * 
 * 
 *      小鸟游戏 小鸟逻辑
 * 
 */
class bird {
    constructor(brand,canvas,cvs,imgPath,callback){
        this.imgPath = imgPath
        this.cvs = cvs

        this.upSpeed = 0.007
        this.downSpeed = 0.0014

        let url = `${this.imgPath}/bird.png`
        if (brand === 'ONLY' || brand === 'VEROMODA'){
            url = `${this.imgPath}/bird1.png`
        }
        this.imgInfo = {
            url,
            width:89,
            height:108
        }

        this.x = 80
        this.y = (wx.getSystemInfoSync().windowHeight - this.imgInfo.height) / 2

        this.birdImg = canvas.createImage()
        this.birdImg.src = this.imgInfo.url
        this.birdImg.onload = (res) => {
            if (callback){
                callback()
            }
        }
    }

    draw(speed){
        this.upSpeed = this.upSpeed + this.downSpeed * speed
        this.y = this.y + this.upSpeed * speed

        this.upDate()
    }
    upDate(){
        // this.cvs.save();
    
        // this.cvs.translate(this.x ,this.y);
        // this.cvs.rotate((Math.PI /6) * this.upSpeed / 0.3 );
        // this.cvs.drawImage(this.birdImg, 0, 0, this.imgInfo.width, this.imgInfo.height,-(this.imgInfo.width) / 2,-(this.imgInfo.height) / 2,this.imgInfo.width / 2,this.imgInfo.height / 2);
        
        // this.cvs.restore();

        this.cvs.drawImage(this.birdImg, 0, 0, this.imgInfo.width * 2, this.imgInfo.height * 2,this.x,this.y,this.imgInfo.width,this.imgInfo.height);
    }
    
}
module.exports = {
    bird
}