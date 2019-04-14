﻿module filelist {
    import Scene_data = Pan3d.Scene_data;
    import Vector3D = Pan3d.Vector3D;
    import Material = Pan3d.Material

    import RoleStaticMesh = pack.RoleStaticMesh
    import MetaDataView = prop.MetaDataView;
    import ReflectionData = prop.ReflectionData;


    export class SkillMeshView extends MetaDataView {
        private _skillStaticMesh: pack.SkillStatcMesh
        public getView(): Array<any> {
            var ary: Array<any> =
                [
                    { Type: ReflectionData.TEXT, Label: "名字:", FunKey: "filename", target: this, Category: "属性" },

                    { Type: ReflectionData.Texturue2DUI, Label: "角色:", FunKey: "roleurl", Suffix: "zzw", target: this, Category: "属性" },
                    { Type: ReflectionData.Texturue2DUI, Label: "技能:", FunKey: "skillurl", Suffix: "txt", target: this, Category: "属性" },
  
                ];
            return ary;
        }
        public set filename(value: string) {

        }
        public get filename(): string {
            return this._skillStaticMesh.url

        }
        public set roleurl(value: string) {
            this._skillStaticMesh.roleUrl = value
            this.saveToSever()
            this.refreshViewValue()

        }
        public get roleurl(): string {
            return this._skillStaticMesh.roleUrl

        }
        public set skillurl(value: string) {
            this._skillStaticMesh.skillUrl = value
            this.saveToSever()
            this.refreshViewValue()
        }
        public get skillurl(): string {
            return this._skillStaticMesh.skillUrl

        }
        public set data(value: any) {
            this._data = value;

            this._skillStaticMesh = value
 
            this.refreshViewValue()
        }
        public get data(): any {
            return this._data
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

                var $temp: any = this._skillStaticMesh.getObject();

                var $roleStr: string = JSON.stringify($temp);

                var $file: File = new File([$roleStr], "ossfile.txt");
                var pathUrl: string = Pan3d.Scene_data.fileRoot + this._skillStaticMesh.url
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


    }
}