
/**
 * 
 * 
 *      小鸟游戏 管道
 * 
 */
class pipe {
    constructor(id,x,canvas,cvs,imgPath,callback){
        this.imgPath = imgPath
        this.id = id
        this.x = x
        this.cvs = cvs

        this.imgUrl1 = `${this.imgPath}/pipe1.png`
        this.imgUrl2 = `${this.imgPath}/pipe2.png`
        this.imgWidth = 139
        this.imgHeight = 556
        this.speed = 0.2
        // 小小鸟

        this.imgInfo = {
            url : `${this.imgPath}/smallBird.png`,
            width : 73,
            height : 88
        }
        this.showBird = false

        const windowHeight = wx.getSystemInfoSync().windowHeight
        const bili = windowHeight >= 800 ? 0.27 : 0.26  //底部草地占屏幕高度比例
        
        this.r = Math.random() *200 + 120;
        this.maxHeight = windowHeight - windowHeight * bili

        this.pipeImg1 = canvas.createImage()
        this.pipeImg1.src = this.imgUrl1
        this.pipeImg1.onload = (res) => {

            this.pipeImg2 = canvas.createImage()
            this.pipeImg2.src = this.imgUrl2
            this.pipeImg2.onload = (res) => {

                this.smallBirdImg = canvas.createImage()
                this.smallBirdImg.src = this.imgInfo.url
                this.smallBirdImg.onload = (res) => {
        
                    if (callback){
                        callback()
                    }
        
                }
            }
        }
    }

    draw(t,num,callback,birdCallback){
        this.x = this.x - this.speed * t
        if (this.x >= 0 && this.x <= 50){
            if (callback){
                callback()
            }
            if (this.id === 3 && this.showBird){
                if (birdCallback){
                    birdCallback()
                }
                this.showBird = false
            }
        } else if (this.x <= -this.imgWidth){

            this.r = Math.random() *200 + 120;

            const cont = 4  //一共有多少组管道
            this.x = this.x + cont * 300
            num = Math.ceil(num / 15) * 100
            
            if (num > 500 && this.id === 3){
                this.showBird = Math.random() > 0.3
            }
        }
        this.upDate()
    }

    upDate(){
        if (this.r - this.imgHeight / 2 > 0){
            this.r = this.r - ( this.r - this.imgHeight / 2) - 10
        }
        this.cvs.drawImage(
            this.pipeImg1,0,0,this.imgWidth * 2,this.imgHeight * 2, this.x , this.r - this.imgHeight / 2,this.imgWidth,this.imgHeight
        )
        this.cvs.drawImage(
            this.pipeImg2,0,0,this.imgWidth * 2,(this.maxHeight - (this.r +180)) * 2, this.x , this.r +180,this.imgWidth,(this.maxHeight - (this.r +180))
        )
        if (this.showBird){
            this.cvs.drawImage(
                this.smallBirdImg,0,0,this.imgInfo.width * 2,this.imgInfo.height * 2, this.x + (this.imgWidth / 2 - this.imgInfo.width / 2) / 2 ,this.r + (180 - this.imgInfo.height / 2) / 2,this.imgInfo.width,this.imgInfo.height
            )
        }
    }
    // 重新开始
    restart(x){
        this.showBird = false
        this.r = Math.random() *200 + 120;
        this.x = x
    }

}
module.exports = {
    pipe
}