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
    var InteractiveEvent = Pan3d.InteractiveEvent;
    var ModuleEventManager = Pan3d.ModuleEventManager;
    var RoleAnimi2DUI = /** @class */ (function (_super) {
        __extends(RoleAnimi2DUI, _super);
        function RoleAnimi2DUI() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.selectMeshId = 0;
            return _this;
        }
        RoleAnimi2DUI.prototype.initView = function () {
            _super.prototype.initView.call(this);
            this.textLabelUI = new prop.TextLabelUI();
            this.comboBoxUi = new prop.ComboBoxUi();
            this.md5animUrlText = new prop.TextLabelUI(200, 16);
            this.md5animPicUi = new prop.TexturePicUi();
            this.md5searchIcon = new prop.BaseMeshUi(20, 20);
            this.propPanle.addBaseMeshUi(this.textLabelUI);
            this.propPanle.addBaseMeshUi(this.comboBoxUi);
            this.propPanle.addBaseMeshUi(this.md5animUrlText);
            this.propPanle.addBaseMeshUi(this.md5animPicUi);
            this.propPanle.addBaseMeshUi(this.md5searchIcon);
            this.drawUrlImgToUi(this.md5searchIcon.ui, "icon/search.png");
            this.comboBoxUi.addEventListener(InteractiveEvent.Down, this.comboBoxUiDown, this);
            this.height = 150;
        };
        RoleAnimi2DUI.prototype.destory = function () {
            this.textLabelUI.destory();
            this.comboBoxUi.destory();
            this.md5animUrlText.destory();
            this.md5animPicUi.destory();
            this.md5searchIcon.destory();
            _super.prototype.destory.call(this);
        };
        Object.defineProperty(RoleAnimi2DUI.prototype, "x", {
            get: function () {
                return this._x;
            },
            set: function (value) {
                this._x = value;
                this.textLabelUI.x = this._x + 0;
                this.comboBoxUi.x = this._x + 75;
                this.md5animUrlText.x = this._x + 60;
                this.md5animPicUi.x = this._x + 60;
                this.md5searchIcon.x = this._x + 150;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RoleAnimi2DUI.prototype, "y", {
            get: function () {
                return this._y;
            },
            set: function (value) {
                this._y = value;
                this.textLabelUI.y = this._y + 4;
                this.comboBoxUi.y = this._y + 6;
                this.md5animUrlText.y = this._y + 100;
                this.md5animPicUi.y = this._y + 35;
                this.md5searchIcon.y = this._y + 40;
            },
            enumerable: true,
            configurable: true
        });
        RoleAnimi2DUI.prototype.comboBoxUiDown = function ($evt) {
            var _this = this;
            var $rightMenuEvet = new menutwo.MenuTwoEvent(menutwo.MenuTwoEvent.SHOW_COMBOX_MENU);
            $rightMenuEvet.posv2d = new Vector2D(this.comboBoxUi.ui.absoluteX, this.comboBoxUi.ui.absoluteY + 20);
            var arrItem = [];
            for (var i = 0; i < this._skinMesh.meshAry.length; i++) {
                arrItem.push({ name: "anim_" + i, type: i });
            }
            $rightMenuEvet.comboxData = arrItem;
            $rightMenuEvet.comboxFun = function (value) { _this.selectFun(value); };
            ModuleEventManager.dispatchEvent($rightMenuEvet);
        };
        RoleAnimi2DUI.prototype.selectFun = function (value) {
            this.selectMeshId = value;
            this.refreshViewValue();
        };
        Object.defineProperty(RoleAnimi2DUI.prototype, "data", {
            get: function () {
                return this._data;
            },
            set: function (value) {
                this._data = value;
            },
            enumerable: true,
            configurable: true
        });
        RoleAnimi2DUI.prototype.refreshViewValue = function () {
            if (this.FunKey) {
                this._skinMesh = this.target[this.FunKey];
                this.textLabelUI.label = "部分";
                this.comboBoxUi.text = "anim_" + this.selectMeshId;
                this.md5animPicUi.url = "icon/txt_64x.png";
                this.md5animUrlText.label = "ccav.md5anim";
            }
        };
        return RoleAnimi2DUI;
    }(prop.BaseReflComponent));
    prop.RoleAnimi2DUI = RoleAnimi2DUI;
})(prop || (prop = {}));
//# sourceMappingURL=RoleAnimi2DUI.js.map