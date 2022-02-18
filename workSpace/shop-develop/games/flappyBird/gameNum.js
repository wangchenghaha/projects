
/**
 * 
 * 
 *      小鸟游戏 分数
 * 
 */
class gameNum {
    constructor(canvas,cvs,imgPath,callback){
        this.imgPath = imgPath
        this.cvs = cvs
        this.imgInfo = {
            url : `${this.imgPath}/numBg.png`,
            width:114 / 2,
            height:110 / 2
        }

        this.smallBirdImgInfo = {
            url : `${this.imgPath}/birdBg.png`,
            width:86 / 2,
            height:110 / 2
        }
    
        this.numImg = canvas.createImage()
        this.numImg.src = this.imgInfo.url
        this.numImg.onload = (res) => {
            this.smallBirdImg = canvas.createImage()
            this.smallBirdImg.src = this.smallBirdImgInfo.url
            this.smallBirdImg.onload = (res) => {
                if (callback){
                    callback()
                }
            }
        }
    }

    setNum(num,birdNum){
        const {cvs,numImg,smallBirdImg,imgInfo,smallBirdImgInfo} = this
        num = Math.ceil(num / 15) * 100
        // 分数栏
        cvs.drawImage(numImg,20,50,imgInfo.width,imgInfo.height);
        
        //字体
        cvs.font = `normal 14px sans-serif`;
        cvs.lineWidth = 1;
        let strWidth = cvs.measureText(num+``).width

        cvs.strokeStyle = `#3F87FC`;
        cvs.strokeText(num, 20 +(imgInfo.width - strWidth) / 2, 50 + imgInfo.height - 5);
        cvs.fillStyle = `white`;

        cvs.fillText(num,  20 +(imgInfo.width - strWidth) / 2, 50 + imgInfo.height - 5);

        // 小鸟分数栏
        // 分数栏
        cvs.drawImage(smallBirdImg,100,50,smallBirdImgInfo.width,smallBirdImgInfo.height);
        
        //字体
        cvs.font = `normal 14px sans-serif`;
        cvs.lineWidth = 1;
        strWidth = cvs.measureText(birdNum+``).width

        cvs.strokeStyle = `#3F87FC`;
        cvs.strokeText(birdNum, 100 +(smallBirdImgInfo.width - strWidth) / 2, 50 + smallBirdImgInfo.height - 5);
        cvs.fillStyle = `white`;

        cvs.fillText(birdNum,  100 +(smallBirdImgInfo.width - strWidth) / 2, 50 + smallBirdImgInfo.height - 5);
        

    }
}
module.exports = {
    gameNum
}