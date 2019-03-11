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

    import Display3DSprite = Pan3d.Display3DSprite
 
    import Shader3D = Pan3d.Shader3D
    import GroupDataManager = Pan3d.GroupDataManager
    import Material = Pan3d.Material
    import GroupRes = Pan3d.GroupRes
    import GroupItem = Pan3d.GroupItem
    import BaseRes = Pan3d.BaseRes
    import TexItem = Pan3d.TexItem
    import MaterialBaseParam = Pan3d.MaterialBaseParam
    import ObjData = Pan3d.ObjData
    import TextureRes = Pan3d.TextureRes
    import Matrix3D = Pan3d.Matrix3D
    import ProgrmaManager = Pan3d.ProgrmaManager
    import BaseDiplay3dShader = Pan3d.BaseDiplay3dShader
    import ConstItem = Pan3d.ConstItem


    import SampleFileVo = filelist.SampleFileVo

    



    export class ModelSprite extends left.MaterialModelSprite {
        public constructor() {
            super();
  
        }
        public setMaterialVc($material: Material, $mp: MaterialBaseParam = null): void {
            super.setMaterialVc($material, $mp)
        //  Scene_data.context3D.setVc4fv($material.shader, "fc", new Float32Array([1, 0, 1, 1]));
        

        }
      
 
    }

    export class OssListFile extends HierarchyFileNode {
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

    export class HierarchyListPanel extends base.Dis2dBaseWindow {

        public static imgBaseDic: any;
        public constructor() {
            super(FolderName, new Rectangle(0, 0, 128, 20), 50);
            this.left = 0;
            this.pageRect = new Rectangle(0, 0, 200, 200)
        }
        protected loadConfigCom(): void {
            super.loadConfigCom();

            var item: Array<UICompenent> = [
                this.b_bottom_left,
                this.b_bottom_mid,
                this.b_bottom_right,
                this.b_bottom_line_left,
                this.b_bottom_line_right,
                this.a_bottom_line,
            ]
            this.setUiListVisibleByItem(item, false)
 

            this.resize();

            this.loadAssetImg(() => {
                this.makeItemUiList()
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
                this.resize();
            }
        }


        protected itemMouseUp(evt: InteractiveEvent): void {

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
                    }
                    $vo.folderMeshVo.needDraw = true;
                }
            }
            if ($clikVo) {
                this.hidefileItemBg(this.fileItem);
                $clikVo.folderMeshVo.ossListFile.fileNode.treeSelect = true
                this.showEditorPanel();
            }
            this.refrishFolder();
            this.resize()

        }
        private showEditorPanel(): void {
            Pan3d.ModuleEventManager.dispatchEvent(new maineditor.MainEditorEvent(maineditor.MainEditorEvent.SHOW_MAIN_EDITOR_PANEL));
            Pan3d.ModuleEventManager.dispatchEvent(new xyz.MoveScaleRotatioinEvent(xyz.MoveScaleRotatioinEvent.MAKE_DTAT_ITEM_TO_CHANGE))
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
                    $vo.pos.x = -1000
                    this.clearChildern($vo)
                }
            }
        }
        public onPanellMouseWheel($evt: MouseWheelEvent): void {
            var $slectUi: UICompenent = UIManager.getInstance().getObjectsUnderPoint(new Vector2D($evt.x, $evt.y))
            if ($slectUi && $slectUi.parent == this) {

            }
        }
        private isCompelet: boolean
        protected makeItemUiList(): void {

            this._baseRender.mask = this._uiMask
            this.fileItem = [];
            for (var i: number = 0; i < this._uiItem.length; i++) {
                this._uiItem[i].ui.addEventListener(InteractiveEvent.Up, this.itemMouseUp, this);
            }
            document.addEventListener(MouseType.MouseWheel, ($evt: MouseWheelEvent) => { this.onPanellMouseWheel($evt) });
            this.readMapFile()
        }

        private wirteItem(childItem: Array<any>): Array<FolderMeshVo> {
            var $item: Array<FolderMeshVo> = new Array
            for (var i: number = 0; childItem && i < childItem.length; i++) {
            
                var $vo: FolderMeshVo = new FolderMeshVo;
                $vo.ossListFile = new OssListFile;
                $vo.ossListFile.fileNode = new HierarchyFileNode();
                $vo.ossListFile.fileNode.name = childItem[i].name;
                $vo.ossListFile.fileNode.type = childItem[i].type;
                $vo.ossListFile.fileNode.treeSelect = false;
                $vo.pos = new Vector3D;
                $vo.pos.y = -1000;
                this.showTemp($vo);

                $vo.childItem = this.wirteItem(childItem[i].children);
                $item.push($vo)
            }
            if ($item.length) {
                return $item
            }
            return null
        }
        private clearItemForChidren(item: Array<FolderMeshVo>): void {
            while (item&&item.length) {
                var vo: FolderMeshVo = item.pop();
                this.clearItemForChidren(vo.childItem);
                this.clearTemp(vo)
            }
 
        }
        public inputPrefabToScene(temp: any): void {
   
            
      
       
            var $url: string = temp.url
            var $groundPos = this.getGroundPos(temp.mouse)
            filemodel.PrefabManager.getInstance().getPrefabByUrl($url, (value: pack.PrefabStaticMesh) => {
                var prefab: pack.PrefabStaticMesh = value;
                var dis: ModelSprite = new ModelSprite();
                dis.x = $groundPos.x;
                dis.y = $groundPos.y;
                dis.z = $groundPos.z;
                MainEditorProcessor.edItorSceneManager.addDisplay(dis);
                LoadManager.getInstance().load(Scene_data.fileRoot + prefab.objsurl, LoadManager.XML_TYPE,
                    ($modelxml: string) => {
                        dis.readTxtToModel($modelxml);
                    });
                filemodel.MaterialManager.getInstance().getMaterialByUrl(prefab.textureurl, ($materialTree: materialui.MaterialTree) => {
                    dis.material = $materialTree;
                })


                var $vo: FolderMeshVo = new FolderMeshVo;
                $vo.ossListFile = new OssListFile;
                $vo.ossListFile.fileNode = new HierarchyFileNode()
                $vo.ossListFile.fileNode.name = temp.url
                $vo.ossListFile.fileNode.type = HierarchyNodeType.Prefab
                $vo.ossListFile.fileNode.treeSelect = false
                $vo.pos = new Vector3D
                $vo.pos.y = -1000
                this.showTemp($vo);

                this.fileItem.push($vo);
                this.isCompelet = true;
                this.refrishFolder();
                this.resize()
            })

        }
        private getGroundPos($mouse: Vector2D): Vector3D {
            let $scene = MainEditorProcessor.edItorSceneManager;

            var $hipPos: Vector3D = xyz.TooMathHitModel.mathDisplay2Dto3DWorldPos(new Vector2D($mouse.x - $scene.cam3D.cavanRect.x, $mouse.y - $scene.cam3D.cavanRect.y), $scene)
 
            var triItem: Array<Vector3D> = new Array;
            triItem.push(new Vector3D(0, 0, 0));
            triItem.push(new Vector3D(-100, 0, 100));
            triItem.push(new Vector3D(+100, 0, 100));

            return Pan3d.MathUtil.getLinePlaneInterectPointByTri(new Vector3D($scene.cam3D.x, $scene.cam3D.y, $scene.cam3D.z), $hipPos, triItem)

        }

    
       
        private makeModel(): void {
            filemodel.PrefabManager.getInstance().getPrefabByUrl("newfiletxt.prefab", (value: pack. PrefabStaticMesh) => {
                var prefab: pack.PrefabStaticMesh = value;
                var dis: ModelSprite = new ModelSprite();
                MainEditorProcessor.edItorSceneManager.addDisplay(dis);
                LoadManager.getInstance().load(Scene_data.fileRoot + prefab.objsurl, LoadManager.XML_TYPE,
                    ($modelxml: string) => {
                        dis.readTxtToModel($modelxml);
                    });
                filemodel.MaterialManager.getInstance().getMaterialByUrl(prefab.textureurl, ($materialTree: materialui.MaterialTree) => {
                    dis.material = $materialTree;
                })
            })

        }
      
        private readMapFile(): void {
            LoadManager.getInstance().load(Scene_data.fileRoot + "scene.map", LoadManager.BYTE_TYPE,
                ($dtstr: ArrayBuffer) => {
                    var $byte: Pan3d.Pan3dByteArray = new Pan3d.Pan3dByteArray($dtstr);
                    $byte.position = 0
                    var $item: Array<any> = JSON.parse($byte.readUTF());

                    var kkk: Array<FolderMeshVo> = this.wirteItem($item)
                    console.log(kkk)

                    //var kkk: Array<FolderMeshVo> = this.wirteItem(obj.hierarchyList.item)
                    //for (var i: number = 0; i < kkk.length; i++) {
                    //    this.fileItem.push(kkk[i])
                    //}
                    this.isCompelet = true;
                    this.refrishFolder();
                    this.resize()
                });
        }
        public saveMap(): void {
            var tempObj: any = JSON.stringify(this.fileItem);
            var $byte: Pan3d.Pan3dByteArray = new Pan3d.Pan3dByteArray();
            var $fileUrl: string = Pan3d.Scene_data.fileRoot + "scene.map";
  
            $byte.writeUTF(tempObj)

            var $file: File = new File([$byte.buffer], "scene.map");
            var pathurl: string = $fileUrl.replace(Pan3d.Scene_data.ossRoot, "");
            filemodel.FileModel.getInstance().upOssFile($file, pathurl, () => {

                console.log("上传完成")
            
            })



        }
        protected changeScrollBar(): void {
            var th: number = this._uiMask.height - this.a_scroll_bar.height
            var ty: number = this.a_scroll_bar.y - this._uiMask.y;
            this.moveListTy=-  (this.contentHeight - this._uiMask.height) * (ty / th)
            this.refrishFolder()
        }
        public resize(): void {
            if (this.isCompelet) {
                this.contentHeight = this.getItemDisNum(this.fileItem) * 20;
            }
            super.resize()
 
        }
 
        private fileItem: Array<FolderMeshVo>;

        private moveListTy: number = 0;
        private refrishFolder(): void {
            if (this.isCompelet) {
                HierarchyListPanel.listTy = this.moveListTy + this._uiMask.y;
                this.disChiendren(this.fileItem,10);
                var moveTy: number = 0
                this.moveAllTy(this.fileItem, moveTy)
                while (this.cellBgItem.length) {
                    this.removeChild(this.cellBgItem.pop());
                }
                this.showSelectBg(this.fileItem)
            }
      

        }
        private cellBgItem: Array<UICompenent> = []
        private showSelectBg(arr: Array<FolderMeshVo>): void {

            for (var i: number = 0; arr && i < arr.length; i++) {
                if (arr[i].ossListFile.isOpen) {
                    this.showSelectBg(arr[i].childItem)
                }
                if (arr[i].ossListFile.fileNode.treeSelect) {
                    //var ui: FrameCompenent = <FrameCompenent>this.addChild(this._cellBgRender.getComponent("a_select_cell_bg"));
                    //ui.goToAndStop(0)
                    //ui.y = arr[i].pos.y;
                    //ui.x = 0
                    //ui.width = this.pageRect.width
                    //this.cellBgItem.push(ui);
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
        //获取显示数量
        private getItemDisNum(arr: Array<FolderMeshVo>): number {
            var num: number=0
            for (var i: number = 0; arr && i < arr.length; i++) {
                num++
                if (arr[i].ossListFile.isOpen) {
                    num+=   this.getItemDisNum(arr[i].childItem)
                }
            }
            return num
        }
        private static listTy: number
        private disChiendren(arr: Array<FolderMeshVo>, tx: number = 0): void {
            for (var i: number = 0; arr && i < arr.length; i++) {
                arr[i].pos.x = tx;
                arr[i].pos.y = HierarchyListPanel.listTy
                HierarchyListPanel.listTy += 20;
                if (arr[i].ossListFile.isOpen) {
                    this.disChiendren(arr[i].childItem, tx + 20)
                }
            }

        }

 

    }
}