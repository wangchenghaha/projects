
/**
 * 
 * 
 *      小鸟游戏 主函数
 * 
 */
import {bird} from './bird'
import {bgImage} from './bgImage'
import {detection} from './detection'
import {pipe} from './pipe'
import {gameNum} from './gameNum'

class gameMain {
  constructor(context,opts,imgPath,callback,gameOverCallback){
        this.callback = callback
        this.gameOverCallback = gameOverCallback
        this.page = context
        this.cvs = opts.cvs
        this.brand = opts.brand

        this.windowWidth = wx.getSystemInfoSync().windowWidth
        this.windowHeight = wx.getSystemInfoSync().windowHeight
        this.imgPath = imgPath

        // 分数
        this.num = 0
        // 小鸟分数
        this.birdNum = 0
        this.isStart = false  //资源加载完才能开始
        this.timeID = -1
      
        wx.createSelectorQuery()
        .in(this.page)
        .select(`#${this.cvs}`)
        .fields({
          node: true,
        })
        .exec(this.load.bind(this))
    }
    // 加载资源
    load(res){
      
      this.canvas = res[0].node
      this.ctx = this.canvas.getContext('2d')

      const dpr = wx.getSystemInfoSync().pixelRatio
      this.canvas.width = this.windowWidth
      this.canvas.height = this.windowHeight
      // this.ctx.scale(dpr, dpr)

      // 初始化信息
      this.bgImage = new bgImage(this.brand,this.windowWidth,this.windowHeight,this.canvas,this.ctx,this.imgPath,() => {
        this.bgImage.draw()
        this.gameNum = new gameNum(this.canvas,this.ctx,this.imgPath,() => {
          this.gameNum.setNum(this.num,this.birdNum)
          this.pipe1 = new pipe(1,400,this.canvas,this.ctx,this.imgPath,() => {
            this.pipe2 = new pipe(2,700,this.canvas,this.ctx,this.imgPath,() => {
              this.pipe3 = new pipe(3,1000,this.canvas,this.ctx,this.imgPath,() => {
                this.pipe4 = new pipe(4,1300,this.canvas,this.ctx,this.imgPath,() => {
                  this.bird = new bird(this.brand,this.canvas,this.ctx,this.imgPath,() => {
                    this.bird.upDate()
                    if (this.callback){
                      this.callback()
                    }
                  })
                })
              })
            })
          })
        })
      })
      
      
    }
    // 循环执行
    funcMain(){

        var oldTime = Date.now()
        const main = () => {

          const currentTime = Date.now()
          const speed = currentTime - oldTime
    
          oldTime = currentTime
    
          this.ctx.clearRect(0, 0, this.windowWidth, this.windowHeight);
    
          this.bgImage.draw()
          this.gameNum.setNum(this.num,this.birdNum)
          this.pipe1.draw(speed,0,() => {
            this.addNum()
          },() => {
            this.addBirdNum()
          })
          this.pipe2.draw(speed,0,() => {
            this.addNum()
          },() => {
            this.addBirdNum()
          })
          this.pipe3.draw(speed,this.num,() => {
            this.addNum()
          },() => {
            this.addBirdNum()
          })
          this.pipe4.draw(speed,0,() => {
            this.addNum()
          },() => {
            this.addBirdNum()
          })
          this.bird.draw(speed)
    
          const bol = detection.gameOver(this.bird,this.pipe1,this.pipe2,this.pipe3,this.pipe4)
          if (bol){
            this.isStart = false
            this.canvas.cancelAnimationFrame(this.timeID)
            this.timeID = -1
            if (this.gameOverCallback){
              this.gameOverCallback(this.num,this.birdNum)
            }
          }
           else{
            
            this.timeID = this.canvas.requestAnimationFrame(main)
          }

        }
        this.timeID = this.canvas.requestAnimationFrame(main)
    }
    // 分数++
    addNum(){
      this.num += 1
    }
    // 小鸟分数++
    addBirdNum(){
      this.birdNum += 1
    }
    // 生成图片
    getCanvasImage(){
      return this.canvas.toDataURL('image/png',1)
    }
    click(){
      this.bird.upSpeed = -0.45
      if (this.timeID === -1){
        this.funcMain()
      }
    }
}
module.exports = {
  gameMain
}