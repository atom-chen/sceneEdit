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
var prop;
(function (prop) {
    var Label2DUI = /** @class */ (function (_super) {
        __extends(Label2DUI, _super);
        function Label2DUI() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Label2DUI.prototype.initView = function () {
            this.textLabelUI = new prop.TextLabelUI();
            this.height = 20;
        };
        Label2DUI.prototype.destory = function () {
            this.textLabelUI.destory();
        };
        Object.defineProperty(Label2DUI.prototype, "data", {
            get: function () {
                return this._data;
            },
            set: function (value) {
                this._data = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Label2DUI.prototype, "x", {
            get: function () {
                return this._x;
            },
            set: function (value) {
                this._x = value;
                this.textLabelUI.x = this._x + 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Label2DUI.prototype, "y", {
            get: function () {
                return this._y;
            },
            set: function (value) {
                this._y = value;
                this.textLabelUI.y = this._y;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Label2DUI.prototype, "label", {
            get: function () {
                return this._label;
            },
            set: function (value) {
                this._label = value;
                this.textLabelUI.label = value;
            },
            enumerable: true,
            configurable: true
        });
        return Label2DUI;
    }(prop.BaseReflComponent));
    prop.Label2DUI = Label2DUI;
})(prop || (prop = {}));
//# sourceMappingURL=Label2DUI.js.map