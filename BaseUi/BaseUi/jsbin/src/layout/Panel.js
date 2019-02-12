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
var layout;
(function (layout) {
    var Panel = /** @class */ (function (_super) {
        __extends(Panel, _super);
        function Panel(has) {
            if (has === void 0) { has = true; }
            var _this = _super.call(this) || this;
            if (has) {
                _this.winBg = new layout.LayoutbaseBg();
                _this.addUIContainer(_this.winBg);
                _this.changeSize();
            }
            return _this;
        }
        Panel.prototype.changeSize = function () {
            if (this.winBg) {
                this.winBg.pageRect = this.rect;
            }
        };
        return Panel;
    }(layout.Sprite));
    layout.Panel = Panel;
})(layout || (layout = {}));
//# sourceMappingURL=Panel.js.map