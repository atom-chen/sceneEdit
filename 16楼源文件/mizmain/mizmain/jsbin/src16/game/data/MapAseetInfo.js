/**
* name
*/
var game;
(function (game) {
    var data;
    (function (data_1) {
        var MapAssetInfo = /** @class */ (function () {
            function MapAssetInfo() {
                // 地图ID
                this.id = 0;
                // 地图资源id
                this.imgId = 0;
                this._singWrap = "\n";
                this._singSeparate = "|";
                //////////////////////////////////////////
                //初始化完毕
                this.isInited = false;
            }
            MapAssetInfo.prototype.load = function (mapid) {
                var _this = this;
                this.clear();
                this.id = mapid;
                //地图数据
                var url = game.Path.scene_maps + this.id.toFixed(0) + ".json";
                var refAsset = data_1.RefAsset.Get(url);
                refAsset.retain();
                if (!refAsset.parseComplete) {
                    refAsset.once(LEvent.COMPLETE, this, function () {
                        var data = Laya.loader.getRes(url);
                        refAsset.release(true);
                        _this.onmapAssetInfoComplete(data);
                    });
                }
                else {
                    var data_2 = Laya.loader.getRes(url);
                    refAsset.release(true);
                    this.onmapAssetInfoComplete(data_2);
                }
            };
            //地图数据完成事件
            MapAssetInfo.prototype.onmapAssetInfoComplete = function (data) {
                this.trukPath = new data_1.TrunkPath(new game.utils.AStar(this));
                this.read(data);
                if (this.onLoadedComplete)
                    this.onLoadedComplete();
            };
            MapAssetInfo.prototype.read = function (data) {
                var lines = data;
                //读取基本信息 0
                this.id = lines["Id"];
                this.imgId = lines["ImgId"] ? lines["ImgId"] : 0;
                this.name = lines["MapName"];
                this.date = lines["CreateDate"];
                this.pxWidth = lines["MapWidth"];
                this.pxHeight = lines["MapHeight"];
                this.floorWidth = lines["TileWidth"];
                this.floorHeight = lines["TileHeight"];
                this.logicWidth = lines["MapLogicWidth"];
                this.logicHeight = lines["MapLogicHeight"];
                this.isInstance = lines["MapFlags"];
                this.parentID = lines["parentID"];
                this.sound = lines["MapMusic"];
                this.shadow = lines["Shadow"];
                this.count = lines["count"];
                this.dayLimit = lines["dayLimit"];
                this.weekLimit = lines["weekLimit"];
                this.instanceType = lines["instanceType"];
                this.weatherType = lines["weatherType"] ? lines["weatherType"] : 0;
                var len;
                var i;
                var port;
                var p;
                var key;
                //路障 1
                var obstacleInfo = lines["BlockItems"];
                len = obstacleInfo.length;
                this.obstacleMask = new UpdateMask();
                for (i = 0; i < len; i++) {
                    this.obstacleMask.setInt(i, obstacleInfo[i]);
                }
                //透明 2
                var transparentInfo = lines["AlphaItems"];
                len = transparentInfo.length;
                this.halfTranMask = new UpdateMask();
                var isW = false;
                for (i = 0; i < len; i = i + 2) {
                    var posX = transparentInfo[i];
                    var posY = transparentInfo[i + 1];
                    var idx = posY * this.logicWidth + posX;
                    this.halfTranMask.SetBit(idx);
                }
                //传送点 4
                var teleportInfo = lines["SenderItems"];
                len = teleportInfo.length;
                var teleports = new Array(len);
                var teleport;
                for (i = 0; i < len; i++) {
                    var tObj = teleportInfo[i];
                    teleport = new data_1.Teleport();
                    teleport.srcPortX = tObj["curX"];
                    teleport.srcPortY = tObj["curY"];
                    teleport.tempId = tObj["tempId"];
                    teleport.name = tObj["Name"];
                    teleport.dstMapid = tObj["MapId"];
                    teleport.dstPortX = tObj["X"];
                    teleport.dstPortY = tObj["Y"];
                    teleports[i] = teleport;
                }
                //主干道 5
                var trunkInfo = lines["trunkRoadPoints"];
                len = trunkInfo.length;
                var trunkPoints = new Array();
                for (i = 0; i < len; i++) {
                    var tOjb = trunkInfo[i];
                    var tkpt = new data_1.TrunkPoint();
                    tkpt.id = trunkPoints.length;
                    tkpt.x = tOjb["curX"];
                    tkpt.y = tOjb["curY"];
                    var nextArr = tOjb["nextPoints"];
                    var nextLen = nextArr.length;
                    for (var j = 0; j < nextLen; j = j + 2) {
                        tkpt.nextPoints.push(new data_1.point(Number(nextArr[j]), Number(nextArr[j + 1])));
                    }
                    trunkPoints.push(tkpt);
                }
                this.trukPath.trunkPoints = trunkPoints;
                //所有生物 9
                var creatureInfo = lines["CreatureItems"];
                if (creatureInfo) {
                    len = creatureInfo.length;
                    this.creatures = new Array(len);
                    var creature;
                    for (i = 0; i < len; i++) {
                        var cObj = creatureInfo[i];
                        creature = new data_1.MapCreature();
                        creature.id = cObj["Id"];
                        creature.x = cObj["X"];
                        creature.y = cObj["Y"];
                        creature.count = cObj["Count"];
                        creature.spawnType = cObj["SpawnType"];
                        creature.respawnTime = cObj["RespawnTime"];
                        creature.spawnTime1 = cObj["SpawnTime1"];
                        creature.spawnTime2 = cObj["SpawnTime2"];
                        creature.spawnTime3 = cObj["SpawnTime3"];
                        creature.scriptName = cObj["ScriptName"];
                        creature.around = cObj["Around"];
                        creature.lineId = cObj["LineId"];
                        creature.flag = cObj["Flag"];
                        creature.toward = cObj["Direct"];
                        creature.aliasName = cObj["aliasName"];
                        // creature.T = Template.getCreature_T(creature.id);
                        this.creatures[i] = creature;
                    }
                }
                //水掩码 TODO
                this.waterMask = new UpdateMask();
                var waterMaskInfo = lines["WaterMask"];
                if (waterMaskInfo) {
                    len = waterMaskInfo.length;
                    var isWater = false;
                    for (i = 0; i < len; i = i + 2) {
                        var posX = waterMaskInfo[i];
                        var posY = waterMaskInfo[i + 1];
                        var idx = posY * this.logicWidth + posX;
                        this.waterMask.SetBit(idx);
                    }
                }
                //考虑版本兼容
                this.farLayers = [];
                var farInfo = lines["FarItems"];
                if (farInfo) {
                    len = farInfo.length;
                    for (i = 0; i < len; i++) {
                        var info = farInfo[i];
                        var farLayer = new data_1.MapFarData();
                        farLayer.name = info.name;
                        farLayer.width = Number(info.width);
                        farLayer.height = Number(info.height);
                        farLayer.xMoveRate = Number(info.xMoveRate);
                        farLayer.yMoveRate = Number(info.yMoveRate);
                        farLayer.x = Number(info.x);
                        farLayer.y = Number(info.y);
                        farLayer.depth = Number(info.sort);
                        this.farLayers.push(farLayer);
                    }
                    this.farLayers.sort(function (a, b) {
                        return b.depth - a.depth;
                    });
                }
                //水层数据读取
                var warterInfo = lines["WaterItems"];
                if (warterInfo) {
                    len = warterInfo.length;
                    this.waters = new Array(len);
                    var warter = void 0;
                    for (i = 0; i < len; i++) {
                        var warterObj = warterInfo[i];
                        warter = new data_1.MapWater();
                        warter.name = warterObj["name"];
                        warter.x = warterObj["x"];
                        warter.y = warterObj["y"];
                        warter.atBottom = warterObj["atBottom"] == 1;
                        warter.width = warterObj["width"];
                        warter.height = warterObj["height"];
                        warter.streamDirect = warterObj["streamDirect"];
                        warter.streamSpeed = warterObj["streamSpeed"];
                        warter.waveLength = warterObj["waveLength"];
                        warter.waveBreadth = warterObj["waveBreadth"];
                        warter.waveHeight = warterObj["waveHeight"];
                        this.waters[i] = warter;
                    }
                }
                this.isInited = true;
            };
            MapAssetInfo.prototype.wirteLine = function (lines, line) {
                if (game.utils.StringU.endsWith(line, this._singSeparate)) {
                    line = line.substr(0, line.length - 1);
                }
                // lines.push(line);
            };
            MapAssetInfo.prototype.writeLineArg = function (lines) {
                var arg = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    arg[_i - 1] = arguments[_i];
                }
                var line = "";
                for (var i = 0; i < arg.length; i++) {
                    line += arg[i] + this._singSeparate;
                }
                this.wirteLine(lines, line);
            };
            /**
             * 两点直线网格碰撞 (是否可通过)
             * @param x0 起点x
             * @param y0 起点y
             * @param x1 终点x
             * @param y1 终点y
             * @return 返回是否可以通过
             */
            MapAssetInfo.prototype.canTransit = function (x0, y0, x1, y1, p) {
                var dx = Math.abs(x1 - x0);
                var dy = -Math.abs(y1 - y0);
                var sx = x0 < x1 ? 1 : -1;
                var sy = y0 < y1 ? 1 : -1;
                var err = dx + dy;
                var e2; /* error value e_xy */
                //允许最大的过期次数
                var maxTTL = 3000;
                //过期次数
                var ttl = 0;
                //第一点，第一点允许为障碍点
                var isStart = true;
                while (true) /* loop */ {
                    if (ttl >= maxTTL) {
                        loge("MapData:MapData.canTransit,TTL more than MAX:" + maxTTL.toString());
                        return null;
                    }
                    ttl++;
                    //如果是路障，表示两点直线不可通过
                    if (!isStart && this.isObstacle(x0, y0))
                        return false;
                    isStart = false;
                    if (p) {
                        p.x = x0;
                        p.y = y0;
                    }
                    if (x0 == x1 && y0 == y1)
                        break;
                    e2 = 2 * err;
                    if (e2 >= dy) {
                        err += dy;
                        x0 += sx;
                    } /* e_xy+e_x > 0 */
                    if (e2 <= dx) {
                        err += dx;
                        y0 += sy;
                    } /* e_xy+e_y < 0 */
                }
                return true;
            };
            /**
             * 获得指定点周围无路障的点
             * @param refPoint 输入点和返回点
             * @param max_r 最大半径
             *
             */
            MapAssetInfo.prototype.getRoundNotObs = function (refPoint, max_r) {
                if (max_r >= 500) {
                    loge("MapData.getRoundNotObs,max_r more than MAX:500");
                    return;
                }
                var distance = 1;
                //当前尝试的圈数
                var circle = 0;
                var maxTTL = 20000;
                var ttl = 0;
                while (true) {
                    ttl++;
                    if (ttl > maxTTL)
                        loge("MapData.getRoundNotObs,maxTTL more than MAX:" + maxTTL);
                    //如果看是否能寻找到
                    if (this.getCircleNotObs(refPoint.x, refPoint.y, distance, refPoint))
                        break;
                    distance++;
                    circle++;
                    //不得超过10圈
                    if (circle > max_r)
                        break;
                }
            };
            /**
             * 获得圆形非路障点
             * @param xm 圆心x
             * @param ym 圆心y
             * @param r 半径
             * @param refResult 返回的点
             * @return
             *
             */
            MapAssetInfo.prototype.getCircleNotObs = function (xm, ym, r, refResult) {
                var x = -r;
                var y = 0;
                var err = 2 - 2 * r; /* II. Quadrant */
                var maxTTL = 20000;
                var ttl = 0;
                do {
                    ttl++;
                    if (ttl > maxTTL)
                        loge("MapData.getCircleNotObs,maxTTL more than MAX:" + maxTTL);
                    var hitX;
                    var hitY;
                    /*   I. Quadrant */
                    hitX = xm - x;
                    hitY = ym + y;
                    if (!this.isObstacle(hitX, hitY)) {
                        refResult.x = hitX;
                        refResult.y = hitY;
                        return true;
                    }
                    /*  II. Quadrant */
                    hitX = xm - y;
                    hitY = ym - x;
                    if (!this.isObstacle(hitX, hitY)) {
                        refResult.x = hitX;
                        refResult.y = hitY;
                        return true;
                    }
                    /* III. Quadrant */
                    hitX = xm + x;
                    hitY = ym - y;
                    if (!this.isObstacle(hitX, hitY)) {
                        refResult.x = hitX;
                        refResult.y = hitY;
                        return true;
                    }
                    /*  IV. Quadrant */
                    hitX = xm + y;
                    hitY = ym + x;
                    if (!this.isObstacle(hitX, hitY)) {
                        refResult.x = hitX;
                        refResult.y = hitY;
                        return true;
                    }
                    r = err;
                    if (r > x)
                        err += ++x * 2 + 1; /* e_xy+e_x > 0 */
                    if (r <= y)
                        err += ++y * 2 + 1; /* e_xy+e_y < 0 */
                } while (x < 0);
                return false;
            };
            /**
             * 是否可通过
             * @param curX 当前X轴
             * @param curY 当前Y轴
             * @param nextX 下一个X轴
             * @param nextY 下一个Y轴
             * @return 通过true，不通过为false
             */
            MapAssetInfo.prototype.isBlock = function (curX, curY, nextX, nextY) {
                if (nextX < 0 || nextY < 0)
                    return false;
                return !this.isObstacle(nextX, nextY);
            };
            // 是否障碍 
            MapAssetInfo.prototype.isObstacle = function (x, y) {
                return this.getMaskBit(x, y, this.obstacleMask, true);
            };
            // 是否半透明
            MapAssetInfo.prototype.isTran = function (x, y) {
                return this.getMaskBit(x, y, this.halfTranMask);
            };
            // 是否水倒影
            MapAssetInfo.prototype.isWater = function (x, y) {
                return this.getMaskBit(x, y, this.waterMask);
            };
            MapAssetInfo.prototype.getMaskBit = function (x, y, mask, def) {
                if (def === void 0) { def = false; }
                x = Math.floor(x);
                y = Math.floor(y);
                //地图边缘判断
                if (y < 0 || x < 0 || y >= this.logicHeight || x >= this.logicWidth || !mask)
                    return def;
                return mask.GetBit(y * this.logicWidth + x);
            };
            /**
             * 增加障碍区域，目前只支持一个障碍区域，今后有需求在考虑多个障碍区域
             * @param cx 区域中心点x 或者 圆的x点
             * @param cy 区域中心点y 或者 圆的y点
             * @param round 周围直线区域 或者圆的半径
             * @param isRect 是否为矩形，false则是原型
             * @return 返回路障区域对象指针
             *
             */
            MapAssetInfo.prototype.addObstacleRangle = function (cx, cy, round, isRect) {
                if (isRect === void 0) { isRect = true; }
                if (isRect) {
                    //矩形障碍
                    if (!this._obstacleRangle)
                        this._obstacleRangle = new Array();
                    var rect = new data_1.SRectangle(cx - round, cy - round, round * 2, round * 2);
                    this._obstacleRangle.push(rect);
                    return rect;
                }
                else {
                    //圆形障碍
                    if (!this._obstacleCircle)
                        this._obstacleCircle = new Array();
                    var circle = new data_1.Circle(cx, cy, round);
                    this._obstacleCircle.push(circle);
                    return circle;
                }
            };
            /**
             * 增加矩形障碍区域
             * @param ax
             * @param ay
             * @param aw
             * @param ah
             * @return 返回路障区域对象指针
             *
             */
            MapAssetInfo.prototype.addObstacleRangle1 = function (ax, ay, aw, ah) {
                if (!this._obstacleRangle)
                    this._obstacleRangle = new Array();
                var rect = new data_1.SRectangle(ax, ay, aw, ah);
                this._obstacleRangle.push(rect);
                return rect;
            };
            /**
             * 清楚障碍区域
             *
             */
            MapAssetInfo.prototype.removeObsRangle = function (obsPtr) {
                if (obsPtr === void 0) { obsPtr = null; }
                var idx = 0;
                if (!obsPtr) {
                    this._obstacleRangle = null;
                    this._obstacleCircle = null;
                }
                else if (obsPtr == data_1.SRectangle) {
                    if (!this._obstacleRangle)
                        return;
                    idx = this._obstacleRangle.indexOf(obsPtr);
                    if (idx >= 0)
                        this._obstacleRangle.splice(idx, 1);
                }
                else if (obsPtr == data_1.Circle) {
                    if (!this._obstacleCircle)
                        return;
                    idx = this._obstacleCircle.indexOf(obsPtr);
                    if (idx >= 0)
                        this._obstacleCircle.splice(idx, 1);
                }
                else {
                    loge("MapData:obsPtr Type is error");
                }
            };
            /**
             * 加上非路障
             * @param cx
             * @param cy
             * @param radius
             * @return
             *
             */
            MapAssetInfo.prototype.addNoObsCircle = function (cx, cy, radius) {
                //圆形障碍
                if (!this._noObsCircle)
                    this._noObsCircle = new Array();
                var circle = new data_1.Circle(cx, cy, radius);
                this._noObsCircle.push(circle);
                return circle;
            };
            /**
             * 清理非路障
             * @param ptr 指针
             * @return
             *
             */
            MapAssetInfo.prototype.removeNoObsCircle = function (ptr) {
                var idx;
                if (!ptr) {
                    this._noObsCircle = null;
                }
                else {
                    if (!this._noObsCircle)
                        return;
                    idx = this._noObsCircle.indexOf(ptr);
                    if (idx >= 0)
                        this._noObsCircle.splice(idx, 1);
                }
            };
            MapAssetInfo.prototype.clear = function () {
                // 地图ID
                this.id = 0;
                // 地图资源id
                this.imgId = 0;
                // 地图名称 
                this.name = '';
                // 地图创建日期 
                this.date = '';
                // 地图像素宽 
                this.pxWidth = 0;
                // 地图像素高 
                this.pxHeight = 0;
                // 地图瓷砖宽 
                this.floorWidth = 0;
                // 地图瓷砖高 
                this.floorHeight = 0;
                // 地图逻辑宽 
                this.logicWidth = 0;
                // 地图逻辑高 
                this.logicHeight = 0;
                // 是否副本 
                this.isInstance = 0;
                // 父级地图id
                this.parentID = 0;
                // 场景音乐
                this.sound = '';
                // 影子方向
                this.shadow = 0;
                // 副本人数
                this.count = 0;
                // 日限制 
                this.dayLimit = 0;
                // 周限制
                this.weekLimit = 0;
                // 副本类型
                this.instanceType = 0;
                // 天气类型
                this.weatherType = 0;
                // 障碍点 
                this.obstacleMask = null;
                // 半透明掩码 
                this.halfTranMask = null;
                // 水倒影掩码
                this.waterMask = null;
                // 寻路对象
                this.trukPath = null;
                // 所有生物 	
                this.creatures = null;
                // 远景层	
                this.farLayers = null;
                // 所有水层 	
                this.waters = null;
                /*障碍区域列表*/
                this._obstacleRangle = null;
                this._obstacleCircle = null;
                //非路障区域
                this._noObsCircle = null;
                //初始化完毕
                this.isInited = false;
            };
            // 影子左右拉伸值 
            MapAssetInfo.SHADOW_MATX_C = 0.4;
            // 影子上下高矮值
            MapAssetInfo.SHADOW_MATX_D = -0.4;
            // 影子整体偏移x 
            MapAssetInfo.SHADOW_MATX_OFFSETX = -2;
            // 影子整体偏移y 
            MapAssetInfo.SHADOW_MATX_OFFSETY = 0;
            // 影子透明度
            MapAssetInfo.SHADOW_ALPHA = 0.5;
            // 影子朝向 左边 
            MapAssetInfo.SHADOW_TOWARD_LEFT = 0;
            // 影子朝向 右边 	
            MapAssetInfo.SHADOW_TOWARD_RIGHT = 1;
            /**
             * 副本类型
             */
            MapAssetInfo.INSTANCE_TYPE_NONE = 0; //不是副本
            MapAssetInfo.INSTANCE_TYPE_ACTIVITY = 1; //活动副本
            MapAssetInfo.INSTANCE_TYPE_SINGLE = 2; //单人副本
            MapAssetInfo.INSTANCE_TYPE_FAMILY = 3; //家族副本
            MapAssetInfo.INSTANCE_TYPE_BATTle = 4; //家族战场
            return MapAssetInfo;
        }());
        data_1.MapAssetInfo = MapAssetInfo;
    })(data = game.data || (game.data = {}));
})(game || (game = {}));
//# sourceMappingURL=MapAseetInfo.js.map