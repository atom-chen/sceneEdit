/**
* name g公会大厅数据表
*/
var game;
(function (game) {
    var data;
    (function (data_1) {
        var template;
        (function (template) {
            var ClanCFactionGoldBankBaseVo = /** @class */ (function () {
                function ClanCFactionGoldBankBaseVo() {
                }
                ClanCFactionGoldBankBaseVo.prototype.parse = function (data) {
                    this.id = data.getUint32();
                    this.levelupcost = data.getUint32();
                    this.bonus = data.getUint32();
                    this.allbonus = data.getUint32();
                    this.limitmoney = data.getUint32();
                    this.costeveryday = data.getUint32();
                };
                return ClanCFactionGoldBankBaseVo;
            }());
            template.ClanCFactionGoldBankBaseVo = ClanCFactionGoldBankBaseVo;
        })(template = data_1.template || (data_1.template = {}));
    })(data = game.data || (game.data = {}));
})(game || (game = {}));
//# sourceMappingURL=ClanCFactionGoldBankBaseVo.js.map