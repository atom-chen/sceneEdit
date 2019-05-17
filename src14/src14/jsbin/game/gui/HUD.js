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
/**
* HUD
*/
var game;
(function (game) {
    var gui;
    (function (gui) {
        var HUD = /** @class */ (function (_super) {
            __extends(HUD, _super);
            function HUD(app) {
                return _super.call(this, app) || this;
            }
            HUD.prototype.closeAll = function () {
                //除了某个页面
                for (var key in this._pages) {
                    var pageid = Number(key);
                    this.close(pageid);
                }
            };
            return HUD;
        }(game.gui.base.PageContainer));
        gui.HUD = HUD;
    })(gui = game.gui || (game.gui = {}));
})(game || (game = {}));
//# sourceMappingURL=HUD.js.map