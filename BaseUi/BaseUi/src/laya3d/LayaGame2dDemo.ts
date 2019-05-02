﻿module LayaPan3D {
    export class LayaGame2dDemo extends LayaScene2D {
        public constructor(value: string, bfun: Function = null) { //"res/ui/icon/512.jpg"
            super(value, bfun)
        }
        protected initScene(): void {
            super.initScene();

            this.addEvents();
            this.addSceneModel();
 
        }
        private mainChar: LayaScene2dSceneChar
        private addSceneModel(): void {
            this.sceneManager.cam3D.scene2dScale =2.34;
            var $baseChar: LayaScene2dSceneChar = new LayaScene2dSceneChar();
            $baseChar.setRoleUrl(getRoleUrl("5103"));
            this.sceneManager.addMovieDisplay($baseChar);
            $baseChar.set2dPos(200, 200);
            this.mainChar = $baseChar;
            var rect100: Pan3d.Rectangle = new Pan3d.Rectangle(0, 0, 200, 200);
            for (var i: number = 0; i < 6; i++) {
                for (var j: number = 0; j < 4; j++) {
                    this.addGrouandPic("map/5/maps/" + j + "_" + i + ".jpg", new Pan3d.Rectangle(i * rect100.width, j * rect100.height, rect100.width, rect100.height))
                }
            }
        }
        public addGrouandPic(value: string, rect: Pan3d.Rectangle): LayaScene2dPicSprit {
            var tempPic: LayaScene2dPicSprit = new LayaScene2dPicSprit(value);
            tempPic.set2dPos(rect.x, rect.y);
            tempPic.width = rect.width;
            tempPic.height = rect.height;

            this.sceneManager.addDisplay(tempPic);
            return tempPic
        }
        protected addEvents(): void {
            this.on(Pan3d.MouseType.MouseDown, this, this.onStartDrag);
            this.on(Pan3d.MouseType.MouseWheel, this, this.onMouseWheel);
            this.rootpos = new Vector2D(-100,-100)
        }

        private onMouseWheel(e: any): void {
            // this.sceneManager.cam3D.scene2dScale += e.delta / 100;
            if (!this.rootpos) {
                this.rootpos = new Vector2D()
            }
            this.rootpos.x += e.delta;
            this.rootpos.y+= e.delta;
        }
        private dragRegion: Laya.Rectangle;
        private onStartDrag(e: Event): void {
            if (this.mouseY < this.height * 0.2) {
                this.startDrag(this.dragRegion, true, this.height * 0.2);
            } else {
                var mousePos: Vector2D = new Vector2D(this.mouseX * this.scaleX, this.mouseY * this.scaleY)
                mousePos.scaleBy(1 / this.scaleX)
                var $num45: number = Math.abs(this.sceneManager.focus3D.rotationX);//45度角
                

                var toX: number = (mousePos.x + this.rootpos.x) * ((this.scaleX/1) / this.sceneManager.cam3D.scene2dScale) 

                var toY: number = (mousePos.y + this.rootpos.y) * (((this.scaleX / 1)*2) / this.sceneManager.cam3D.scene2dScale) * (Math.sin($num45 * Math.PI / 180))


                console.log("this.mouseX, this.rootpos.x", mousePos.x, this.rootpos.x);
                console.log("this.mouseY, this.rootpos.y", mousePos.y, this.rootpos.y);

                this.mainChar.set2dPos(toX * this.sceneManager.cam3D.scene2dScale, toY * this.sceneManager.cam3D.scene2dScale);
 
               // this.bgPicSprite.set2dPos(this.mouseX * this.scaleX, this.mouseY * this.scaleY)
            }
        }

    }
}