var battle;
(function (battle_1) {
    var action;
    (function (action) {
        var operation;
        (function (operation) {
            /**
             * 技能效果
             */
            var SelectSkill = /** @class */ (function () {
                function SelectSkill(subresult, attacker_id, battle, operstionID, isFaShuLianJi) {
                    this.subresult = subresult;
                    this.attacker_id = attacker_id;
                    this.operstionID = operstionID;
                    this.battle = battle;
                    this.isFaShuLianJi = isFaShuLianJi;
                }
                SelectSkill.prototype.doAction = function () {
                    var stage_actions = [];
                    var stage_action;
                    // 飘字
                    var attacker = this.battle.findRoleByIndex(this.attacker_id);
                    var attacker_units = [attacker.fakeUnit];
                    console.log("使用技能攻擊");
                    var stage_list = [];
                    var is_stage2;
                    if (this.subresult.subskillid !== 0) {
                        var skill_info = this.battle.battleProxy.SkillInfoData[this.subresult.subskillid];
                        if (skill_info) {
                            console.log(skill_info);
                            var skill_type = this.battle.battleProxy.SkillTypeData[this.operstionID];
                            if (skill_info.stagelist2 && skill_info.stagelist2.length > 0) {
                                var stages = skill_info.stagelist2.split(",");
                                is_stage2 = true;
                                for (var index = 0; index < stages.length; index++) {
                                    var stage_id = stages[index];
                                    stage_list.push(this.battle.battleProxy.StageInfoData2[stage_id]);
                                }
                            }
                            else if (skill_info.stagelist && skill_info.stagelist.length > 0) {
                                var stages = skill_info.stagelist.split(",");
                                for (var index = 0; index < stages.length; index++) {
                                    var stage_id = stages[index];
                                    stage_list.push(this.battle.battleProxy.StageInfoData[stage_id]);
                                }
                            }
                        }
                    }
                    console.log("this.self_role", is_stage2, stage_list, this.subresult.resultlist);
                    stage_actions = [];
                    stage_action = null;
                    for (var j = 0; j < this.subresult.resultlist.length; j++) {
                        var result = this.subresult.resultlist[j];
                        var target = this.battle.findRoleByIndex(this.subresult.resultlist[j].targetID);
                        if (j == 0) {
                            var lastResult = this.subresult.resultlist[j];
                            if (this.isFaShuLianJi) {
                                // 播放特效
                                // const stage_data: StageInfoBaseVo = new StageInfoBaseVo();
                                //stage_data.effectname = "lianji";
                                stage_action = new battle.aciton.stage.TextEffectStage(this.battle, "lianji", attacker);
                                stage_actions.push(stage_action);
                            }
                            if (skill_type && skill_type.showskillname != 0)
                                // 喊字效果 
                                this.battle.createFightPicTxt(attacker, skill_type.skillname);
                        }
                        for (var _indei = 0; _indei < stage_list.length; _indei++) {
                            var stage_data = stage_list[_indei];
                            var iResultCount = this.subresult.resultlist.length;
                            //  console.log("-------------stage_id", stage_data.id, "  type", stage_data.stagetype);
                            if (result.resultType == 5)
                                continue;
                            switch (stage_data.stagetype) {
                                case 0: //播放动作
                                    if (stage_data.targetx >= iResultCount) //如果要攻击并转向的目标索引大于本次伤害结果总数则不创建此移动阶段
                                        continue;
                                    stage_action = new battle.aciton.stage.PlayAction(this.battle, result, stage_data, attacker, attacker_units);
                                    break;
                                case 1: //移动
                                    if (stage_data.targetx >= iResultCount) //如果要移动并转向的目标索引大于本次伤害结果总数则不创建此移动阶段
                                        continue;
                                    // 看配置表是小于10
                                    if (stage_data.syncprotect < 10)
                                        stage_action = new battle.aciton.stage.Move(this.battle, result, stage_data, attacker, attacker_units);
                                    // 保护者移动 
                                    if (result.protecter_id > 0) {
                                        if (!stage_action) {
                                            stage_actions.push(stage_action);
                                        }
                                        var iProtecter = this.battle.findRoleByIndex(result.protecter_id);
                                        stage_action = new battle.aciton.stage.Move(this.battle, result, stage_data, iProtecter, [iProtecter.fakeUnit]);
                                    }
                                    break;
                                case 2: //特效播放
                                    stage_action = new battle.aciton.stage.PlayEffects(this.battle, result, stage_data, attacker, attacker_units);
                                    break;
                                case 4: //结果计算
                                    stage_action = new battle.aciton.CResultStage(this.battle, result, this.attacker_id);
                                    // 反击
                                    if (result.attack_back > 0) {
                                        stage_actions.push(stage_action);
                                        stage_action = new battle.aciton.stage.PlayAction(this.battle, result, stage_data, target, [target]);
                                    }
                                    break;
                                case 5: //变身，在残影对象填变身模型id
                                    stage_action = new battle.aciton.stage.ChangeModel(this.battle, result, stage_data, attacker, attacker_units);
                                    break;
                                case 6: //隐身，填透明度即可
                                    stage_action = new battle.aciton.stage.HideModel(this.battle, result, stage_data, attacker, attacker_units);
                                    break;
                            }
                            stage_actions.push(stage_action);
                            // 检查这个stage是否有音效 一般是特效stage存在音效
                            if (stage_data.effectsound.trim().length > 0) {
                                stage_action = new battle.aciton.stage.SoundEffectStage(this.battle, "sounds/skill/" + stage_data.effectsound + ".ogg");
                                stage_actions.push(stage_action);
                            }
                            // C++这段是要做什么？
                            if (stage_action == null) {
                                //     //远程不跑或是只操作保护者的情况才会到这里
                                if (result.protecter_id != 0) {
                                    stage_action = new battle_1.Recover(this.battle, iProtecter, [iProtecter.fakeUnit]);
                                }
                            }
                        }
                    }
                    stage_action = new battle_1.Recover(this.battle, attacker, attacker_units);
                    stage_actions.push(stage_action);
                    return stage_actions;
                };
                return SelectSkill;
            }());
            operation.SelectSkill = SelectSkill;
        })(operation = action.operation || (action.operation = {}));
    })(action = battle_1.action || (battle_1.action = {}));
})(battle || (battle = {}));
//# sourceMappingURL=SelectSkill.js.map