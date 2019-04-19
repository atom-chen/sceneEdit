﻿import Browser = Laya.Browser;
import Loader = Laya.Loader;
import LEvent = Laya.Event;
import Stage = Laya.Stage;

import LoadManager = Pan3d.LoadManager
import Scene_data = Pan3d.Scene_data
import TextureRes = Pan3d.TextureRes


 
    import Pan3dByteArray = Pan3d.Pan3dByteArray;
    import WebGLContext = laya.webgl.WebGLContext;
 
    /*
    自定义着色器
    */
module Temp3D {
    export class FBO {


        public width: number
        public height: number
        public frameBuffer: WebGLFramebuffer;
        public depthBuffer: WebGLRenderbuffer;
        public texture: WebGLRenderbuffer;
        public constructor(value: WebGLTexture, w: number = 128, h: number = 128) {
            var gl: WebGLRenderingContext = Scene_data.context3D.renderContext;
            this.texture = value

            this.frameBuffer = gl.createFramebuffer();
            this.depthBuffer = gl.createRenderbuffer();

            gl.bindRenderbuffer(gl.RENDERBUFFER, this.depthBuffer);
            gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, w, h);
            this.width = w;
            this.height = h;
        }

     
    }
}
class LayaLaunchTexture extends Laya.Texture {
    public constructor(bitmap: laya.resource.Bitmap) {
        super(bitmap);
        LoadManager.getInstance().load(Scene_data.fileRoot + "ui/icon/map_64x.png", LoadManager.IMG_TYPE, ($img: any, $info: any) => {
            var tempPanTexture: WebGLTexture = Pan3d.Scene_data.context3D.getTexture($img)
            this._baseWebGLTexture = tempPanTexture;
        })

    }
    public get source(): WebGLTexture {
        return this._baseWebGLTexture
    }
    public _baseWebGLTexture: WebGLTexture
}
class LayaLaunch {
    private _canvas: HTMLCanvasElement;
    get canvas(): HTMLCanvasElement {
        return this._canvas;
    }
    constructor() {

        this.init()
    }

    private outImg: Laya.Image
    private init(): void {
   
        this._canvas = Laya.init(Browser.clientWidth * Browser.pixelRatio, Browser.clientHeight * Browser.pixelRatio, Laya.WebGL);

        Pan3d.Scene_data.fileRoot = "res/";
        Pan3d.Engine.init(this._canvas);
 
        var pic: Laya.Image = new Laya.Image();
        Laya.stage.addChild(pic)
        pic.x = 300;
        pic.y = 300;
        pic.scale(2, 2);

        this.outImg = pic;
 
        this.makeLayaBaseText()


        Laya.timer.once(2000, this, () => {
            console.log(this.outImg.texture)
        })

        this.makeLayaOneText()


        var picA: Laya.Image = new Laya.Image("res/ui/icon/lyf_64x.png");
        Laya.stage.addChild(picA)
 
    }
    private makeLayaOneText(): void {
        let $ctx = Pan3d.UIManager.getInstance().getContext2D(256, 256, false);
 

       
    }

    private makeLayaBaseText(): void {
        Laya.loader.load("res/ui/icon/objs_64x.png", Laya.Handler.create(this, (aa: Laya.Texture) => {
            this.outImg.texture = aa;
             aa.bitmap.enableMerageInAtlas = false;
            LoadManager.getInstance().load(Scene_data.fileRoot + "ui/icon/icon_Folder_64x.png", LoadManager.IMG_TYPE, ($img: any, $info: any) => {
                Pan3d.Scene_data.context3D.updateTexture(this.outImg.texture.source, 0, 0, $img)

                var knum: number = $img.width / 128;
                this.outImg.texture.uv = [0, 0, knum, 0, knum, knum, 0, knum]

                this.fbo = new Temp3D.FBO(this.outImg.texture.source, 128, 128);

                this.outImg.frameLoop(1, this, this.upData)
          
            })
        }))
 
    }
    private fbo: Temp3D.FBO
    public upData(): void {
       // console.log(this.outImg)
        var gl: WebGLRenderingContext = Scene_data.context3D.renderContext

        var rect: Pan3d.Rectangle = new Pan3d.Rectangle(0, 0, gl.canvas.width, gl.canvas.height)
        this.updateDepthTexture(this.fbo)




        gl.viewport(0, 0, rect.width, rect.height);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    }

    private updateDepthTexture(fbo: Temp3D.FBO): void {

        var gl: WebGLRenderingContext = Scene_data.context3D.renderContext
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo.frameBuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, fbo.texture, 0);

      
         gl.viewport(0, 0, fbo.width, fbo.height);
        gl.clearColor(Math.random(), 20 / 255, 20 / 255, 1.0);
        // gl.clearColor(0,0,0,0);
        gl.clearDepth(1.0);
        gl.clearStencil(0.0);
        gl.enable(gl.DEPTH_TEST);
        gl.depthMask(true);
        gl.enable(gl.BLEND);
        gl.frontFace(gl.CW);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);


      

    }

    private updateDepthTextureCopy(fbo: Temp3D.FBO): void {

        var gl: WebGLRenderingContext = Scene_data.context3D.renderContext
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo.frameBuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, fbo.texture, 0);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, fbo.depthBuffer);

        gl.viewport(0, 0, fbo.width, fbo.height);
        gl.clearColor(Math.random(), 20 / 255, 20 / 255, 1.0);
        // gl.clearColor(0,0,0,0);
        gl.clearDepth(1.0);
        gl.clearStencil(0.0);
        gl.enable(gl.DEPTH_TEST);
        gl.depthMask(true);
        gl.enable(gl.BLEND);
        gl.frontFace(gl.CW);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);


    }

 
    public static initCanvas($caves: HTMLCanvasElement): void {

        var main = new LayaLaunch();

 
    }
   

}

