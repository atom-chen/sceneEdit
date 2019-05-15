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
var game;
(function (game) {
    var modules;
    (function (modules) {
        var pet;
        (function (pet) {
            /** 宠物培养 */
            var PetPeiYangMediator = /** @class */ (function (_super) {
                __extends(PetPeiYangMediator, _super);
                function PetPeiYangMediator(uiLayaer) {
                    var _this = _super.call(this, uiLayaer) || this;
                    /**培养道具编号*/
                    _this.itemid = [];
                    /**宠物品质框*/
                    _this.colour = ["lvkuang.png", "lankuang.png", "zikuang.png", "jinkuang.png"];
                    /**宠物种类*/
                    _this.kind = ["common/ui/pet/chongwu_yesheng.png", "common/ui/pet/chongwu_bb.png",
                        "common/ui/pet/chongwu_bianyi.png", "common/ui/pet/baobaolingshou.png",
                        "common/ui/pet/bianyilingshou.png", "common/ui/pet/chongwu_shenshou.png"];
                    /**道具剩余数量*/
                    _this.itemcount = [0, 0, 0, 0, 0, 0, 0, 0];
                    _this._viewUI = new ui.common.PetProperPeiYangUI();
                    _this._viewUI.mouseThrough = true;
                    _this.isCenter = false;
                    _this.uiLayer = uiLayaer;
                    _this.model = new ModelsCreate();
                    _this.ani = new Laya.Animation();
                    _this.scene2DPanel = new TestRole2dPanel();
                    _this._viewUI.pet_img.addChild(_this.scene2DPanel);
                    _this._viewUI.itemicon_img.on(LEvent.MOUSE_DOWN, _this, _this.itemtips);
                    _this._viewUI.petjibie_img.on(LEvent.MOUSE_DOWN, _this, _this.showdata, [11814]);
                    _this._viewUI.lab_box.on(LEvent.MOUSE_DOWN, _this, _this.showdata, [11813]);
                    _this._viewUI.on(LEvent.MOUSE_UP, _this, _this.hidedata);
                    _this._viewUI.on(LEvent.MOUSE_OUT, _this, _this.hidedata);
                    return _this;
                }
                PetPeiYangMediator.prototype.show = function () {
                    _super.prototype.show.call(this);
                    this.texttips = new game.modules.commonUI.TextTipsMediator(this._app);
                    var parentui = this._viewUI.parent;
                    this.scene2DPanel.ape.x = parentui.x * parentui.globalScaleX;
                    this.scene2DPanel.ape.y = parentui.y * parentui.globalScaleY;
                    this.tips = new game.modules.commonUI.DisappearMessageTipsMediator(this._app);
                    this.remind = new game.modules.commonUI.RemindViewMediator(this.uiLayer, this._app);
                    this._buy = new game.modules.commonUI.BuyKuaiJieMediator(this._app);
                    this.click();
                    this.init();
                    pet.models.PetProxy.getInstance().on(pet.models.REFRESH_EVENT, this, this.refresh);
                    pet.models.PetProxy.getInstance().on(pet.models.REFRESHSHOUMING_EVENT, this, this.refresh);
                    game.modules.shop.models.ShopProxy._instance.on(game.modules.shop.models.Go_Charge, this, this.hidePet);
                };
                /**显示tips*/
                PetPeiYangMediator.prototype.showdata = function (textid) {
                    var chattext = game.modules.tips.models.TipsModel._instance.cstringResConfigData[textid];
                    this.texttips.init(chattext.msg, this._viewUI.mouseX, this._viewUI.mouseY);
                };
                /**隐藏tips*/
                PetPeiYangMediator.prototype.hidedata = function () {
                    if (this.texttips) { //是否有该tips
                        this.texttips.hide();
                    }
                };
                /**隐藏宠物界面*/
                PetPeiYangMediator.prototype.hidePet = function () {
                    modules.ModuleManager.hide(modules.ModuleNames.PET);
                    game.modules.createrole.models.LoginModel.getInstance().CommonPage = "pet";
                };
                /**模型创建*/
                PetPeiYangMediator.prototype.modelcreate = function (modelid) {
                    var parentui = this._viewUI.parent;
                    if (parentui) { //是否拥有父节点
                        if (this.model.role3d) {
                            this.scene2DPanel.removeSceneChar(this.model.role3d);
                        }
                        this.model.role3d = new YxChar3d();
                        this.model.role3d.setRoleUrl(getRoleUrl(modelid + ""));
                        this.model.role3d.set2dPos((this._viewUI.pet_img.x + this._viewUI.pet_img.width / 2) * parentui.globalScaleX * 1.17, (this._viewUI.pet_img.y + this._viewUI.pet_img.height) * parentui.globalScaleY * 1.17); //坐标
                        this.model.role3d.scale = 1;
                        this.model.role3d.rotationX = 0;
                        this.model.role3d.rotationY = 135;
                        this.scene2DPanel.addSceneChar(this.model.role3d);
                    }
                };
                /**初始化数据*/
                PetPeiYangMediator.prototype.init = function () {
                    var data1 = [];
                    var itemdata = [];
                    var bag = BagModel.getInstance().bagMap[1]; //背包获取道具信息
                    for (var index = 0; index < 8; index++) {
                        var feedcount = 0;
                        var PetFeeditemlist = PetModel.getInstance().petCPetFeedItemListData[index + 1];
                        this.itemid[index] = PetFeeditemlist.itemid;
                        for (var indexs = 0; indexs < bag.items.length; indexs++) {
                            var items = bag.items[indexs];
                            if (items.id == PetFeeditemlist.itemid) { //是否有该道具ID
                                feedcount = items.number;
                                this.itemcount[index] = feedcount;
                                break;
                            }
                            else {
                                this.itemcount[index] = 0;
                            }
                        }
                        if (bag.items.length <= 0) {
                            this.itemcount[index] = 0;
                        }
                        var item = BagModel.getInstance().itemAttrData[PetFeeditemlist.itemid];
                        itemdata.push({ itemnum_lab: feedcount, item_img: "common/icon/item/" + item.icon + ".png", itemkuang_img: "common/ui/tongyong/" + this.colour[item.nquality - 2] });
                    }
                    var itemname = BagModel.getInstance().itemAttrData[this.itemid[this._viewUI.item_list.selectedIndex]];
                    this._viewUI.item_lab.changeText(itemname.name);
                    this._viewUI.tisheng_lab.text = 50000 + "";
                    this._viewUI.item_list.array = itemdata;
                    this._viewUI.item_list.repeatX = 4;
                    this._viewUI.item_list.repeatY = 2;
                    this._viewUI.item_list.vScrollBarSkin = "";
                    this._viewUI.item_list.scrollBar.elasticBackTime = 200;
                    this._viewUI.item_list.scrollBar.elasticDistance = 100;
                    this._viewUI.itemicon_img.skin = "common/icon/item/" + itemname.icon + ".png";
                    this._viewUI.itemkuang_img.skin = "common/ui/tongyong/" + this.colour[itemname.nquality - 2];
                    this.initpet();
                    this.initdata();
                };
                /**初始化宠物数据*/
                PetPeiYangMediator.prototype.initdata = function () {
                    var petdata = PetModel.getInstance().petbasedata;
                    var allpetbase = PetModel._instance.petCPetAttrData[petdata.id];
                    var petCPetAttrBaseVo = PetModel.getInstance().petCPetAttrData[PetModel.getInstance().petbasedata.id];
                    this.modelcreate(allpetbase.modelid);
                    this._viewUI.LV_lab.text = petdata.level + "";
                    this._viewUI.jingyan_lab.text = petdata.exp + "/" + petdata.nexp;
                    if (this._viewUI.jingyan_lab.text.length * 14 > 89) { //根据经验label的长度缩放比例
                        this._viewUI.jingyan_lab.fontSize = 89 / (this._viewUI.jingyan_lab.text.length * 14) * 25;
                    }
                    else {
                        this._viewUI.jingyan_lab.fontSize = 25;
                    }
                    this._viewUI.chengzhang_lab.text = (petdata.growrate * 0.001).toString();
                    this._viewUI.petscore_lab.text = petdata.petscore + "";
                    this._viewUI.petname_lab.text = petdata.name;
                    this._viewUI.petname_lab.color = "#" + petCPetAttrBaseVo.colour; //洗练界面
                    if (allpetbase.unusualid == 2) { //是否为神兽 2为神兽 1为稀有
                        this._viewUI.shouming_lab.text = "永生";
                    }
                    else {
                        this._viewUI.shouming_lab.text = petdata.life + "";
                    }
                    if (allpetbase.unusualid == 1) //是否为稀有
                        this._viewUI.petjibie_img.skin = this.kind[PetModel.getInstance().petbasedata.kind + allpetbase.unusualid];
                    else
                        this._viewUI.petjibie_img.skin = this.kind[PetModel.getInstance().petbasedata.kind + allpetbase.unusualid - 1];
                    this.refreshcount();
                };
                /**按钮响应事件*/
                PetPeiYangMediator.prototype.click = function () {
                    this._viewUI.useone_btn.clickHandler = new Laya.Handler(this, this.useitem, [1]);
                    this._viewUI.useten_btn.clickHandler = new Laya.Handler(this, this.useitem, [10]);
                    this._viewUI.use_btn.clickHandler = new Laya.Handler(this, this.useitem, [1]);
                    this._viewUI.item_list.renderHandler = new Laya.Handler(this, this.initselect);
                };
                PetPeiYangMediator.prototype.hide = function () {
                    this.model.modeldelt();
                    this.hidedata();
                    game.modules.bag.models.BagProxy.getInstance().off(game.modules.bag.models.REFRESH_BAG_DEPOT_COUNT, this, this.init);
                    _super.prototype.hide.call(this);
                };
                PetPeiYangMediator.prototype.getView = function () {
                    return this._viewUI;
                };
                /**初始化宠物列表*/
                PetPeiYangMediator.prototype.initpet = function () {
                    var data = [];
                    var score = "";
                    var lock = "";
                    for (var index in PetModel.getInstance().pets.keys) {
                        var petinfo = PetModel._instance.pets.get(PetModel._instance.pets.keys[index]);
                        var allpetbase = PetModel.getInstance().petCPetAttrData[petinfo.id];
                        var icondata = LoginModel.getInstance().cnpcShapeInfo[allpetbase.modelid];
                        if (petinfo.petscore >= allpetbase.treasureScore) //是否为珍品
                            score = "common/ui/tongyong/zhenpin.png";
                        else
                            score = "";
                        /** 是否上锁 */
                        if (petinfo.flag == 2)
                            lock = "common/ui/tongyong/suo.png";
                        else
                            lock = "";
                        if (parseInt(index) == PetModel.getInstance().currentselect) { //是否为当前选择
                            if (PetModel._instance.pets.keys[index] == LoginModel.getInstance().roleDetail.petIndex) { //是否为出战宠物
                                if (petinfo.kind == 1) //是否为野生
                                    data.push({ petnames_lab: petinfo.name, petadd_lab: "", petlv_lab: "LV." + petinfo.level, chuzhan_img: "common/ui/pet/chongwu_zhan.png", petizhenpin_img: score, peticon_img: "common/icon/avatarpet/" + icondata.littleheadID + ".png", petkuang_img: "common/ui/tongyong/" + this.colour[allpetbase.quality - 2], lockimg_img: lock });
                                else {
                                    data.push({ petnames_lab: petinfo.name, petadd_lab: "", petlv_lab: "LV." + petinfo.level, chuzhan_img: "common/ui/pet/chongwu_zhan.png", petizhenpin_img: score, peticon_img: "common/icon/avatarpet/" + icondata.littleheadID + ".png", petkuang_img: "common/ui/tongyong/" + this.colour[allpetbase.quality - 2], lockimg_img: lock });
                                }
                            }
                            else {
                                data.push({ petnames_lab: petinfo.name, petadd_lab: "", petlv_lab: "LV." + petinfo.level, chuzhan_img: "", petizhenpin_img: score, peticon_img: "common/icon/avatarpet/" + icondata.littleheadID + ".png", petkuang_img: "common/ui/tongyong/" + this.colour[allpetbase.quality - 2], lockimg_img: lock });
                            }
                            PetModel.getInstance().petbasedata = petinfo;
                            PetModel.getInstance().petinitfight = petinfo.initbfp;
                            PetModel.getInstance().petbasicfight = petinfo.bfp;
                            PetModel.getInstance().petskill = petinfo.skills;
                        }
                        else {
                            if (PetModel._instance.pets.keys[index] == LoginModel.getInstance().roleDetail.petIndex) //是否为出战宠物
                                data.push({ petnames_lab: petinfo.name, petadd_lab: "", petlv_lab: "LV." + petinfo.level, chuzhan_img: "common/ui/pet/chongwu_zhan.png", petizhenpin_img: score, peticon_img: "common/icon/avatarpet/" + icondata.littleheadID + ".png", petkuang_img: "common/ui/tongyong/" + this.colour[allpetbase.quality - 2], lockimg_img: lock });
                            else
                                data.push({ petnames_lab: petinfo.name, petadd_lab: "", petlv_lab: "LV." + petinfo.level, chuzhan_img: "", petizhenpin_img: score, peticon_img: "common/icon/avatarpet/" + icondata.littleheadID + ".png", petkuang_img: "common/ui/tongyong/" + this.colour[allpetbase.quality - 2], lockimg_img: lock });
                        }
                    }
                    if (game.modules.createrole.models.LoginModel.getInstance().roleDetail.petmaxnum > PetModel.getInstance().pets.keys.length) { //最大拥有数是否大于已拥有数
                        data.push({ petnames_lab: "", petlv_lab: "", chuzhan_img: "", petadd_lab: "添加宠物", petizhenpin_img: "", petkuang_img: "common/ui/tongyong/kuang94.png", peticon_img: "common/ui/pet/chongwu_jiahao.png", lockimg_img: "" });
                    }
                    this._viewUI.pet_list.array = data;
                    this._viewUI.pet_list.vScrollBarSkin = "";
                    this._viewUI.pet_list.repeatY = data.length;
                    this._viewUI.pet_list.scrollBar.elasticBackTime = 200;
                    this._viewUI.pet_list.scrollBar.elasticDistance = 100;
                    this._viewUI.pet_list.renderHandler = new Laya.Handler(this, this.initpetselect);
                    this.refreshcount();
                };
                /**初始化宠物选择响应事件*/
                PetPeiYangMediator.prototype.initpetselect = function (cell, index) {
                    var btn = cell.getChildByName("select_btn");
                    if (index == PetModel.getInstance().currentselect) { //是否为当前选择
                        if (this.lastbox) { //是否已经多次选择
                            var lastbtn = this.lastbox.getChildByName("select_btn");
                            lastbtn.selected = false;
                        }
                        btn.selected = true;
                        this.lastbox = cell;
                    }
                    else if (PetModel.getInstance().currentselect) {
                        var otherBtn = cell.getChildByName("select_btn");
                        otherBtn.selected = false;
                    }
                    btn.on(LEvent.CLICK, this, this.petselect, [cell, index]);
                };
                /**宠物选择*/
                PetPeiYangMediator.prototype.petselect = function (cell, index) {
                    //添加宠物
                    var lastbtn = this.lastbox.getChildByName("select_btn");
                    lastbtn.selected = false;
                    var btn = cell.getChildByName("select_btn");
                    btn.selected = true;
                    PetModel.getInstance().currentselect = index;
                    if (index > PetModel.getInstance().pets.keys.length - 1) { //点击的位置是否大于已拥有的宠物长度
                        game.modules.createrole.models.LoginModel.getInstance().CommonPage = modules.ModuleNames.PET;
                        game.modules.pet.models.PetProxy.getInstance().on(game.modules.pet.models.ADD_EVENT, this, this.addpet);
                        game.modules.pet.models.PetModel.getInstance().tabnum = 2;
                        this.petshop = new game.modules.commonUI.PetShopMediator(this._app);
                        this.petshop.init();
                        modules.ModuleManager.hide(modules.ModuleNames.PET);
                        return;
                    }
                    for (var num in PetModel.getInstance().pets.keys) {
                        if (parseInt(num) == index) { //是否是当前选择
                            var data_1 = PetModel.getInstance().pets.get(PetModel.getInstance().pets.keys[num]);
                            PetModel.getInstance().petbasedata = data_1;
                            PetModel.getInstance().petinitfight = data_1.initbfp;
                            PetModel.getInstance().petbasicfight = data_1.bfp;
                            PetModel.getInstance().petskill = data_1.skills;
                            this.initdata();
                        }
                    }
                };
                /**初始化控件响应*/
                PetPeiYangMediator.prototype.initselect = function (cell, index) {
                    var img = cell.getChildByName("item_img");
                    img.on(LEvent.CLICK, this, this.selectlist, [cell, index]);
                    if (index == this._viewUI.item_list.selectedIndex) {
                        if (this.ani) {
                            this.ani.clear();
                        }
                        this.ani.loadAtlas("common/res/atlas/ui/tuji.atlas", Laya.Handler.create(this, this.onload));
                        this.ani.scaleX = 0.96;
                        this.ani.scaleY = 0.96;
                        var imgs = cell.getChildByName("itemkuang_img");
                        imgs.addChild(this.ani);
                    }
                };
                /**选择使用道具*/
                PetPeiYangMediator.prototype.selectlist = function (cell, index) {
                    var itemname = BagModel.getInstance().itemAttrData[this.itemid[index]];
                    this._viewUI.item_lab.changeText(itemname.name);
                    var itemeffect = PetModel._instance.petCPetFeedItemAttrData[this.itemid[index]];
                    var itemeffect1 = SaleModel.getInstance().foodAndDrugFormulaData[this.itemid[index]];
                    var itemicon = BagModel.getInstance().itemAttrData[this.itemid[index]];
                    this._viewUI.itemicon_img.skin = "common/icon/item/" + itemname.icon + ".png";
                    this._viewUI.itemkuang_img.skin = "common/ui/tongyong/" + this.colour[itemname.nquality - 2];
                    switch (index) { //选择使用的道具 0-3为第一排 4-7为第二排
                        case 0:
                            this._viewUI.use_btn.visible = false;
                            this._viewUI.useone_btn.visible = true;
                            this._viewUI.useten_btn.visible = true;
                            this._viewUI.jingyan_box.visible = true;
                            this._viewUI.chengzhang_box.visible = false;
                            this._viewUI.shouming_box.visible = false;
                            this._viewUI.zizhitisheng_box.visible = false;
                            this._viewUI.miaoshu_box.visible = false;
                            this._viewUI.tisheng_lab.text = itemeffect.addpetexp + "";
                            break;
                        case 1:
                            this._viewUI.use_btn.visible = false;
                            this._viewUI.useone_btn.visible = true;
                            this._viewUI.useten_btn.visible = true;
                            this._viewUI.jingyan_box.visible = true;
                            this._viewUI.chengzhang_box.visible = false;
                            this._viewUI.shouming_box.visible = false;
                            this._viewUI.zizhitisheng_box.visible = false;
                            this._viewUI.miaoshu_box.visible = false;
                            this._viewUI.tisheng_lab.text = itemeffect.addpetexp + "";
                            break;
                        case 2:
                            this._viewUI.use_btn.visible = true;
                            this._viewUI.useone_btn.visible = false;
                            this._viewUI.useten_btn.visible = false;
                            this._viewUI.jingyan_box.visible = false;
                            this._viewUI.chengzhang_box.visible = false;
                            this._viewUI.shouming_box.visible = false;
                            this._viewUI.zizhitisheng_box.visible = true;
                            this._viewUI.miaoshu_box.visible = false;
                            break;
                        case 3:
                            this._viewUI.use_btn.visible = true;
                            this._viewUI.useone_btn.visible = false;
                            this._viewUI.useten_btn.visible = false;
                            this._viewUI.jingyan_box.visible = false;
                            this._viewUI.chengzhang_box.visible = true;
                            this._viewUI.shouming_box.visible = false;
                            this._viewUI.zizhitisheng_box.visible = false;
                            this._viewUI.miaoshu_box.visible = false;
                            break;
                        case 4:
                            this._viewUI.use_btn.visible = true;
                            this._viewUI.useone_btn.visible = false;
                            this._viewUI.useten_btn.visible = false;
                            this._viewUI.jingyan_box.visible = false;
                            this._viewUI.chengzhang_box.visible = false;
                            this._viewUI.shouming_box.visible = true;
                            this._viewUI.zizhitisheng_box.visible = false;
                            this._viewUI.miaoshu_box.visible = false;
                            this._viewUI.tisheng2_lab.text = itemeffect.addpetlife + "";
                            break;
                        case 5:
                            this._viewUI.use_btn.visible = true;
                            this._viewUI.useone_btn.visible = false;
                            this._viewUI.useten_btn.visible = false;
                            this._viewUI.jingyan_box.visible = false;
                            this._viewUI.chengzhang_box.visible = false;
                            this._viewUI.shouming_box.visible = true;
                            this._viewUI.zizhitisheng_box.visible = false;
                            this._viewUI.miaoshu_box.visible = false;
                            this.showImproveQuality(this._viewUI.tisheng2_lab, itemeffect1.strformula);
                            break;
                        case 6:
                            this._viewUI.use_btn.visible = true;
                            this._viewUI.useone_btn.visible = false;
                            this._viewUI.useten_btn.visible = false;
                            this._viewUI.jingyan_box.visible = false;
                            this._viewUI.chengzhang_box.visible = false;
                            this._viewUI.shouming_box.visible = true;
                            this._viewUI.zizhitisheng_box.visible = false;
                            this._viewUI.miaoshu_box.visible = false;
                            this.showImproveQuality(this._viewUI.tisheng2_lab, itemeffect1.strformula);
                            break;
                        case 7:
                            this._viewUI.use_btn.visible = true;
                            this._viewUI.useone_btn.visible = false;
                            this._viewUI.useten_btn.visible = false;
                            this._viewUI.jingyan_box.visible = false;
                            this._viewUI.chengzhang_box.visible = false;
                            this._viewUI.shouming_box.visible = false;
                            this._viewUI.zizhitisheng_box.visible = false;
                            this._viewUI.miaoshu_box.visible = true;
                            break;
                        default:
                            break;
                    }
                };
                /** 处理在Laber显示提升品质文本内容 */
                PetPeiYangMediator.prototype.showImproveQuality = function (lab, text) {
                    lab.text = text;
                };
                /**刷新道具数量*/
                PetPeiYangMediator.prototype.refreshcount = function () {
                    this._viewUI.shengyucishu1_lab.text = 10 - PetModel._instance.petbasedata.aptaddcount + ""; //剩余培养资质的次数
                    this._viewUI.shengyucishu_lab.text = 5 - PetModel._instance.petbasedata.growrateaddcount + ""; //剩余培养成长的次数
                    var petdata = PetModel.getInstance().petbasedata;
                    var growgrate = petdata.growrate;
                    var allpetbase = PetModel.getInstance().petCPetAttrData[petdata.id];
                    if (growgrate == allpetbase.growrate[6]) { //是否满成长
                        this._viewUI.tisheng1_lab.visible = false;
                        this._viewUI.tisheng12_lab.text = 0 + "";
                        this._viewUI.tisheng13_lab.visible = false;
                    }
                    else {
                        var low = ((allpetbase.growrate[6] / 1000 - growgrate / 1000) * 0.05 + 0.0005).toFixed(3); //最低成长 公式 宠物的最高成长减去当前宠物成长*0.05 除以1000是为了方便加上0.0005 然后取小数点三位
                        var up = ((allpetbase.growrate[6] / 1000 - growgrate / 1000) * 0.1 + 0.0005).toFixed(3); //最高成长 宠物的最高成长减去当前宠物成长*0.01
                        this._viewUI.tisheng1_lab.text = low;
                        this._viewUI.tisheng1_lab.visible = true;
                        this._viewUI.tisheng12_lab.text = "-";
                        this._viewUI.tisheng13_lab.text = up;
                        this._viewUI.tisheng13_lab.visible = true;
                    }
                };
                /**使用物品*/
                PetPeiYangMediator.prototype.useitem = function (usenum) {
                    var bag = BagModel.getInstance().bagMap[1];
                    var petdata = game.modules.pet.models.PetModel.getInstance().petbasedata;
                    var allpetbase = game.modules.pet.models.PetModel.getInstance().petCPetAttrData[petdata.id];
                    // if (this.itemcount[this._viewUI.item_list.selectedIndex] != 0 && this.itemcount[this._viewUI.item_list.selectedIndex] >= usenum) {//使用的数量是否大于拥有的数量
                    if (this.itemcount[this._viewUI.item_list.selectedIndex] != 0) { //使用的数量是否大于拥有的数量
                        usenum = this.itemcount[this._viewUI.item_list.selectedIndex] > 10 ? 10 : this.itemcount[this._viewUI.item_list.selectedIndex];
                        if (this._viewUI.item_list.selectedIndex == 0 || this._viewUI.item_list.selectedIndex == 1) { //选择哪个道具 0 1为经验道具
                            if (petdata.level >= HudModel._instance.levelNum + 10) {
                                var goodsid = this.itemid[this._viewUI.item_list.selectedIndex]; // 使用物品id
                                var goodsName = BagModel.getInstance().itemAttrData[goodsid].name; // 使用物品名字
                                var petArrylevel = [petdata.name, goodsName]; // 宠物名字 和 物品名字
                                var prompt_1 = HudModel.getInstance().promptAssembleBack(150070, petArrylevel);
                                var disappearMsgTips = new game.modules.commonUI.DisappearMessageTipsMediator(this._app);
                                disappearMsgTips.onShow(prompt_1);
                            }
                            RequesterProtocols._instance.c2s_pet_expcultivate(PetModel.getInstance().petbasedata.key, this.itemid[this._viewUI.item_list.selectedIndex], usenum);
                        }
                        else if (this._viewUI.item_list.selectedIndex == 2) { //2为资质道具
                            if (petdata.aptaddcount == 10) { //使用次数是否大于10
                                var arr = [];
                                arr.push(petdata.name);
                                var str = game.modules.mainhud.models.HudModel.getInstance().promptAssembleBack(150071, arr);
                                this.tips.onShow(str);
                                return;
                            }
                            this._selectzizhi = new pet.PetSelcetZiZhiMediator(this._app);
                            this._selectzizhi.show();
                        }
                        else if (this._viewUI.item_list.selectedIndex == 3) { //3为成长道具
                            var item = game.modules.bag.models.BagModel.getInstance().itemAttrData[109003];
                            var arr = [];
                            arr.push(petdata.name);
                            arr.push(item.name);
                            if (petdata.growrateaddcount == 5) { //无法使用道具						
                                var str = game.modules.mainhud.models.HudModel.getInstance().promptAssembleBack(150072, arr);
                                this.tips.onShow(str);
                                return;
                            }
                            if (petdata.growrate == allpetbase.growrate[6]) { //宠物成长满				
                                var str = game.modules.mainhud.models.HudModel.getInstance().promptAssembleBack(150073, arr);
                                this.tips.onShow(str);
                                return;
                            }
                            for (var index = 0; index < bag.items.length; index++) {
                                if (bag.items[index].id == 109003) { //是否拥有该道具
                                    RequesterProtocols._instance.c2s_CAppend_Item(bag.items[index].key, 1, PetModel.getInstance().petbasedata.key);
                                    break;
                                }
                            }
                        }
                        else if (this._viewUI.item_list.selectedIndex == 4) { //4为寿命增加道具
                            var chattext = game.modules.tips.models.TipsModel._instance.cstringResConfigData[11548];
                            if (this._viewUI.shouming_lab.text == chattext.msg) { //是否为永生
                                var chattext_1 = game.modules.chat.models.ChatModel.getInstance().chatMessageTips[162131];
                                this.tips.onShow(chattext_1.msg);
                                return;
                            }
                            for (var index = 0; index < bag.items.length; index++) {
                                if (bag.items[index].id == 109006) { //是否拥有该道具
                                    RequesterProtocols._instance.c2s_CAppend_Item(bag.items[index].key, 1, PetModel.getInstance().petbasedata.key);
                                    RequesterProtocols._instance.c2s_show_petinfo(LoginModel.getInstance().roleDetail.roleid);
                                    RequesterProtocols._instance.c2s_CAppend_Item(bag.items[index].key, 1, PetModel.getInstance().petbasedata.key);
                                    break;
                                }
                            }
                        }
                        else if (this._viewUI.item_list.selectedIndex == 5) { //5为寿命增加道具
                            for (var index = 0; index < bag.items.length; index++) {
                                if (bag.items[index].id == 111007) { //是否拥有该道具
                                    RequesterProtocols._instance.c2s_CAppend_Item(bag.items[index].key, 1, PetModel.getInstance().petbasedata.key);
                                    break;
                                }
                            }
                        }
                        else if (this._viewUI.item_list.selectedIndex == 6) { //6为寿命增加道具
                            for (var index = 0; index < bag.items.length; index++) {
                                if (bag.items[index].id == 111010) { //是否拥有该道具
                                    RequesterProtocols._instance.c2s_CAppend_Item(bag.items[index].key, 1, PetModel.getInstance().petbasedata.key);
                                    break;
                                }
                            }
                        }
                        else if (this._viewUI.item_list.selectedIndex == 7) { //7为重生药水
                            for (var index = 0; index < bag.items.length; index++) {
                                if (bag.items[index].id == 109007) { //是否拥有该道具
                                    var text = game.modules.tips.models.TipsModel._instance.cstringResConfigData[1556];
                                    var info = game.modules.tips.models.TipsModel._instance.cstringResConfigData[11830];
                                    this.remind.onShow(info.msg, text.msg);
                                    this.remind.once(modules.commonUI.RIGHT_BUTTON_EVENT, this, this.clickEnSureBtnEvent, [PetModel.getInstance().petbasedata.key, bag.items[index].key]);
                                    this.remind.once(modules.commonUI.LEFT_BUTTON_EVENT, this, this.cancel);
                                    break;
                                }
                            }
                        }
                    }
                    else { //数量不足，跳转至快捷购买
                        game.modules.bag.models.BagProxy.getInstance().on(game.modules.bag.models.REFRESH_BAG_DEPOT_COUNT, this, this.init);
                        var quickbase = PetModel.getInstance().cQuickBuyData[this.itemid[this._viewUI.item_list.selectedIndex]];
                        if (quickbase == null) { //不存在快捷购买表中,出提示
                            if (petdata.life == -1) { //-1为永生
                                var chattext = game.modules.chat.models.ChatModel.getInstance().chatMessageTips[162131];
                                this.tips.onShow(chattext.msg);
                            }
                            else {
                                var chattext = game.modules.chat.models.ChatModel.getInstance().chatMessageTips[150058];
                                this.tips.onShow(chattext.msg);
                            }
                            return;
                        }
                        if (quickbase.buytype == 2) { //快捷购买类型 2为商店购买
                            var goodsinfo = game.modules.shop.models.ShopModel.getInstance().goodslimitsBinDic.get(quickbase.goodsid);
                            var cGoodsData = ShopModel.getInstance().GoodsBinDic[quickbase.goodsid];
                            if (goodsinfo >= cGoodsData.limitNum) { //是否超过购买限制					
                                ShopModel.getInstance().itemId = quickbase.id;
                                modules.ModuleManager.show(modules.ModuleNames.SHOP, this._app);
                                LoginModel.getInstance().CommonPage = modules.ModuleNames.PET;
                                PetModel.getInstance().tabnum = 2;
                                modules.ModuleManager.hide(modules.ModuleNames.PET);
                            }
                            else {
                                RequesterProtocols._instance.c2s_requst_shopprice(5);
                                this._buy.init(quickbase.goodsid);
                            }
                        }
                        else if (quickbase.buytype == 1) { //可直接快捷购买
                            this._buy.init(quickbase.goodsid);
                        }
                        else if (quickbase.buytype == 3) { //拍卖购买
                            //拍卖					
                            if (petdata.life == -1) { //判断是否是永生的
                                var chattext = game.modules.tips.models.TipsModel._instance.cstringResConfigData[11548];
                                if (this._viewUI.shouming_lab.text == chattext.msg) { //判断是否是永生的
                                    var chattext_2 = game.modules.chat.models.ChatModel.getInstance().chatMessageTips[162131];
                                    this.tips.onShow(chattext_2.msg);
                                    return;
                                }
                            }
                            else {
                                modules.sale.models.SaleModel.getInstance().saleTargetId = this.itemid[this._viewUI.item_list.selectedIndex];
                                game.modules.createrole.models.LoginModel.getInstance().CommonPage = modules.ModuleNames.PET;
                                game.modules.pet.models.PetModel.getInstance().tabnum = 2;
                                modules.ModuleManager.hide(modules.ModuleNames.PET);
                                modules.ModuleManager.show(modules.ModuleNames.SALE, this._app);
                            }
                        }
                    }
                };
                /**使用道具*/
                PetPeiYangMediator.prototype.clickEnSureBtnEvent = function (petkey, itemkey) {
                    this.remind.off(modules.commonUI.LEFT_BUTTON_EVENT, this, this.cancel);
                    RequesterProtocols._instance.c2s_pet_levelreset(petkey, itemkey);
                };
                /**取消使用*/
                PetPeiYangMediator.prototype.cancel = function () {
                    this.remind.off(modules.commonUI.RIGHT_BUTTON_EVENT, this, this.clickEnSureBtnEvent);
                };
                /**刷新数据*/
                PetPeiYangMediator.prototype.refresh = function (e) {
                    this.init();
                };
                /**增加宠物*/
                PetPeiYangMediator.prototype.addpet = function () {
                    this.initpet();
                    game.modules.pet.models.PetProxy.getInstance().off(game.modules.pet.models.ADD_EVENT, this, this.addpet);
                };
                /**道具TIPS*/
                PetPeiYangMediator.prototype.itemtips = function () {
                    var parame = new Dictionary();
                    parame.set("itemId", this.itemid[this._viewUI.item_list.selectedIndex]);
                    this._tipsModule = new game.modules.tips.tipsModule(this._viewUI, this._app, TIPS_TYPE.BAG, parame);
                };
                /**特效*/
                PetPeiYangMediator.prototype.onload = function () {
                    Laya.Animation.createFrames(this.anUrls("xuanzhong", 9), "xuanzhong");
                    this.ani.play(0, true, "xuanzhong");
                    this.ani.interval = 112;
                };
                /**特效路径*/
                PetPeiYangMediator.prototype.anUrls = function (aniName, length) {
                    var urls = [];
                    for (var index = 1; index <= length; index++) {
                        urls.push("common/ui/tuji/" + aniName + index + ".png");
                    }
                    return urls;
                };
                return PetPeiYangMediator;
            }(game.modules.UiMediator));
            pet.PetPeiYangMediator = PetPeiYangMediator;
        })(pet = modules.pet || (modules.pet = {}));
    })(modules = game.modules || (game.modules = {}));
})(game || (game = {}));
//# sourceMappingURL=PetPeiYangMediator.js.map