var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var inputres;
(function (inputres) {
    var Scene_data = Pan3d.Scene_data;
    var Pan3dByteArray = Pan3d.Pan3dByteArray;
    var LoadManager = Pan3d.LoadManager;
    var ObjDataManager = Pan3d.ObjDataManager;
    var SceneRes = /** @class */ (function (_super) {
        __extends(SceneRes, _super);
        function SceneRes() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        SceneRes.prototype.readScene = function () {
            _super.prototype.readScene.call(this);
            this.bfun();
        };
        SceneRes.prototype.saveImgToSever = function (imgAryBuffer, httpUrl) {
            var $img = new Image();
            $img.url = httpUrl.replace(Scene_data.fileRoot, "");
            $img.src = 'data:image/png;base64,' + Pan3d.Base64.encode(imgAryBuffer);
            var $upfile = this.dataURLtoFile($img.src, $img.url);
            this.upOssFile($upfile, httpUrl);
        };
        SceneRes.prototype.dataURLtoFile = function (dataurl, filename) {
            var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1], bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new File([u8arr], filename, { type: mime });
        };
        SceneRes.prototype.readChangeBuff = function (data, $dataWidth, $offset, $stride) {
            var $arr = new Array;
            var len = data.byteLength / (4 * $stride);
            for (var i = 0; i < len; i++) {
                var pos = $stride * i + $offset;
                for (var j = 0; j < $dataWidth; j++) {
                    var id = (pos + j) * 4;
                    var num = data.getFloat32(id, true);
                    data.setFloat32(id, num, true);
                    $arr.push(num);
                }
            }
            return $arr;
        };
        SceneRes.prototype.saveObjDataToSever = function (objdata, httpUrl) {
            httpUrl = httpUrl.replace(".xml", ".objs");
            var obj = {};
            var tw = objdata.stride / 4;
            obj.vertices = this.readChangeBuff(objdata.dataView, 3, 0, tw);
            obj.uvs = this.readChangeBuff(objdata.dataView, 2, 3, tw);
            obj.lightUvs = this.readChangeBuff(objdata.dataView, 2, 5, tw);
            obj.normals = obj.vertices;
            obj.indexs = objdata.indexs;
            for (var i = 0; i < obj.vertices.length; i++) {
                obj.vertices[i] *= 0.1; //输小;
            }
            var $file = new File([JSON.stringify(obj)], "expmapinfo.objs");
            this.upOssFile($file, httpUrl);
        };
        SceneRes.prototype.refrishDicGroup = function (pathurl) {
            pack.FileOssModel.getDisByOss(pathurl, function () {
                console.log("刷新了文件夹目录", pathurl);
            });
        };
        SceneRes.prototype.upOssFile = function (file, pathurl) {
            var _this = this;
            pathurl = pathurl.replace(Pan3d.Scene_data.ossRoot, "");
            console.log(pathurl);
            pack.FileOssModel.upOssFile(file, pathurl, function () {
                _this.refrishDicGroup(pathurl);
            });
        };
        SceneRes.prototype.readObj = function ($srcByte) {
            var objNum = $srcByte.readInt();
            for (var i = 0; i < objNum; i++) {
                var url = Scene_data.fileRoot + $srcByte.readUTF();
                var size = $srcByte.readInt();
                var newByte = new Pan3dByteArray();
                newByte.length = size;
                $srcByte.readBytes(newByte, 0, size);
                var objData = ObjDataManager.getInstance().loadObjCom(newByte.buffer, url);
                this.saveObjDataToSever(objData, url);
            }
            if (this._imgFun) {
                this._imgFun();
            }
        };
        SceneRes.prototype.readImg = function () {
            this.imgNum = this._byte.readInt();
            this.imgLoadNum = 0;
            for (var i = 0; i < this.imgNum; i++) {
                var url = Scene_data.fileRoot + this._byte.readUTF();
                var imgSize = this._byte.readInt();
                if (url.search(".jpng") != -1) {
                    this.readJpngImg(url);
                    continue;
                }
                var imgAryBuffer = this._byte.buffer.slice(this._byte.position, this._byte.position + imgSize);
                this._byte.position += imgSize;
                this.saveImgToSever(imgAryBuffer, url);
                this.countImg();
            }
        };
        return SceneRes;
    }(Pan3d.SceneRes));
    inputres.SceneRes = SceneRes;
    var ImputGameResModel = /** @class */ (function () {
        function ImputGameResModel() {
        }
        ImputGameResModel.getInstance = function () {
            if (!this._instance) {
                this._instance = new ImputGameResModel();
            }
            return this._instance;
        };
        ImputGameResModel.prototype.loadSceneByUrl = function () {
            var sceneRes = new SceneRes();
            sceneRes.bfun = function () {
                console.log("sceneres", sceneRes);
            };
            LoadManager.getInstance().load(Scene_data.fileRoot + "pan/expmapinfo.txt", LoadManager.BYTE_TYPE, function ($byte) {
                sceneRes.loadComplete($byte);
            });
        };
        return ImputGameResModel;
    }());
    inputres.ImputGameResModel = ImputGameResModel;
})(inputres || (inputres = {}));
//# sourceMappingURL=InputGameResModel.js.map