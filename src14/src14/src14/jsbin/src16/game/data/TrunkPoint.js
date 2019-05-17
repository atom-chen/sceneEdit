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
* name
*/
var game;
(function (game) {
    var data;
    (function (data) {
        var TrunkPoint = /** @class */ (function (_super) {
            __extends(TrunkPoint, _super);
            function TrunkPoint() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                /**
                 * 下一点的节点数据
                 */
                _this.nextPoints = new Array();
                return _this;
            }
            return TrunkPoint;
        }(data.point));
        data.TrunkPoint = TrunkPoint;
    })(data = game.data || (game.data = {}));
})(game || (game = {}));
//# sourceMappingURL=TrunkPoint.js.map