class shareImgCavas {
    constructor(page,opts){
        this.page = page
        this.canvasID = opts.canvasID
        this.qrJson = opts.qrJson
        this.headImg = opts.headImg
        this.bgImg = opts.bgImg
        this.nickName = opts.nickName
        this.commnet = opts.commnet
        this.callback = opts.callback

        this.resultImg = ''
        this.start()
    }
    getLocalPath(url){
        return new Promise((resolve,reject) => {

            wx.getImageInfo({
                src: url,
                success (res) {
                    resolve({
                        path : res.path,
                        width : res.width,
                        height : res.height
                    })
                }
            })
        })
    }
    async start(){

        const {page,canvasID,headImg,bgImg,nickName,commnet,qrJson,callback} = this
        // 二维码缩小0.5
        qrJson.width = qrJson.width * 0.5
        qrJson.height = qrJson.height * 0.5

        let headImgPath = await this.getLocalPath(headImg)
        let bgImgPath = await this.getLocalPath(bgImg)

        let cvsCtx = wx.createCanvasContext(canvasID, page);
        cvsCtx.clearRect(0, 0, bgImgPath.width, bgImgPath.height);

        // 白色背景
        cvsCtx.fillStyle = 'white';
        cvsCtx.fillRect(0, 0, bgImgPath.width, bgImgPath.height + headImgPath.height / 2 + 20 + qrJson.height + 10);

        // 图片
        cvsCtx.drawImage(bgImgPath.path, 0, 0, bgImgPath.width, bgImgPath.height);

        // 头像
        let headWH = headImgPath.width
        let y = bgImgPath.height - headWH / 2
        this.circleImg(cvsCtx,headImgPath.path,20,y,headWH / 2)

        // 昵称
        cvsCtx.font = `normal normal 400 28px serif`;
        cvsCtx.fillStyle = '#3D393B';
        cvsCtx.fillText(nickName, 20 + headWH + 20, bgImgPath.height + 40);

        y = bgImgPath.height + headWH / 2 + 20
        // 二维码
        cvsCtx.drawImage(qrJson.path, bgImgPath.width - qrJson.width - 20, y - 40, qrJson.width, qrJson.height);

        y = y - 40 +  qrJson.height / 2
        // 评价
        cvsCtx.font = `normal normal 400 26px serif`;
        cvsCtx.fillStyle = '#727172';

        let x = 20
        let comNum = 1  //最多2行
        
        for (let i = 0;i<commnet.length;i++){
          let nextWidth = cvsCtx.measureText(commnet.substr(i + 1,1)).width;

          let temp = comNum >= 2 ? 60 : 30
          if (x + nextWidth > bgImgPath.width - qrJson.width - temp){
            if (comNum >= 2){
              cvsCtx.fillText('...', x, y);
              break;
            }
            else{
              x = 20
              y += 30
              cvsCtx.fillText(commnet.substr(i,1), x, y);
              let oneWidth = cvsCtx.measureText(commnet.substr(i,1)).width;
              x += oneWidth
              comNum += 1
            }
          }
          else{
            cvsCtx.fillText(commnet.substr(i,1), x, y);
            let oneWidth = cvsCtx.measureText(commnet.substr(i,1)).width;
            x += oneWidth
          }
        }





        let height = bgImgPath.height + headWH / 2 + qrJson.height + 10
        page.setData({
            canvasW : bgImgPath.width,
            canvasH : height
        })

        cvsCtx.draw(true, () => {
            wx.canvasToTempFilePath({
                x: 0,
                y: 0,
                width: bgImgPath.width,
                height: height,
                destWidth: bgImgPath.width,
                destHeight: height,
                canvasId: canvasID,
                success: (result)=>{
                    
                    this.resultImg = result
                    if (callback){
                      callback(result)
                    }
                    // this.saveImage()
                },
                fail: (err)=>{
                    console.log(`生成图片失败:${JSON.stringify(err)}`)
                },
                complete: ()=>{}
            }, this);
        });



        


    }
    circleImg(ctx, img, x, y, r) {
      // 之前设置过fill或者fillRect话 画圆或其他要先fill下
      ctx.fill();
      ctx.save();
      var d =2 * r;
      var cx = x + r;
      var cy = y + r;
      ctx.arc(cx, cy, r, 0, 2 * Math.PI);
      ctx.clip();
      ctx.drawImage(img, x, y, d, d);
      ctx.restore();
    }

  saveImage(){
    getApp().saveImage(this.resultImg.tempFilePath)

  }
}
module.exports = {
    shareImgCavas
}