/**
* @Author: LinQiuWen
* @description:s商店商城商会表/sMT3商会一级菜单配置
* description: D点卡服表格/DMT3点卡服商会一级菜单配置
*/
var game;
(function (game) {
    var data;
    (function (data_1) {
        var template;
        (function (template) {
            var CCommerceFirstMenuBaseVo = /** @class */ (function () {
                //
                function CCommerceFirstMenuBaseVo() {
                    this.secondmenu = []; //二级菜单1id,二级菜单2id,二级菜单3id,二级菜单4id,二级菜单5id,二级菜单6id,二级菜单7id,二级菜单8id,二级菜单9id,二级菜单10id,二级菜单11id,二级菜单12id,二级菜单13id,二级菜单14id,二级菜单15id,二级菜单16id,二级菜单17id,二级菜单18id,二级菜单19id,二级菜单20id,二级菜单21id,二级菜单22id,二级菜单23id,二级菜单24id,二级菜单25id,二级菜单26id,二级菜单27id,二级菜单28id,二级菜单29id,二级菜单30id
                }
                CCommerceFirstMenuBaseVo.prototype.parse = function (data) {
                    this.id = data.getUint32();
                    this.name = data.getUTFBytes(data.getUint32());
                    var length = data.getUint32();
                    for (var index = 0; index < length; index++) {
                        this.secondmenu.push(data.getUint32());
                    }
                };
                return CCommerceFirstMenuBaseVo;
            }());
            template.CCommerceFirstMenuBaseVo = CCommerceFirstMenuBaseVo;
        })(template = data_1.template || (data_1.template = {}));
    })(data = game.data || (game.data = {}));
})(game || (game = {}));
//# sourceMappingURL=CCommerceFirstMenuBaseVo.js.map