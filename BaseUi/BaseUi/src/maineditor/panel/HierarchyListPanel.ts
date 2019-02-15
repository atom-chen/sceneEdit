﻿module maineditor {
    import UICompenent = Pan3d.UICompenent
    import FrameCompenent = Pan3d.FrameCompenent
    import UIRenderComponent = Pan3d.UIRenderComponent
    import ColorType = Pan3d.ColorType
    import InteractiveEvent = Pan3d.InteractiveEvent
    import TextAlign = Pan3d.TextAlign
    import Rectangle = Pan3d.Rectangle
    import ModuleEventManager = Pan3d.ModuleEventManager
    import UIManager = Pan3d.UIManager
    import LabelTextFont = Pan3d.LabelTextFont
    import Dis2DUIContianerPanel = Pan3d.Dis2DUIContianerPanel;
    import Disp2DBaseText = Pan3d.Disp2DBaseText
    import UIRectangle = Pan3d.UIRectangle
    import baseMeshVo = Pan3d.baseMeshVo
    import UIMask = Pan3d.UIMask
    import UiDraw = Pan3d.UiDraw
    import UIData = Pan3d.UIData
    import UIAtlas = Pan3d.UIAtlas
    import MouseType = Pan3d.MouseType
    import FileVo = filemodel.FileVo
    import Vector2D = Pan3d.Vector2D
    import Vector3D = Pan3d.Vector3D
    import Scene_data = Pan3d.Scene_data
    import TextureManager = Pan3d.TextureManager
    import LoadManager = Pan3d.LoadManager

    import SampleFileVo = filelist.SampleFileVo

    export class OssListFile {
        public isOpen: boolean;
 
        public fileNode: HierarchyFileNode

    }
    export class FolderMeshVo extends Pan3d.baseMeshVo {
        public ossListFile: OssListFile
        public childItem: Array<FolderMeshVo>
        public needDraw: boolean;
        public constructor() {
            super();
        }
        public set name(value: string) {
    
            this.needDraw = true;
        }
     
        public destory(): void {
            this.pos = null;
 
            this.needDraw = null;
            this.clear = true
        }


    }
    export class FolderName extends Disp2DBaseText {
        public folderMeshVo: FolderMeshVo
        public makeData(): void {
            this.folderMeshVo = this.data;
            if (this.folderMeshVo) {

                var $uiRec: UIRectangle = this.parent.uiAtlas.getRec(this.textureStr);
                this.parent.uiAtlas.ctx = UIManager.getInstance().getContext2D($uiRec.pixelWitdh, $uiRec.pixelHeight, false);
                this.parent.uiAtlas.ctx.clearRect(0, 1, $uiRec.pixelWitdh, $uiRec.pixelHeight);
 

               // this.parent.uiAtlas.ctx.fillStyle = "#3c3c3c"; // text color
               // this.parent.uiAtlas.ctx.fillRect(1, 1, $uiRec.pixelWitdh-2, $uiRec.pixelHeight-2);
 

                LabelTextFont.writeSingleLabelToCtx(this.parent.uiAtlas.ctx, "[9c9c9c]" + this.folderMeshVo.ossListFile.fileNode.name, 12, 35, 5, TextAlign.LEFT)

               

                if (this.folderMeshVo.ossListFile.fileNode.children || this.folderMeshVo.ossListFile.fileNode.type == HierarchyNodeType.Folder) {
                    if (this.folderMeshVo.ossListFile.isOpen) {
                        this.parent.uiAtlas.ctx.drawImage(HierarchyListPanel.imgBaseDic["icon_PanRight"], 2, 5, 10, 10)
                    } else {
                        this.parent.uiAtlas.ctx.drawImage(HierarchyListPanel.imgBaseDic["icon_PanUp"], 3, 5, 10, 10)
                    }
                }
                switch (this.folderMeshVo.ossListFile.fileNode.type) {
                    case HierarchyNodeType.Prefab:
                        this.parent.uiAtlas.ctx.drawImage(HierarchyListPanel.imgBaseDic["profeb_16"], 15, 2, 13, 16)
                        break
                    case HierarchyNodeType.Light:
                        this.parent.uiAtlas.ctx.drawImage(HierarchyListPanel.imgBaseDic["icon_point16"], 15, 2, 13, 16)
                        break
                    case HierarchyNodeType.Folder:
                        if (this.folderMeshVo.ossListFile.isOpen) {
                            this.parent.uiAtlas.ctx.drawImage(HierarchyListPanel.imgBaseDic["icon_FolderOpen_dark"], 15, 2, 18, 16)
                        } else {
                            this.parent.uiAtlas.ctx.drawImage(HierarchyListPanel.imgBaseDic["icon_FolderClosed_dark"], 15, 2, 18, 16)
                        }
                        break
                    default:
                        this.parent.uiAtlas.ctx.drawImage(HierarchyListPanel.imgBaseDic["water_plane16"], 15, 2, 18, 16)
                        break
                }
                //icon_point16
                //profeb_16
                TextureManager.getInstance().updateTexture(this.parent.uiAtlas.texture, $uiRec.pixelX, $uiRec.pixelY, this.parent.uiAtlas.ctx);

            }
        }



        public update(): void {
            this.folderMeshVo = this.data;
            if (this.folderMeshVo) {
                if (this.folderMeshVo.needDraw) {
                    this.makeData();
                    this.folderMeshVo.needDraw = false;
                }
                if (this.folderMeshVo.pos) {
                    this.ui.x = this.folderMeshVo.pos.x;
                    this.ui.y = this.folderMeshVo.pos.y;
                }
                if (this.folderMeshVo.clear) {
                    this.ui.parent.removeChild(this.ui);
                    this._data = null;
                }
            }
        }
    }

    export class HierarchyListPanel extends Dis2DUIContianerPanel {

        public static imgBaseDic: any
        public constructor() {
            super(FolderName, new Rectangle(0, 0, 128, 20), 50);
            this.left = 0;
   

            this._bottomRender = new UIRenderComponent;
            this.addRender(this._bottomRender);

            this._cellBgRender = new UIRenderComponent;
            this.addRender(this._cellBgRender);

            this.removeRender(this._baseRender);
            this.addRender(this._baseRender);
            this._topRender = new UIRenderComponent;
            this.addRender(this._topRender);

   
            
            this.pageRect = new Rectangle(0, 0, 200, 200)

            this.loadAssetImg(() => {

                this._bottomRender.uiAtlas = new UIAtlas();
                this._bottomRender.uiAtlas.setInfo("ui/hierarchy/hierarchy.txt", "ui/hierarchy/hierarchy.png", () => { this.loadConfigCom() });

                Pan3d.TimeUtil.addFrameTick((t: number) => { this.update(t) });

            })

        }
        private loadAssetImg(bfun: Function): void {
            HierarchyListPanel.imgBaseDic = {};
            var item: Array<string> = [];
            item.push("icon_FolderClosed_dark");
            item.push("icon_FolderOpen_dark");
            item.push("icon_PanRight");
            item.push("icon_PanUp");
            item.push("profeb_16");
            item.push("icon_point16");
            item.push("water_plane16");
            
            
            var finishNum: number = 0
            for (var i: number = 0; i < item.length; i++) {
                this.loadTempOne(item[i], () => {
                    finishNum++
                    if (finishNum >= item.length) {
                        bfun();
                    }

                });
            }
        }

        private loadTempOne(name: string, bfun: Function): void {

            var tempImg = makeImage()
            HierarchyListPanel.imgBaseDic[name] = tempImg;
            tempImg.onload = () => {
                bfun();
            }
            tempImg.url = Scene_data.fileuiRoot + "ui/folder/pic/" + name + ".png"
            tempImg.src = Scene_data.fileuiRoot + "ui/folder/pic/" + name + ".png"

        }

        private _bottomRender: UIRenderComponent;
        private _topRender: UIRenderComponent;
        private _cellBgRender: UIRenderComponent;

        private folderMask: UIMask
        public update(t: number): void {
            super.update(t);

        }
        private perentRect: Rectangle
        public panelEventChanger(value: Rectangle): void {
            this.perentRect = value;
            if (this.pageRect) {
                this.pageRect.height = value.height;
                this.pageRect.width = value.width;
                this.left = value.x;
                this.top = value.y;
                this.refrishSize();
            }
        }
        public getPageRect(): Rectangle {
            return this.pageRect
        }


        protected mouseDown(evt: InteractiveEvent): void {
            this.mouseIsDown = true
            Scene_data.uiStage.addEventListener(InteractiveEvent.Move, this.stageMouseMove, this);
        }
        private mouseIsDown: boolean
        protected stageMouseMove(evt: InteractiveEvent): void {
            this.mouseIsDown = false

        }
        protected mouseUp(evt: InteractiveEvent): void {
            Scene_data.uiStage.removeEventListener(InteractiveEvent.Move, this.stageMouseMove, this);
            if (this.mouseIsDown) {
                var $clikVo: FolderName
                for (var i: number = 0; i < this._uiItem.length; i++) {
                    var $vo: FolderName = <FolderName>this._uiItem[i];
                    if ($vo.ui == evt.target) {
                        $clikVo = $vo
                        if ((evt.x - this.left) - $vo.ui.x < 20) {
                            $vo.folderMeshVo.ossListFile.isOpen = !$vo.folderMeshVo.ossListFile.isOpen;
                            if ($vo.folderMeshVo.ossListFile.isOpen) {
                            } else {
                                this.clearChildern($vo.folderMeshVo)   //将要关闭
                            }
                        } else {
                            if (!$vo.folderMeshVo.ossListFile.isOpen) {
                            }
                            $vo.folderMeshVo.ossListFile.isOpen = true
                        }
                        $vo.folderMeshVo.needDraw = true;
                    }  
                }
                if ($clikVo) {
                    this.hidefileItemBg(this.fileItem);
                    $clikVo.folderMeshVo.ossListFile.fileNode.treeSelect = true
                }
                this.refrishFolder();
            }
        }
        private hidefileItemBg(arr: Array<FolderMeshVo>): void {
            for (var i: number = 0; arr && i < arr.length; i++) {
                arr[i].ossListFile.fileNode.treeSelect = false;
                this.hidefileItemBg(arr[i].childItem);
            }
        }
      
 
        private clearChildern($folderMeshVo: FolderMeshVo): void {
            if ($folderMeshVo.childItem) {
                for (var i: number = 0; i < $folderMeshVo.childItem.length; i++) {
                    var $vo: FolderMeshVo = $folderMeshVo.childItem[i];
                    $vo.pos.x=-1000
                    this.clearChildern($vo)
                }
            }
        }
        public onMouseWheel($evt: MouseWheelEvent): void {
            var $slectUi: UICompenent = UIManager.getInstance().getObjectsUnderPoint(new Vector2D($evt.x, $evt.y))
            if ($slectUi && $slectUi.parent == this) {
                if (this.a_scroll_bar.parent) {
                    this.a_scroll_bar.y   -= $evt.wheelDelta/10
                    this.resize();
                    this.refrishFolder();
                } 
            }
        }
        protected loadConfigCom(): void {
            this._topRender.uiAtlas = this._bottomRender.uiAtlas
            this._cellBgRender.uiAtlas = this._bottomRender.uiAtlas
            
            this.folderMask = new UIMask();
            this.folderMask.level = 1;
            this.addMask(this.folderMask);
            this._baseRender.mask = this.folderMask;
            this._cellBgRender.mask = this.folderMask;


            this.fileItem = [];
            for (var i: number = 0; i < this._uiItem.length; i++) {
                this._uiItem[i].ui.addEventListener(InteractiveEvent.Down, this.mouseDown, this);
                this._uiItem[i].ui.addEventListener(InteractiveEvent.Up, this.mouseUp, this);
            }
            document.addEventListener(MouseType.MouseWheel, ($evt: MouseWheelEvent) => { this.onMouseWheel($evt) });
 

            this.a_bg = this.addEvntBut("a_bg", this._bottomRender);




            this.a_win_tittle = this.addChild(<UICompenent>this._topRender.getComponent("a_win_tittle"));
            this.a_win_tittle.addEventListener(InteractiveEvent.Down, this.tittleMouseDown, this);

            this.a_rigth_line = this.addChild(<UICompenent>this._topRender.getComponent("a_rigth_line"));
            this.a_rigth_line.addEventListener(InteractiveEvent.Down, this.tittleMouseDown, this);

            this.a_bottom_line = this.addChild(<UICompenent>this._topRender.getComponent("a_bottom_line"));
            this.a_bottom_line.addEventListener(InteractiveEvent.Down, this.tittleMouseDown, this);

            this.a_right_bottom = this.addChild(<UICompenent>this._topRender.getComponent("a_right_bottom"));
            this.a_right_bottom.addEventListener(InteractiveEvent.Down, this.tittleMouseDown, this);

            this.a_scroll_bar = this.addChild(<UICompenent>this._topRender.getComponent("a_scroll_bar"));
            this.a_scroll_bar.addEventListener(InteractiveEvent.Down, this.tittleMouseDown, this);

            this.a_scroll_bar.y = this.folderMask.y;

           //  this.setUiListVisibleByItem([this.a_bottom_line, this.a_right_bottom, this.a_bg, this.a_win_tittle], this.canMoveTittle)
            this.setUiListVisibleByItem([this.a_bottom_line, this.a_right_bottom, this.a_rigth_line,this.a_bg, this.a_win_tittle], this.canMoveTittle)


            

 

            this.refrishSize()


            this.readMapFile()
  

  

        }

        private wirteItem(childItem: Array<any>): Array<FolderMeshVo> {
            var $item: Array<FolderMeshVo> = new Array
            for (var i: number = 0; childItem && i < childItem.length; i++) {
                var $hierarchyFileNode: HierarchyFileNode = childItem[i] as HierarchyFileNode
                var $vo: FolderMeshVo = new FolderMeshVo;
                $vo.ossListFile = new OssListFile;
                $vo.ossListFile.fileNode = new HierarchyFileNode()
                $vo.ossListFile.fileNode.name = $hierarchyFileNode.name
                $vo.ossListFile.fileNode.type = $hierarchyFileNode.type
                $vo.ossListFile.fileNode.treeSelect = false
                $vo.pos = new Vector3D
                this.showTemp($vo);
                $vo.childItem = this.wirteItem($hierarchyFileNode.children);
                $item.push($vo)
            }
            if ($item.length) {
                return $item
            }
            return null
        }
        private readMapFile(): void {
            LoadManager.getInstance().load(Scene_data.fileuiRoot + "scene011_map.txt", LoadManager.XML_TYPE,
                ($data: string) => {
                    var obj: any = JSON.parse($data);
                    var kkk: Array<FolderMeshVo> = this.wirteItem(obj.hierarchyList.item)
                    for (var i: number = 0; i < kkk.length; i++) {
                        this.fileItem.push(kkk[i])
                    }
                    this.refrishFolder();
                });

           
        }
        private a_scroll_bar: UICompenent
        private a_bottom_line: UICompenent



        private a_right_bottom: UICompenent;
        private a_rigth_line: UICompenent;
        private refrishSize(): void {

            if (!this._topRender.uiAtlas) {
                return
            }

            this.pageRect.width = Math.max(100, this.pageRect.width)
            this.pageRect.height = Math.max(100, this.pageRect.height)

            this.a_win_tittle.x = 0;
            this.a_win_tittle.y = 0;
            this.a_win_tittle.width = this.pageRect.width;



            this.folderMask.y = this.a_win_tittle.height;
            this.folderMask.x = 0
            this.folderMask.width = this.pageRect.width - this.a_rigth_line.width
            this.folderMask.height = this.pageRect.height - this.a_win_tittle.height - this.a_bottom_line.height

            this.a_bg.x = 0;
            this.a_bg.y = 0
            this.a_bg.width = this.pageRect.width
            this.a_bg.height = this.pageRect.height

            this.a_rigth_line.x = this.pageRect.width - this.a_rigth_line.width
            this.a_rigth_line.y = this.a_win_tittle.height;
            this.a_rigth_line.height = this.pageRect.height - this.a_win_tittle.height - this.a_right_bottom.height;

            this.a_bottom_line.x = 0
            this.a_bottom_line.y = this.pageRect.height - this.a_bottom_line.height
            this.a_bottom_line.width = this.pageRect.width - this.a_right_bottom.width;


            this.a_right_bottom.x = this.pageRect.width - this.a_right_bottom.width
            this.a_right_bottom.y = this.pageRect.height - this.a_right_bottom.height

            this.a_scroll_bar.x = this.folderMask.x + this.folderMask.width - this.a_scroll_bar.width;

            this.resize();
            this.refrishFolder();
     
        }

        private lastPagePos: Vector2D;
        private lastMousePos: Vector2D;
        private mouseMoveTaget: UICompenent
        private pageRect: Rectangle
        private canMoveTittle: boolean
        protected tittleMouseDown(evt: InteractiveEvent): void {

            this.mouseMoveTaget = evt.target

            this.lastMousePos = new Vector2D(evt.x, evt.y)

            switch (this.mouseMoveTaget) {
                case this.a_win_tittle:
                    this.lastPagePos = new Vector2D(this.left, this.top)
                    break

                case this.a_rigth_line:
                case this.a_bottom_line:
                case this.a_right_bottom:
                    this.lastPagePos = new Vector2D(this.pageRect.width, this.pageRect.height)
                    break
                case this.a_scroll_bar:
                    this.lastPagePos = new Vector2D(0, this.a_scroll_bar.y)
                    break

                default:
                    console.log("nonono")
                    break

            }




            Scene_data.uiStage.addEventListener(InteractiveEvent.Move, this.mouseOnTittleMove, this);
            Scene_data.uiStage.addEventListener(InteractiveEvent.Up, this.tittleMouseUp, this);
        }
        protected tittleMouseUp(evt: InteractiveEvent): void {
            Scene_data.uiStage.removeEventListener(InteractiveEvent.Move, this.mouseOnTittleMove, this);
            Scene_data.uiStage.removeEventListener(InteractiveEvent.Up, this.tittleMouseUp, this);
        }
        protected mouseOnTittleMove(evt: InteractiveEvent): void {
            switch (this.mouseMoveTaget) {
                case this.a_win_tittle:
                    this.left = this.lastPagePos.x + (evt.x - this.lastMousePos.x)
                    this.top = this.lastPagePos.y + (evt.y - this.lastMousePos.y)
                    break
                case this.a_rigth_line:
                    this.pageRect.width = this.lastPagePos.x + (evt.x - this.lastMousePos.x)
                    


                    break
                case this.a_bottom_line:
                    this.pageRect.height = this.lastPagePos.y + (evt.y - this.lastMousePos.y)

                    break

                case this.a_right_bottom:
                    this.pageRect.width = this.lastPagePos.x + (evt.x - this.lastMousePos.x)
                    this.pageRect.height = this.lastPagePos.y + (evt.y - this.lastMousePos.y)
                    break

                case this.a_scroll_bar:

                    this.a_scroll_bar.y = this.lastPagePos.y + (evt.y - this.lastMousePos.y);
                    this.a_scroll_bar.y = Math.max(this.a_scroll_bar.y, this.folderMask.y)
                    this.a_scroll_bar.y = Math.min(this.a_scroll_bar.y, this.folderMask.y + this.folderMask.height - this.a_scroll_bar.height)

                     console.log(this.a_scroll_bar.y)

                    break
                default:
                    console.log("nonono")
                    break

            }
         
   

            this.refrishSize()

          
        
        }
        private a_bg: UICompenent;
        private a_win_tittle: UICompenent;

 

       
 
        private fileItem: Array<FolderMeshVo>;
     
        private folderCellHeight: number = 20
        private refrishFolder(): void {
            HierarchyListPanel.listTy = 25;
            this.disChiendren(this.fileItem);


            var contentH: number = HierarchyListPanel.listTy  


            var moveTy: number = 0
            if (contentH > this.folderMask.height) {
                this.setUiListVisibleByItem([this.a_scroll_bar], true);
                this.a_scroll_bar.height = (this.folderMask.height / contentH) * this.folderMask.height;
                this.a_scroll_bar.y = Math.min(this.a_scroll_bar.y, this.folderMask.height + this.folderMask.y - this.a_scroll_bar.height);
                this.a_scroll_bar.y = Math.max(this.a_scroll_bar.y, this.folderMask.y );

                var nnn: number = (this.a_scroll_bar.y - this.folderMask.y) / (this.folderMask.height - this.a_scroll_bar.height);
                moveTy = (this.folderMask.height - contentH) * nnn
            } else {
                this.setUiListVisibleByItem([this.a_scroll_bar], false);
                moveTy = 0
            }

            this.moveAllTy(this.fileItem, moveTy)

            while (this.cellBgItem.length) {
                this.removeChild(this.cellBgItem.pop());
            }
            this.showSelectBg(this.fileItem)
 
        }
        private cellBgItem: Array<UICompenent>=[]
        private showSelectBg(arr: Array<FolderMeshVo>): void {
        
            for (var i: number = 0; arr && i < arr.length; i++) {
                if (arr[i].ossListFile.isOpen) {
                    this.showSelectBg(arr[i].childItem)
                }
                if (arr[i].ossListFile.fileNode.treeSelect) {
                    var ui: FrameCompenent = <FrameCompenent>this.addChild(this._cellBgRender.getComponent("a_select_cell_bg"));
                    ui.goToAndStop(0)
                    ui.y = arr[i].pos.y;
                    ui.x = 0
                    ui.width = this.pageRect.width
                    this.cellBgItem.push(ui);
                }
           
            }
        }
        private moveAllTy(arr: Array<FolderMeshVo>, ty: number = 0): void {
            for (var i: number = 0; arr && i < arr.length; i++) {
                arr[i].pos.y += ty;  
                if (arr[i].ossListFile.isOpen) {
                    this.moveAllTy(arr[i].childItem, ty)
                }
            }

        }
        private static listTy: number
        private disChiendren(arr: Array<FolderMeshVo>, tx: number=0): void {
            for (var i: number = 0; arr && i < arr.length; i++) {
                arr[i].pos.x = tx;
                arr[i].pos.y = HierarchyListPanel.listTy
                HierarchyListPanel.listTy += 20;
                if (arr[i].ossListFile.isOpen) {
                    this.disChiendren(arr[i].childItem, tx+20)
                }
            }
   
        }
    







    }
}