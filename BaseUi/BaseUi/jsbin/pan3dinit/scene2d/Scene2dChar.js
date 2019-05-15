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
var scene2d;
(function (scene2d) {
    var me;
    (function (me) {
        var Scene2dChar = /** @class */ (function (_super) {
            __extends(Scene2dChar, _super);
            function Scene2dChar() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Scene2dChar.prototype.setWeaponByAvatar = function (avatar, $suffix) {
                if ($suffix === void 0) { $suffix = ""; }
                this.addPart(Pan3d.me.SceneChar.WEAPON_PART, Pan3d.me.SceneChar.WEAPON_DEFAULT_SLOT, this.getSceneCharWeaponUrl(avatar, $suffix));
            };
            Scene2dChar.prototype.setWingByID = function ($wingId) {
                if (!this._wingDisplay) {
                    this._wingDisplay = new Pan3d.me.SceneBaseChar();
                }
                this._wingDisplay.setRoleUrl(getRoleUrl($wingId));
                this._wingDisplay.setBind(this, Pan3d.me.SceneChar.WING_SLOT);
                Pan3d.me.SceneManager.getInstance().addMovieDisplay(this._wingDisplay);
            };
            Scene2dChar.prototype.setMountById = function ($mountId) {
                if (!this.mountChar) {
                    this.mountChar = new Pan3d.me.MountChar();
                }
                this.mountChar.setRoleUrl(getRoleUrl($mountId));
                this.setBind(this.mountChar, Pan3d.me.SceneChar.MOUNT_SLOT);
                Pan3d.me.SceneManager.getInstance().addMovieDisplay(this.mountChar);
                this.isMount = true;
            };
            Scene2dChar.prototype.set2dPos = function ($x, $y) {
                this.x = $x * me.Override2dEngine.htmlScale;
                this.z = $y * me.Override2dEngine.htmlScale / (Math.sin(45 * Math.PI / 180)) * -1;
                if (this.mountChar) {
                    this.mountChar.x = this.x;
                    this.mountChar.z = this.z;
                }
            };
            Object.defineProperty(Scene2dChar.prototype, "rotationY", {
                set: function (value) {
                    this._rotationY = value;
                    if (this.mountChar) {
                        this.mountChar.rotationY = this._rotationY;
                    }
                    this.updateMatrix();
                    this.updateRotationMatrix();
                },
                enumerable: true,
                configurable: true
            });
            return Scene2dChar;
        }(Pan3d.me.SceneChar));
        me.Scene2dChar = Scene2dChar;
    })(me = scene2d.me || (scene2d.me = {}));
})(scene2d || (scene2d = {}));
//# sourceMappingURL=Scene2dChar.js.map