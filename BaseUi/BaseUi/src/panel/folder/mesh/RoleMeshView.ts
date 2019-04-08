﻿module filelist {
    import Scene_data = Pan3d.Scene_data;
    import Vector3D = Pan3d.Vector3D;
    import Material = Pan3d.Material
 
    import RoleStaticMesh = pack.RoleStaticMesh
    import MetaDataView = prop.MetaDataView;
    import ReflectionData = prop.ReflectionData;


    export class RoleMeshView extends MetaDataView {
        private _roleStaticMesh: RoleStaticMesh
        public getView(): Array<any> {
            var ary: Array<any> =
                [
                    { Type: ReflectionData.TEXT, Label: "名字:", FunKey: "roleurl", target: this, Category: "action" },
          
            
                    { Type: ReflectionData.RoleAnim2DUI, Label: "动作:", FunKey: "animDic", changFun: ( ) => { this.animChange( ) }, target: this, Suffix: "md5mesh", Category: "action" },



                    { Type: ReflectionData.RoleMesh2DUI, Label: "mesh:", FunKey: "skinMesh", changFun: (value: Array<any>) => { this.textureChangeInfo(value) }, target: this, Suffix: "md5mesh", Category: "mesh" },


                    //{ Type: ReflectionData.MaterialPicUi, Label: "纹理:", FunKey: "texture", changFun: (value: Array<any>) => { this.textureChangeInfo(value) }, target: this, Suffix: "material", Category: "mesh" },
                ];
            return ary;
        }
        private animChange(): void {
  
            this.saveToSever()
            this.chuangeData()

        }
        public set animDic(value: Array<any>) {

            this.refreshViewValue()
        }
        public get animDic(): Array<any> {
            return this._roleStaticMesh.animDic
        }

        public set skinMesh(value: Array<any>) {

            this.refreshViewValue()
        }
        public get skinMesh(): Array<any> {
            return this._roleStaticMesh.skinMesh
        }


     
      

        private textureChangeInfo(value: Array<any>): void {
            //this._roleStaticMesh.paramInfo = value;
            this.saveToSever()
            this.chuangeData()

        }
        private chuangeData(): void {
            this._roleStaticMesh.dispatchEvent(new Pan3d.BaseEvent(Pan3d.BaseEvent.COMPLETE))
        }
   
        public set roleurl(value: string) {

        }
        public get roleurl(): string {
            return this._roleStaticMesh.url
        }

        public set texture(value: Material) {
            this._roleStaticMesh.material = value
            this.refreshViewValue()
        }
        public get texture(): Material {
            return this._roleStaticMesh.material
        }
  

        public set data(value: any) {
            this._data = value;
            this._roleStaticMesh = this._data
            this.refreshViewValue()
        }
        public get data(): any {
            return this._data
        }

        public getChangeRoleStr(): string {
            if (this._roleStaticMesh.skinMesh) {
                var temp: any = {};
                temp.meshAry = this._roleStaticMesh.skinMesh.meshAry;
                temp.animDic = this._roleStaticMesh.animDic;
                temp.animPlayKey = this._roleStaticMesh.animPlayKey;
              //  temp.textureurl = "base.material";
                var $str: string = JSON.stringify(temp);
                return $str
            } else {
                return null
            }
        }


        private isSaveNow: boolean;
        private lastTm: number
        private saveTm: number
        public saveToSever(): void {
            this.lastTm = Pan3d.TimeUtil.getTimer()
            // this.isSaveNow = true

            if (!this.isSaveNow) {
                this.isSaveNow = true
                this.saveTm = this.lastTm;

                var $roleStr: string = this.getChangeRoleStr()
                var $file: File = new File([$roleStr], "ossfile.txt");
                var pathUrl: string = Pan3d.Scene_data.fileRoot + this._roleStaticMesh.url
                var pathurl: string = pathUrl.replace(Pan3d.Scene_data.ossRoot, "");

                console.log("提交上传ing...", pathurl);
                pack.FileOssModel.upOssFile($file, pathurl, () => {

                    if (this.lastTm != this.saveTm) {
                        console.log("不是最后一次，所以需要再存一次")
                        Pan3d.TimeUtil.addTimeOut(1000, () => {
                            this.isSaveNow = false
                            this.saveToSever();
                        })
                    } else {
                        this.isSaveNow = false
                        console.log("更新角色完成", pathurl + $file.name);
                    }
                })
            } else {
                console.log("正在处理保存")
            }

        }

        //public saveToSever(): void {

        //    var $roleStr: string = this.getChangeRoleStr()
     
        //    if ($roleStr) {
        //        var $file: File = new File([$roleStr], "ossfile.txt");
     
        //        var pathUrl: string = Pan3d.Scene_data.fileRoot + this._roleStaticMesh.url
        //        var pathurl: string = pathUrl.replace(Pan3d.Scene_data.ossRoot, "");

        //        console.log("提交上传ing...", pathurl);
        //        pack.FileOssModel.upOssFile($file, pathurl, () => {
        //            console.log("上传成功", pathurl);
        //        })

        //    } else {
        //        console.log("没有可上传mesh数据");
        //    }

        //}


    }
}