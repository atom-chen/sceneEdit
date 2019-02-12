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
var editscene;
(function (editscene) {
    var Panel = layout.Panel;
    var Rectangle = Pan3d.Rectangle;
    var Vector2D = Pan3d.Vector2D;
    var Scene_data = Pan3d.Scene_data;
    var EditScenePanel = /** @class */ (function (_super) {
        __extends(EditScenePanel, _super);
        function EditScenePanel() {
            var _this = _super.call(this, false) || this;
            _this.addRight();
            _this.addLeft();
            _this.addLeftMoveLine();
            _this.addRightMoveLine();
            _this.addBottomMoveLine();
            _this.resize();
            return _this;
        }
        EditScenePanel.prototype.addBottomMoveLine = function () {
            this.bottomMoveLine = new editscene.EditSceneLineVertical;
            this.bottomMoveLine.y = Scene_data.stageHeight * 0.7;
            this.bottomMoveLine.roundPos = new Vector2D(0.5, 0.80);
            this.addChild(this.bottomMoveLine);
        };
        EditScenePanel.prototype.addLeftMoveLine = function () {
            this.leftMoveLine = new editscene.EditSceneLine;
            this.leftMoveLine.x = Scene_data.stageWidth * 0.20;
            this.leftMoveLine.roundPos = new Vector2D(0.15, 0.45);
            this.addChild(this.leftMoveLine);
        };
        EditScenePanel.prototype.addRightMoveLine = function () {
            this.rightMoveLine = new editscene.EditSceneLine;
            this.rightMoveLine.x = Scene_data.stageWidth * 0.80;
            this.rightMoveLine.roundPos = new Vector2D(0.55, 0.85);
            this.addChild(this.rightMoveLine);
        };
        EditScenePanel.prototype.addRight = function () {
            var temp = new Panel();
            temp.x = 600;
            temp.y = 0;
            temp.width = 450;
            temp.height = 500;
            this.addChild(temp);
            this.rightPanel = temp;
        };
        EditScenePanel.prototype.addLeft = function () {
            var temp = new Panel();
            temp.x = 0;
            temp.y = 0;
            temp.width = 450;
            temp.height = 500;
            this.addChild(temp);
            this.leftPanel = temp;
        };
        EditScenePanel.prototype.resize = function () {
            this.leftPanel.height = this.bottomMoveLine.y;
            this.leftPanel.width = this.leftMoveLine.x;
            this.rightPanel.height = Scene_data.stageHeight;
            this.leftMoveLine.x = this.leftPanel.width;
            this.leftMoveLine.height = this.leftPanel.height;
            this.rightMoveLine.height = Scene_data.stageHeight;
            this.rightPanel.width = Scene_data.stageWidth - this.rightMoveLine.x - 10;
            this.rightPanel.x = Scene_data.stageWidth - this.rightPanel.width;
            this.bottomMoveLine.width = this.rightPanel.x - 10;
            this.bottomMoveLine.x = 0;
            _super.prototype.resize.call(this);
            var rect = new Rectangle(0, this.bottomMoveLine.y + 10, this.bottomMoveLine.width, Scene_data.stageHeight - this.bottomMoveLine.y - 15);
            Pan3d.ModuleEventManager.dispatchEvent(new folder.FolderEvent(folder.FolderEvent.EDITSCENE_RESET_SIZE), rect);
        };
        return EditScenePanel;
    }(Panel));
    editscene.EditScenePanel = EditScenePanel;
})(editscene || (editscene = {}));
//# sourceMappingURL=EditScenePanel.js.map