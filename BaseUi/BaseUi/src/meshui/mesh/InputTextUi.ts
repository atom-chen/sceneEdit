﻿module prop {
    import Vector2D = Pan3d.Vector2D
    import UICompenent = Pan3d.UICompenent;
    import InteractiveEvent = Pan3d.InteractiveEvent;
    import Scene_data = Pan3d.Scene_data;
    import LabelTextFont = Pan3d.LabelTextFont
    import TextAlign = Pan3d.TextAlign


    export class InputTextUi extends TextLabelUI{

        public constructor(w: number = 64, h: number = 64) {
            super(w, h);
        }
        protected initView(): void {

            this.setInputTxtPos()
            this.addEvets()
        }
        public destory(): void {
            if (this.chatHtmlInput) {
                document.body.removeChild(this.chatHtmlInput);
                this.chatHtmlInput = null;
            }
            super.destory()

        }
        private chatHtmlInput: HTMLElement;
        private setInputTxtPos(): void {
            if (!this.chatHtmlInput) {
                this.chatHtmlInput = <HTMLElement>document.createElement("input");
                this.chatHtmlInput.style.position = "absolute";
                this.chatHtmlInput.style["z-index"] = 100
                this.chatHtmlInput.style.background = "transparent"
                this.chatHtmlInput.style.color = "#ffffff";
                document.body.appendChild(this.chatHtmlInput);
              //  this.chatHtmlInput.addEventListener("change", (cevt: any) => { this.changeFile(cevt) });
            }

            this.chatHtmlInput.style.left = 0 + "px";
            this.chatHtmlInput.style.top = 0 + "px";
            var tw: number = 50
            var th: number = 20;
            this.chatHtmlInput.style.fontSize = String(12) + "px";
            this.chatHtmlInput.style.width = String(tw) + "px";
            this.chatHtmlInput.style.height = String(th) + "px";
            this.chatHtmlInput.value = "99.99"

            this.resize()
        }

        protected resize(): void {
            super.resize()
         
            
            this.chatHtmlInput.style.left = (this.textureContext.left + this.x) + "px";
            this.chatHtmlInput.style.top = (this.textureContext.top + this.y) + "px";

        }
        public set text(value: string) {
            LabelTextFont.writeSingleLabel(this.ui.uiRender.uiAtlas, this.ui.skinName, value, 26, TextAlign.LEFT, "#ffffff", "#27262e");
        }
        protected butClik(evt: InteractiveEvent): void {
            console.log("clik")
    
            this.addStageMoveEvets(evt)
        }

        private mouseXY: Vector2D;
        private addStageMoveEvets($e: InteractiveEvent): void {
            this.mouseXY = new Vector2D($e.x, $e.y)
            Scene_data.uiStage.addEventListener(InteractiveEvent.Move, this.onMove, this);
            Scene_data.uiStage.addEventListener(InteractiveEvent.Up, this.onUp, this);

        }
        private onMove($e: InteractiveEvent): void {

            var $reflectionEvet: ReflectionEvet = new ReflectionEvet(ReflectionEvet.CHANGE_DATA)
            $reflectionEvet.data = $e.x - this.mouseXY.x
            this.dispatchEvent($reflectionEvet);
            this.mouseXY = new Vector2D($e.x, $e.y)
        }
        private onUp($e: InteractiveEvent): void {
            Scene_data.uiStage.removeEventListener(InteractiveEvent.Move, this.onMove, this);
            Scene_data.uiStage.removeEventListener(InteractiveEvent.Up, this.onUp, this);
        }
   

    }
}