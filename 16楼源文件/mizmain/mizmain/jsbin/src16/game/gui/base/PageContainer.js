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
* 页面容器
*/
var game;
(function (game) {
    var gui;
    (function (gui) {
        var base;
        (function (base) {
            var PageContainer = /** @class */ (function (_super) {
                __extends(PageContainer, _super);
                function PageContainer(app) {
                    var _this = _super.call(this, app) || this;
                    // 页面集合
                    _this._pages = {};
                    //鼠标能穿过层
                    _this.mouseThrough = true;
                    return _this;
                }
                // 打开页面
                PageContainer.prototype.open = function (key, onOpenFunc, onCloseFunc, createNew, prevView) {
                    var _this = this;
                    var page;
                    if (!createNew) {
                        page = this._pages[key];
                    }
                    if (!page) {
                        var pageClass = PageDef.getPageClass(key);
                        page = new pageClass(this._app, onOpenFunc, function () {
                            onCloseFunc && onCloseFunc(page);
                            delete _this._pages[key];
                        });
                        page.resize(this._clientWidth, this._clientHeight, false);
                        this._pages[key] = page;
                        this.addChild(page);
                        page.open(key, prevView);
                    }
                    else {
                        page.parent && page.parent.setChildIndex(page, page.parent.numChildren - 1);
                    }
                    // if(!page.isOpened){
                    // 	page.open();
                    // }
                    // else{
                    // 	//置顶
                    // 	if(page.parent)
                    // 		page.parent.setChildIndex(page,page.parent.numChildren - 1);
                    // }
                    return page;
                };
                // 获取页面
                PageContainer.prototype.getPage = function (key) {
                    return this._pages[key];
                };
                //界面是否打开
                PageContainer.prototype.isOpened = function (key) {
                    if (!this._pages[key])
                        return false;
                    return this._pages[key].isOpened;
                };
                //调下层级
                PageContainer.prototype.setPageIndex = function (page) {
                    page && page.parent && page.parent.setChildIndex(page, page.parent.numChildren - 1);
                };
                // 关闭页面
                PageContainer.prototype.close = function (key) {
                    var page = this._pages[key];
                    if (page) {
                        page.close();
                    }
                };
                // 关闭所有页面
                PageContainer.prototype.closeAll = function (ignore) {
                    for (var key in this._pages) {
                        if (ignore && ignore.indexOf(Number(key)) != -1) {
                            continue;
                        }
                        this.close(Number(key));
                    }
                };
                //获取最上页面的key
                PageContainer.prototype.getTopKey = function () {
                    if (this.numChildren) {
                        var top_1 = this.getChildAt(this.numChildren - 1);
                        if (top_1) {
                            for (var key in this._pages) {
                                if (this._pages[key] == top_1)
                                    return key;
                            }
                        }
                    }
                };
                // 发生断线重连
                PageContainer.prototype.onReconnect = function () {
                    for (var key in this._pages) {
                        var page_1 = this._pages[key];
                        page_1.onReconnect();
                    }
                };
                // 确认函数
                PageContainer.prototype.enter = function () {
                    if (this.numChildren) {
                        var top_2 = this.getChildAt(this.numChildren - 1);
                        if (top_2) {
                            return top_2.enter();
                        }
                    }
                    return false;
                };
                // 取消函数
                PageContainer.prototype.cancel = function () {
                    if (this.numChildren) {
                        var topPage = this.getChildAt(this.numChildren - 1);
                        if (topPage instanceof base.Page && !topPage.isModal) { //并且不是模态窗
                            return topPage.cancel();
                        }
                    }
                    return false;
                };
                PageContainer.prototype.resize = function (w, h) {
                    _super.prototype.resize.call(this, w, h);
                    for (var key in this._pages) {
                        var page_2 = this._pages[key];
                        if (page_2) {
                            page_2.resize(w, h);
                        }
                    }
                };
                // 释放函数
                PageContainer.prototype.dispose = function () {
                    this.closeAll();
                    this._pages = null;
                    _super.prototype.dispose.call(this);
                };
                return PageContainer;
            }(base.Container));
            base.PageContainer = PageContainer;
        })(base = gui.base || (gui.base = {}));
    })(gui = game.gui || (game.gui = {}));
})(game || (game = {}));
//# sourceMappingURL=PageContainer.js.map