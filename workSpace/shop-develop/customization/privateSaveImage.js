
import { textToImg } from '../service/customization'
class privateSaveImage{
    constructor(pageContext,opts){
        this.page = pageContext
        this.imageHeight = opts.imageHeight
        this.imageArrs = opts.imgs
        this.zfArrs = opts.zfs
        this.textArrs = opts.textArrs
        this.callBack = opts.callBack
        this.canID = opts.canID

        // console.log(`收到的数据:${JSON.stringify(opts)}`)
        this.authorize()
    }
    // 授权
    authorize(){
        wx.getSetting({ success: res => {

            if (!res.authSetting['scope.writePhotosAlbum']){
            wx.authorize({
                scope:
                'scope.writePhotosAlbum',
                success: res => {
    
                this.saveImage()
    
                },
                fail: () => {
                wx.showModal({
                    title: '提示', //提示的标题,
                    content: '需要授权相册权限才能保存', //提示的内容,
                    showCancel: true, //是否显示取消按钮,
                    cancelText: '取消', //取消按钮的文字，默认为取消，最多 4 个字符,
                    cancelColor: '#000000', //取消按钮的文字颜色,
                    confirmText: '设置', //确定按钮的文字，默认为取消，最多 4 个字符,
                    confirmColor: '#3CC51F', //确定按钮的文字颜色,
                    success: res => {
                    if (res.confirm) {
                        wx.openSetting({ success: res => {
                        if (res.authSetting['scope.writePhotosAlbum']){
                            
                            this.saveImage()
    
                        }
                        } });
                    } 
                    }
                });
                }
            });
            }
            else{
    
            this.saveImage()
    
            }
        } });
    }
    // 文字转图片
    textToImage(zfIndex){
        return new Promise((resolve,reject) => {

            let {page,imageArrs,imageHeight,canID,textArrs} = this
            let vWidth = wx.getSystemInfoSync().windowWidth

            let json = {}
            let textID = -1
            imageArrs[zfIndex].forEach((item , index) => {
                if (item.text){
                    json = item
                    textID = index
                }
            })
            if (textID == -1){
                resolve()
                return
            }
            // console.log(`绘制完成:${JSON.stringify(json)}`)
            var cvsCtx = wx.createCanvasContext(canID,page);
            let bold = json.bold ? 'bold' : 'normal'
            let zihao = json.font
            let ziti = json.ziti
            let zitiZh = json.zitiZh

            let str = json.text
            let x = 0
            let y = parseInt(zihao)
            let lenWidth = 0
    
            let width = json.areaJson.width
            let height = json.areaJson.height

            
            let that = this
            if(zitiZh == '宋体'){
    
                cvsCtx.clearRect(0, 0, vWidth, imageHeight);
    
                cvsCtx.font = `${bold} ${zihao}px ${ziti}`;
                cvsCtx.fillStyle = json.color;
    
    
    
                for (let i = 0;i<str.length;i++){
                    let oneWidth = cvsCtx.measureText(str.substr(i,1)).width;
                    lenWidth += oneWidth
                    cvsCtx.fillText(str.substr(i,1), x, y);
        
                    let nextWidth = cvsCtx.measureText(str.substr(i+1,1)).width;
                    if (lenWidth + nextWidth > width){
                        x = 0
                        y += parseInt(zihao)
                        lenWidth = 0
    
                    }
                    else{
                        x = lenWidth
                    }
                }
                cvsCtx.draw(true,()=>{
                    wx.canvasToTempFilePath({
                        x: 0,
                        y: 0,
                        width: width,
                        height: height,
                        destWidth: width * 2,
                        destHeight: height * 2,
                        canvasId: canID,
                        success(res) {
                          json.tempPath = res.tempFilePath
                          imageArrs[zfIndex].splice(textID,1,json)
                          that.imageArrs = imageArrs
                          resolve()
                        }
                      })
                });
            }
            else{

                let requstJson = {
                    font_name : zitiZh,
                    font_size : parseInt(zihao),
                    font_color : json.color,
                    pic_width : width,
                    pic_height : height,
                    line_height : parseInt(zihao),
                    words_list : textArrs
                }
                // console.log(`文字合成参数:${JSON.stringify(requstJson)}`)
                textToImg(requstJson).then(item => {
                    // console.log(`文字合成:${JSON.stringify(item)}`)
                    wx.getImageInfo({
                        src: `https://cdn.bestseller.com.cn/${item}`,
                        success: (result)=>{
                            
                            json.tempPath = result.path
                            imageArrs[zfIndex].splice(textID,1,json)
                            that.imageArrs = imageArrs
                            resolve()
                        }
                    });
                })
            }
    
        })

    }
    // 生成
    saveImage(){
        let zfIndex = 1
        if (this.canID == 'asd'){
            zfIndex = 0
        }

        this.textToImage(zfIndex).then(item => {

            let {page,imageHeight,imageArrs,zfArrs,callBack,canID} = this
            let vWidth = wx.getSystemInfoSync().windowWidth
            // console.log(`绘制完成:${JSON.stringify(imageArrs)}`)
    
            wx.getImageInfo({
                src: zfArrs.bgImage[zfIndex].image,
                success (res) {
                    var cvsCtx = wx.createCanvasContext(canID,page);
                    cvsCtx.clearRect(0, 0, vWidth, imageHeight);
                    cvsCtx.drawImage(res.path, 0, 0, vWidth, imageHeight);
    
                    let json = {}
                    let id = -1
                    imageArrs[zfIndex].forEach((item,index) => {
                        if (item.canshow){
                            json = item
                            id = index
                        }
                    })
                    if (id != -1){
                        imageArrs[zfIndex].splice(id,1)
                        imageArrs[zfIndex].push(json)
                    }

    
                    // 文字图片地址
                    let textImagePath = ''
                    imageArrs[zfIndex].forEach(item => {
                        let areaJson = item.areaJson
                        
                        let left = areaJson.left < 0 ? vWidth + areaJson.left  : areaJson.left 
                        left += 1
                        let top = areaJson.top +1
                        let width = areaJson.width
                        let height = areaJson.height
    

                        let imagePath = item.tempPath ? item.tempPath : item.bendiPic ? item.bendiPic : item.pic
                        textImagePath = item.tempPath ? item.tempPath : ''
                        // 图片
                        if (item.rotate > 0){
                            cvsCtx.save();
                            cvsCtx.translate(left + width / 2 , top + height / 2 );
                            cvsCtx.rotate(item.rotate * Math.PI/180);
                            cvsCtx.drawImage(imagePath, -width/2, -height/2, width, height);
                            cvsCtx.restore();
                        }
                        else{
                            cvsCtx.drawImage(imagePath, left, top, width, height);
                        }
    
                    });
    
                    cvsCtx.draw(true,()=>{
                        wx.canvasToTempFilePath({
                            x: 0,
                            y: 0,
                            width: vWidth,
                            height: imageHeight,
                            destWidth: vWidth * 2,  //解决生成图模糊问题
                            destHeight: imageHeight * 2,    //解决生成图模糊问题
                            canvasId: canID,
                            success(res) {
                            //   console.log(`绘制完成:${res.tempFilePath}`)
                              let json = {
                                  index : zfIndex,
                                  path : res.tempFilePath,
                                  textImagePath
                              }
                              callBack && callBack(json)
    
                            //   wx.saveImageToPhotosAlbum({
                            //     filePath: res.tempFilePath, //图片文件路径，可以是临时文件路径也可以是永久文件路径，不支持网络图片路径,
                            //     success: res => {
                            //       wx.showToast({
                            //         title: '图片保存成功',
                            //         icon: 'none'
                            //       });
                            //     }
                            //   });
    
                            }
                          })
                    });
                },
                fail:(err =>{
                    console.log(`错误：￥「${JSON.stringify(err)}」`)
                })
              })
        })


    }
}
export{
    privateSaveImage
}