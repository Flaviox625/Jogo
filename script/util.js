function NormalMonstersStackItem(ax, ay, awidth, count, name) {
	this.ax = ax;
	this.ay = ay;
	this.awidth = awidth;
	this.count = count;
	this.name = name;

	this.update = function(map_speed_x, map_speed_y) {
		this.ax += map_speed_x;
		this.ay += map_speed_y;
	}
}

function SkillAttackMonstersStackItem(ax, ay, awidth, count, name) {
	this.ax = ax;
	this.ay = ay;
	this.awidth = awidth;
	this.count = count;
	this.name = name;

	this.update = function(map_speed_x, map_speed_y) {
		this.ax += map_speed_x;
		this.ay += map_speed_y;
	}
}

function MonsterSkillEffect(data) {
	this.name = data.name;

	this.x = data.x;
	this.y = data.y;

	this.start_x = data.x;
	this.start_y = data.y;

	this.x_speed = data.x_speed;
	this.y_speed = data.y_speed;

	this.width = data.width;
	this.height = data.height;

	this.rect = new Rect(this.x, this.y, this.width, this.height);

	this.is_right = data.is_right;
	this.is_finish = false;

	this.animation = data.animation;
	this.curr_res;

	this.max_distance = data.max_distance;

	this.magicAttack = function(player_magic_defense) {
		var num = parseInt(Math.random() * (window.monsters_attr[this.name].max_magic_attack - window.monsters_attr[this.name].min_magic_attack + 1) + window.monsters_attr[this.name].min_magic_attack - player_magic_defense / 3);
		return num;
	}

	this.update = function(map_speed_x, map_speed_y) {
		this.updateX(map_speed_x);
		this.updateY(map_speed_y);
		this.updateRect(map_speed_x, map_speed_y);

		this.curr_res = this.animation.getCurrFrame();

		this.check();
	}

	this.updateX = function(map_speed_x) {
		this.start_x += map_speed_x;
		this.x += map_speed_x;
		this.x += this.x_speed;

	}

	this.updateY = function(map_speed_y) {
		this.start_y += map_speed_y;
		this.y += map_speed_y;
		this.y += this.y_speed;
	}

	this.updateRect = function(map_speed_x, map_speed_y) {
		this.rect.x = this.x;
		this.rect.y = this.y;
	}


	this.check = function() {
		if (Math.sqrt(Math.pow(this.x - this.start_x, 2) + Math.pow(this.y - this.start_y, 2)) > this.max_distance) {
			this.is_finish = true;
		}
	}

	this.checkCollision = function(rect, can_hit) {
		if (can_hit && this.rect.collision(rect)) {
			return true;
		} else {
			return false;
		}
	}

	this.draw = function(ctx) {
		if (this.is_right) {
			ctx.drawRightImage(this.curr_res, this.x, this.y);
		} else {
			ctx.drawImage(this.curr_res, this.x, this.y);
		}
	}
}

function MonsterSkillEffectFactory() {
	this.createSkillEffect = function(monster, player_center_x, player_center_y, speed, res) {
		var data = {};
			data.min_magic_attack = monster.min_magic_attack;
			data.max_magic_attack = monster.max_magic_attack;

			data.name = monster.name;
			data.x = monster.is_right ? monster.x + monster.width / 2 : monster.x - monster.attack_animation.res[0].width / 2 + monster.width / 2;
			data.y = monster.y + monster.height / 2;
			data.width = res[0].width;
			data.height = res[0].height;
			data.is_right = monster.is_right;
			data.max_distance = 250;
			data.animation = new Animation(res, 500);

		var angle = Math.atan2(player_center_y - data.y, player_center_x - data.x);
			data.x_speed = speed * Math.cos(angle);
			data.y_speed = speed * Math.sin(angle);

		return new MonsterSkillEffect(data);
	}

	this.getSkillEffect = function(monster, player_center_x, player_center_y) {
		switch(monster.name) {
			case "Pixil estelar":
				return this.createSkillEffect(monster, player_center_x, player_center_y, 5, window.resource.xingguangjingling["attack1.info.ball"]);
			case "Pixil lunar":
				return this.createSkillEffect(monster, player_center_x, player_center_y, 5, window.resource.yueguangjingling["attack1.info.ball"]);
			case "Pixil solar":
				return this.createSkillEffect(monster, player_center_x, player_center_y, 5, window.resource.riguangjingling["attack1.info.ball"]);
			
		}
	}
}

function MonsterSkillHit(data) {
	this.x = data.x;
	this.y = data.y;

	this.animation = data.animation;
	this.curr_res;

	this.width = this.animation.res[0].width;
	this.height = this.animation.res[0].height;

	this.update = function(player_center_x, player_center_y) {
		this.x = player_center_x - this.width / 2;
		this.y = player_center_y - this.height / 2;

		this.curr_res = this.animation.getCurrFrame();
	}

	this.getIsFinish = function() {
		return this.animation.is_finish;
	}

	this.draw = function(ctx) {
		ctx.drawImage(this.curr_res, this.x, this.y);
	}

}

function MonsterSkillHitFactory() {
	this.createSkillHit = function(x, y, time, res) {
		var data = {};
			data.animation = new Animation(res, time);
			data.width = data.animation.res[0].width;
			data.height = data.animation.res[0].height;
			data.x = x - data.width / 2;
			data.y = y - data.height / 2;

		return new MonsterSkillHit(data);
	}

	this.getSkillHit = function(monster_name, player_center_x, player_center_y) {
		switch(monster_name) {
			case "Pixil estelar":
				return this.createSkillHit(player_center_x, player_center_y, 300, window.resource.xingguangjingling["attack1.info.hit"]);
			case "Pixil lunar":
				return this.createSkillHit(player_center_x, player_center_y, 300, window.resource.yueguangjingling["attack1.info.hit"]);
			case "Pixil solar":
				return this.createSkillHit(player_center_x, player_center_y, 300, window.resource.riguangjingling["attack1.info.hit"]);
		}
	}

}

function Rect(x, y, width, height) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;

	this.collision = function(rect) {
		if (this.contain(rect.x, rect.y) || this.contain(rect.x, rect.y + rect.height) || this.contain(rect.x + rect.width, rect.y) || this.contain(rect.x + rect.width, rect.y + rect.height) || rect.contain(this.x, this.y) || rect.contain(this.x, this.y + this.height) || rect.contain(this.x + this.width, this.y) || rect.contain(this.x + this.width, this.y + this.height)) {
			return true;
		} else {
			return false;
		}
	}
	this.contain = function(x, y) {
		if (this.x < x && x < this.x + this.width && this.y < y && y < this.y + this.height) {
			return true;
		} else {
			return false;
		}
	}
}

function Animation(res, time, flag_frame) {
	this.res = res;
	this.count = 0;

	this.curr_frame = 0;
	this.total_frame = res.length;

	this.count = 0;
	this.max_count = window.parseInt(time / ((1000 / window.FPS) * res.length));

	this.flag_frame = flag_frame;
	this.is_finish = false;

	this.getCurrFrame = function() {
		this.count++;
		if (this.count > this.max_count) {
			this.curr_frame++;
			if (this.count > this.max_count && this.curr_frame == this.total_frame - 1 || this.total_frame == 1) {
				this.is_finish = true;
			}

			this.count = 0;
			if (this.curr_frame == this.total_frame) {
				this.curr_frame = 0;
			}
		}

		return this.res[this.curr_frame];
	}

	this.getIsFlagFrame = function() {
		if (this.flag_frame == this.curr_frame && this.count == 0) {
			return true;
		} else {
			return false;
		}
	}

	this.reset = function() {
		this.count = 0;
		this.curr_frame = 0;
		this.is_finish = false;
	}
}

function Percent() {
	this.gen = function(percent) {
		var go = Math.random();
		if (1 - percent <= go) {
			return true;
		} else {
			return false;
		}
	}
}

function Backpack() {
	this.backpack = [];
	this.backpack["Equipar"] = [];
	this.backpack["Usar"] = [];
	this.backpack["Outro"] = [];
	this.backpack["Especial"] = [];
	this.backpack["Utilizar"] = [];

	this.empty_list = [];
	this.empty_list["Equipar"] = [];
	this.empty_list["Usar"] = [];
	this.empty_list["Outro"] = [];
	this.empty_list["Especial"] = [];
	this.empty_list["Utilizar"] = [];

	this.consumable_pos = -1;
	this.consumable_limit = 300;

	this.other_pos = -1;
	this.other_limit = 200;

	this.equipment;

	for (var i in this.backpack) {
		for (var j = 0; j < 24; j++) {
			this.backpack[i].push(null);
			this.empty_list[i].push(j);
		}
	}

	this.checkCanAdd = function(thing) {
		switch(thing.type) {
			case 1:
				if (this.empty_list["Equipar"].length == 0) return false;
				break;
			case 2:
				for (var i in this.backpack["Usar"]) {
					if (this.backpack["Usar"][i] != null && this.backpack["Usar"][i].name == thing.name 
						&& (this.backpack["Usar"][i].amount != this.consumable_limit)
					 	&& (this.backpack["Usar"][i].amount + thing.amount <= this.consumable_limit 
						|| this.backpack["Usar"][i].amount + thing.amount > this.consumable_limit && this.empty_list["Usar"].length != 0)) {
						this.consumable_pos = i;
						return true;
					}
				}
				this.consumable_pos = -1;
				if (this.empty_list["Usar"].length == 0) return false;
				break;
			case 3:
				for (var i in this.backpack["Outro"]) {
					if (this.backpack["Outro"][i] != null && this.backpack["Outro"][i].name == thing.name 
						&& (this.backpack["Outro"][i].amount != this.other_limit)
					 	&& (this.backpack["Outro"][i].amount + thing.amount <= this.other_limit 
						|| this.backpack["Outro"][i].amount + thing.amount > this.other_limit && this.empty_list["Outro"].length != 0)) {
						this.other_pos = i;
						return true;
					}
				}
				this.other_pos = -1;
				if (this.empty_list["Outro"].length == 0) return false;
				break;
			case 4:
				break;		
		}
		return true;
	}

	this.add = function(thing) {
		switch(thing.type) {
			case 1:
				var pos = (this.empty_list["Equipar"].splice(0, 1))[0];
				this.backpack["Equipar"][pos] = new EquipmentItem(thing.name, thing.curr_res);
				break;
			case 2:
				if (this.consumable_pos != -1) {
					if (this.backpack["Usar"][this.consumable_pos].amount + thing.amount <= this.consumable_limit) {
						this.backpack["Usar"][this.consumable_pos].amount += thing.amount;
					} else {
						var amount =  this.consumable_limit - this.backpack["Usar"][this.consumable_pos].amount;
						this.backpack["Usar"][this.consumable_pos].amount = this.consumable_limit;

						var pos = (this.empty_list["Usar"].splice(0, 1))[0];
						this.backpack["Usar"][pos] = new ConsumableItem(thing.name, amount, thing.curr_res);
					}

				} else {
					var pos = (this.empty_list["Usar"].splice(0, 1))[0];
					this.backpack["Usar"][pos] = new ConsumableItem(thing.name, thing.amount, thing.curr_res);
				}
				break;
			case 3:
				if (this.other_pos != -1) {
					if (this.backpack["Outro"][this.other_pos].amount + thing.amount <= this.other_limit) {
						this.backpack["Outro"][this.other_pos].amount += thing.amount;
					} else {
						var amount =  this.other_limit - this.backpack["Outro"][this.other_pos].amount;
						this.backpack["Outro"][this.other_pos].amount = this.other_limit;

						var pos = (this.empty_list["Outro"].splice(0, 1))[0];
						this.backpack["Outro"][pos] = new OtherItem(thing.name, amount, thing.curr_res);
					}

				} else {
					var pos = (this.empty_list["Outro"].splice(0, 1))[0];
					this.backpack["Outro"][pos] = new OtherItem(thing.name, thing.amount, thing.curr_res);
				}
				break;
			case 4:
				break;		
		}
	}

	this.x = 100;
	this.y = 50;
	this.open = "Equipar";

	this.mouse_point = {index: -1, mouse_x: 0, mouse_y: 0};
	this.select_point = {index: -1, x: 0, y: 0, select: -1};

	this.is_second_click = false;

	this.count = 0;

	this.hp_set_index = -1;
	this.mp_set_index = -1;

	this.draw = function(ctx) {
		this.drawFrame(ctx);
		for (var i in this.backpack[this.open]) {
			if (this.backpack[this.open][i] != null) {
				ctx.drawImage(this.backpack[this.open][i].img, this.x + 12 + i % 4 * 36, this.y + 52 + parseInt(i / 4) * 35, 30, 30);
				if (this.open == "Usar" || this.open == "Outro") {
					ctx.save();
					ctx.strokeStyle = "black";
					ctx.fillStyle = "white";
					ctx.textAlign = "left";
					ctx.textBaseline = "bottom";
					ctx.lineWidth = 3;
					ctx.font = "16px Arial";
					ctx.strokeText(this.backpack[this.open][i].amount, this.x + 14 + i % 4 * 36, this.y + 52 + parseInt(i / 4) * 36 + 32, 30, 30);
					ctx.fillText(this.backpack[this.open][i].amount, this.x + 14 + i % 4 * 36, this.y + 52 + parseInt(i / 4) * 36 + 32, 30, 30);
					ctx.restore();
				}

				if (this.open == "Usar") {
					if (i == this.hp_set_index) {
						ctx.drawImage(window.resource.ui["backpack"][11], this.x + 9 + i % 4 * 36, this.y + 50 + parseInt(i / 4) * 36);

					}
					if (i == this.mp_set_index) {
						ctx.drawImage(window.resource.ui["backpack"][12], this.x + 9 + i % 4 * 36, this.y + 50 + parseInt(i / 4) * 36);
					}

				}	
				if (this.select_point.index == i) {
					ctx.strokeStyle = "orange";
					ctx.lineWidth = 2;
					ctx.roundRect(this.x + 11 + i % 4 * 36, this.y + 51 + parseInt(i / 4) * 35, 32, 32, 3, false, true);
				}
			}
		}

		if (this.mouse_point.index != -1) {
			ctx.save();
			ctx.strokeStyle = "black";
			ctx.roundRect(this.mouse_point.mouse_x - 1, this.mouse_point.mouse_y - 1, 202, 82, 10, false, true);
			ctx.strokeStyle = "white";
			ctx.roundRect(this.mouse_point.mouse_x, this.mouse_point.mouse_y, 200, 80, 10, false, true);
			// ctx.strokeStyle = "black";
			// ctx.roundRect(this.mouse_point.mouse_x + 1, this.mouse_point.mouse_y + 1, 198, 78, 10, false, true);
			ctx.globalAlpha = 0.5;
			ctx.roundRect(this.mouse_point.mouse_x, this.mouse_point.mouse_y, 200, 80, 10, true, false);
			ctx.globalAlpha = 1;

			ctx.font = "14px Arial";
			ctx.fillStyle = "white";
			ctx.textAlign = "center";
			ctx.textBaseline = "top";
			ctx.fillText(this.backpack[this.open][this.mouse_point.index].name, this.mouse_point.mouse_x + 100, this.mouse_point.mouse_y + 5);
			ctx.drawImage(this.backpack[this.open][this.mouse_point.index].img, this.mouse_point.mouse_x + 10, this.mouse_point.mouse_y + 30, 40, 40);
			
			ctx.font = "12px Arial";
			ctx.textAlign = "left";
			if (this.open == "Equipar") {
				for (var i in this.backpack[this.open][this.mouse_point.index].des) {
					ctx.fillText(this.backpack[this.open][this.mouse_point.index].des[i], this.mouse_point.mouse_x + 60 , this.mouse_point.mouse_y + 30 + 15*i);
				}
			} else {
				ctx.fillText(this.backpack[this.open][this.mouse_point.index].des, this.mouse_point.mouse_x + 60, this.mouse_point.mouse_y + 30);
			}
			ctx.restore();
		}

		this.drawMenu(ctx);
	}

	this.drawMenu = function(ctx) {
		if (this.select_point.index != -1) {
			ctx.save();
			ctx.strokeStyle = "black";
			ctx.roundRect(this.select_point.x - 1, this.select_point.y - 1, 52, 82, 10, false, true);
			ctx.strokeStyle = "white";
			ctx.roundRect(this.select_point.x, this.select_point.y, 50, 80, 10, false, true);
			// ctx.strokeStyle = "black";
			// ctx.roundRect(this.select_point.x + 1, this.select_point.y + 1, 48, 78, 10, false, true);

 			ctx.globalAlpha = 0.5;
 			ctx.roundRect(this.select_point.x, this.select_point.y, 50, 80, 10, true, false);

 			ctx.globalAlpha = 1;
 			ctx.font = "12px Arial";
 			ctx.textAlign = "center";
 			ctx.textBaseline = "top";
 			ctx.fillStyle = "white";
 			switch(this.open) {
 				case "Equipar":
 					ctx.fillText("Equipar", this.select_point.x + 25, this.select_point.y + 18);
 					ctx.fillText("jogar fora", this.select_point.x + 25, this.select_point.y + 48);
 					break;
 				case "Usar":
 					ctx.fillText("Utilizar", this.select_point.x + 25, this.select_point.y + 18);
 					ctx.fillText("jogar fora", this.select_point.x + 25, this.select_point.y + 48);
 					break;
 				case "Outro":
 					ctx.fillText("XXX", this.select_point.x + 25, this.select_point.y + 18);
 					ctx.fillText("jogar fora", this.select_point.x + 25, this.select_point.y + 48);	
 					break;
 			}

 			ctx.restore();
 		}
	}

	this.head = [];
	this.head["Equipar"] = [2, 3, 5, 7, 9];
	this.head["Usar"] = [1, 4, 5, 7, 9];
	this.head["Outro"] = [1, 3, 6, 7, 9];
	this.head["Especial"] = [1, 3, 5, 8, 9];
	this.head["Utilizar"] = [1, 3, 5, 7, 10];
	this.drawFrame = function(ctx) {
		ctx.save();
		ctx.drawImage(window.resource.ui["backpack"][0], this.x, this.y);
		var fix_y = 0;
		for (var i in this.head[this.open]) {
			if (this.head[this.open][i] % 2 == 0) fix_y = -1;
			else fix_y = 0;
			ctx.drawImage(window.resource.ui["backpack"][this.head[this.open][i]], this.x + 9 + i % 5 * 29, this.y + 26 + fix_y, 28, 20);
		}
		ctx.font = "14px Arial";
		ctx.fillStyle = "black";
		ctx.textAlign = "right";
		ctx.textBaseline = "top";
		ctx.fillText(window.player_attr.money, this.x + 120, this.y + 268);
		ctx.restore();
	}

	this.checkItemCollision = function(mouse_x, mouse_y) {
		if (this.select_point.index != -1) return;
		for (var i in this.backpack[this.open]) {
			if (this.backpack[this.open][i] != null && this.x + 12 +  i % 4 * 36 < mouse_x && mouse_x < this.x + 12 + i % 4 * 36 + 30 &&
				this.y + 52 + parseInt(i / 4) * 35 < mouse_y && mouse_y < this.y + 52 + parseInt(i / 4) * 35 + 30) {
				this.mouse_point.index = i;
				this.mouse_point.mouse_x = mouse_x;
				this.mouse_point.mouse_y = mouse_y;
				return;
			}
		}
		this.mouse_point.index = -1;
	}

	this.checkItemSelect = function(mouse_x, mouse_y) {
		if (this.count == 1){
			this.count = 2;
		 	return;
		}

		this.mouse_point.index = -1;
		for (var i = 0; i < this.backpack[this.open].length; i++) {
 			if (this.backpack[this.open][i] != null && this.x + 12 + i % 4 * 36 < mouse_x && mouse_x < this.x + 12 + i % 4 * 36 + 31 
 				&& this.y + 50 + parseInt(i / 4) * 36 < mouse_y && mouse_y < this.y + 50 + parseInt(i / 4) * 36 + 31) {
 				this.select_point.index = i;
 				this.select_point.x = this.x + 12 + i % 4 * 36 + 31;
 				this.select_point.y = this.y + 50 + parseInt(i / 4) * 36 + 31;
 				this.count = 1;
 				return;
 			}
 		}
 		this.select_point.index = -1;
	}

	this.checkMenuSelect = function(mouse_x, mouse_y) {
		if (this.select_point.index == -1 || this.count != 2) {
			return;
		} 
		if (this.select_point.x > mouse_x || mouse_x > this.select_point.x + 50) {
			this.select_point.index = -1;
			this.count = 0;
			return;
		}
		this.select_point.select = -1;
		this.count = 0;
		switch(this.open) {
			case "Equipar":
				if (this.select_point.y + 18 < mouse_y && mouse_y < this.select_point.y + 30) {
					this.select_point.select = 0;
				} else if (this.select_point.y + 48 < mouse_y && mouse_y < this.select_point.y + 60) {
					this.select_point.select = 1;
				}
				break;
			case "Usar":
				if (this.select_point.y + 18 < mouse_y && mouse_y < this.select_point.y + 30) {
					this.select_point.select = 0;
				} else if (this.select_point.y + 48 < mouse_y && mouse_y < this.select_point.y + 60) {
					this.select_point.select = 1;
				}
				break;
			case "Outro":
				if (this.select_point.y + 18 < mouse_y && mouse_y < this.select_point.y + 30) {
					this.select_point.select = 0;
				} else if (this.select_point.y + 48 < mouse_y && mouse_y < this.select_point.y + 60) {
					this.select_point.select = 1;
				}
				break;
		}
		this.selectResult();
	}

	this.selectResult = function() {
		if (this.select_point.select == -1){ 
			this.select_point.index = -1;
			return;
		}
		if (this.select_point.select == 1) {
			this.backpack[this.open][this.select_point.index] = null;

			for (var i = 0; i < this.empty_list[this.open].length; i++) {
				if (this.empty_list[this.open][i] > this.select_point.index) {
					this.empty_list[this.open].splice(i, 0, this.select_point.index);
					if (this.open == "Usar") {
						if (this.select_point.index == this.hp_set_index) {
							this.hp_set_index = -1;
						} else if (this.select_point.index == this.mp_set_index) {
							this.mp_set_index = -1;
						}
					}
					break;
				}
			}

			if (this.empty_list[this.open].length == 0 || i == this.empty_list[this.open].length) {
				this.empty_list[this.open].push(this.select_point.index);
			}
		} else {
			switch(this.open) {
				case "Equipar":
					var name = this.backpack[this.open][this.select_point.index].name;
					if (name == "Navalha" || name == "Lâmina da Fênix" || name == "lâmina de asa dupla" || name == "lamina maple") {
						if (window.player_attr.weapon == null) {
							window.player_attr.weapon = this.backpack[this.open][this.select_point.index];
							this.backpack[this.open][this.select_point.index] = null;

							for (var i = 0; i < this.empty_list[this.open].length; i++) {
								if (this.empty_list[this.open][i] > this.select_point.index) {
									this.empty_list[this.open].splice(i, 0, this.select_point.index);
									break;
								}
							}

							if (this.empty_list[this.open].length == 0 || i == this.empty_list.length) {
								this.empty_list[this.open].push(this.select_point.index);
							}

						} else {
							var temp = window.player_attr.weapon;
							window.player_attr.weapon = this.backpack[this.open][this.select_point.index];
							this.backpack[this.open][this.select_point.index] = temp;
						}
						this.equipment.weapon = window.player_attr.weapon;

					} else if (name == "camisa preta" || name == "casaco de couro") {
						if (window.player_attr.clothes == null) {
							window.player_attr.clothes = this.backpack[this.open][this.select_point.index];
							this.backpack[this.open][this.select_point.index] = null;

							for (var i = 0; i < this.empty_list[this.open].length; i++) {
								if (this.empty_list[this.open][i] > this.select_point.index) {
									this.empty_list[this.open].splice(i, 0, this.select_point.index);
									break;
								}
							}

							if (this.empty_list[this.open].length == 0 || i == this.empty_list.length) {
								this.empty_list[this.open].push(this.select_point.index);
							}

						} else {
							var temp = window.player_attr.clothes;
							window.player_attr.clothes = this.backpack[this.open][this.select_point.index];
							this.backpack[this.open][this.select_point.index] = temp;
						}
						this.equipment.clothes = window.player_attr.clothes;
					}
					window.player_attr.update();
					break;
				case "Usar":
					var name = this.backpack[this.open][this.select_point.index].name;
					if (name == "poção vermelha" || name == "Poção Branca" || name == "Poção Laranja") {
						this.hp_set_index = this.select_point.index;
					} else if (name == "Poção Azul" || name == "Elixir") {
						this.mp_set_index = this.select_point.index;
					}
					break;
				case "Outro":

					break;
			}
		}
		this.select_point.index = -1;
	}

	this.changeType = function(mouse_x, mouse_y, is_click) {
		if (is_click && this.y + 25 < mouse_y && mouse_y < this.y + 45) {
			if (this.x + 7 < mouse_x && mouse_x < this.x + 7 + 31) {
				this.open = "Equipar";
				this.count = 0;
			} else if (this.x + 7 + 31 < mouse_x && mouse_x < this.x + 7 + 62) {
				this.open = "Usar";
				this.count = 0;
			} else if (this.x + 7 + 62 < mouse_x && mouse_x < this.x + 7 + 93) {
				this.open = "Outro";
				this.count = 0;
			} else if (this.x + 7 + 93 < mouse_x && mouse_x < this.x + 7 + 124) {
				this.open = "Especial";
			} else if (this.x + 7 + 124 < mouse_x && mouse_x < this.x + 7 + 155) {
				this.open = "Utilizar";
			}
		}
		if (this.count == 0) {
			this.select_point.index = -1;
		}
	}

	this.addMp = function() {
		if (this.mp_set_index == -1) {return false;}

		this.backpack["Usar"][this.mp_set_index].amount--;
		var name = this.backpack["Usar"][this.mp_set_index].name;

		var mp = 0;
		if (name == "Poção Azul") {
			mp = 100;
		} else if (name == "Elixir") {
			mp = 300;
		}
		window.player_attr.curr_mp += mp;
		if (window.player_attr.curr_mp > window.player_attr.max_mp) {
			window.player_attr.curr_mp = window.player_attr.max_mp;
		}

		if (this.backpack["Usar"][this.mp_set_index].amount == 0) {
			var name = this.backpack["Usar"][this.mp_set_index].name;
			for (var i in this.backpack["Usar"]) {
				if (this.backpack["Usar"][i] != null && i != this.mp_set_index && name == this.backpack["Usar"][i].name) {
					this.mp_set_index = i;
					return;
				}
			}


			this.backpack["Usar"][this.mp_set_index] = null;

			for (var i = 0; i < this.empty_list[this.open].length; i++) {
				if (this.empty_list[this.open][i] > this.mp_set_index) {
					this.empty_list[this.open].splice(i, 0, this.mp_set_index);
					break;
				}
			}

			if (this.empty_list[this.open].length == 0) {
				this.empty_list[this.open].push(this.mp_set_index);
			}

			this.mp_set_index = -1;
		}
	}

	this.addHp = function() {
		if (this.hp_set_index == -1) {return false;}

		this.backpack["Usar"][this.hp_set_index].amount--;
		var name = this.backpack["Usar"][this.hp_set_index].name;
		var hp = 0;
		if (name == "poção vermelha") {
			hp = 50;
		} else if (name == "Poção Laranja") {
			hp = 150;
		} else if (name == "Poção Branca") {
			hp = 300;
		}

		window.player_attr.curr_hp += hp;
		if (window.player_attr.curr_hp > window.player_attr.max_hp) {
			window.player_attr.curr_hp = window.player_attr.max_hp;
		}

		if (this.backpack["Usar"][this.hp_set_index].amount == 0) {
			var name = this.backpack["Usar"][this.hp_set_index].name;
			for (var i in this.backpack["Usar"]) {
				if (this.backpack["Usar"][i] != null && i != this.hp_set_index && name == this.backpack["Usar"][i].name) {
					this.hp_set_index = i;
					return;
				}
			}

			this.backpack["Usar"][this.hp_set_index] = null;

			for (var i = 0; i < this.empty_list[this.open].length; i++) {
				if (this.empty_list[this.open][i] > this.hp_set_index) {
					this.empty_list[this.open].splice(i, 0, this.hp_set_index);
					break;
				}
			}

			if (this.empty_list[this.open].length == 0) {
				this.empty_list[this.open].push(this.hp_set_index);
			}

			this.hp_set_index = -1;
		}
	}
}

function EquipmentItem(name, img) {
	this.name = name;
	this.img = img;
	this.properties = window.properties_factory.getProperties(this.name);
	this.des = window.des_factory.equipmentDes(this.properties);
}

function ConsumableItem(name, amount, img) {
	this.name = name;
	this.amount = amount;
	this.img = img;
	this.des = window.des_factory.getDes(this.name, 2);
}

function OtherItem(name, amount, img) {
	this.name = name;
	this.amount = amount;
	this.img = img;
	this.des = window.des_factory.getDes(this.name, 3);
}

function DesFactory() {
	this.equipmentDes = function(properties) {
		var arr = [];
		if (properties.attack != 0) {
			arr.push("Poder de ataque " + properties.attack);
		}
		if (properties.defense != 0) {
			arr.push("Defesa física " + properties.defense);
		}
		if (properties.magic_defense != 0) {	
			arr.push("Defesa magica " + properties.magic_defense);
		}
		return arr;
	}

	this.consumableDes = function(name) {
		switch(name) {
			case "poção vermelha":
				return " recupera 50 de HP";
			case "Poção Laranja":
				return " recupera 150 de HP";
			case "Poção Branca":
				return " recupera 300 de HP";
			case "Poção Azul":
				return " recupera 100 de MP";
			case "Elixir":
				return " recupera 300 de MP";
		}
	}

	this.otherDes = function(name) {
		switch(name) {
			case "concha de caracol azul":
				return "uma concha de um caracol";
			case "esporos de cogumelos":
				return "esporo caido";
			case "bolha liquida":
				return "liquido viscoso";
			case "antena de slime":
				return "cabelo de slime";
			case "laço de porco":
				return "laço do porquinho";
			case "cabeça de porco":
				return "cabeça de porco"
			case "pedra":
				return "pedra do golem";
			case "pedra negra":
				return "pedra do golem negro";
			case "fragmento de estrela":
				return "estrela de pixil";
			case "fragmento de lua":
				return "lua de pixil";
			case "fragmento do sol":
				return "pedaço do sol";
			case "chapéu de cogumelo espinhoso":
				return "chapéu de cogumelo espinhoso";
			case "bloco de aço":
				return "bloco de aço";
			case "pedaço de armadura":
				return "pertencia ao porco de ferro";
			case "casco de porco de ferro":
				return "fazia parte da armadura dele";
			case "pele de cobra":
				return "escamas de cobra ";
			case "chapéu de cogumelo laranja":
				return "chapéu de cogumelo laranja";
			case "couro de gato":
				return "pele de um gato";
			case "casco de aço":
				return "pedaço de ferro";
		}
	}

	this.getDes = function(name, type) {
		switch (type) {
			case 1:
				return this.equipmentDes(name);
				break;
			case 2:
				return this.consumableDes(name);
				break;
			case 3:
				return this.otherDes(name);
		}
	}
}

function PropertiesFactory() {
	this.getProperties = function(name) {
		switch(name) {
			case "Navalha":
				return {attack: 10 + parseInt(Math.random() * 6), defense: parseInt(Math.random() * 6), magic_defense: parseInt(Math.random() * 6), power_hit: 0}
			case "Lâmina da Fênix":
				return {attack: 92 + parseInt(Math.random() * 6), defense: 30 + parseInt(Math.random() * 6), magic_defense: 40 + parseInt(Math.random() * 6), power_hit: 0}
			case "lamina maple":
				return {attack: 34 + parseInt(Math.random() * 6), defense: 10 + parseInt(Math.random() * 6), magic_defense: 15 + parseInt(Math.random() * 6), power_hit: 0}
			case "lâmina de asa dupla":
				return {attack: 55 + parseInt(Math.random() * 6), defense: 24 + parseInt(Math.random() * 6), magic_defense: 60 + parseInt(Math.random() * 6), power_hit: 0}
			case "casaco de couro":
				return {attack: parseInt(Math.random() * 6), defense: 45 + parseInt(Math.random() * 6), magic_defense: 30 + parseInt(Math.random() * 6), power_hit: 0}
			case "camisa preta":
				return {attack: parseInt(Math.random() * 16), defense: 120 + parseInt(Math.random() * 11), magic_defense: 120 + parseInt(Math.random() * 11), power_hit: 0}
		}
	}
}

function Ability() {
	this.x = 300;
	this.y = 50;

	this.addPoint = function(mouse_x, mouse_y, is_click) {
		if (window.player_attr.point == 0 || mouse_x > this.x + 153 || mouse_x < this.x + 139) {
			return;
		}

		if (mouse_y > this.y + 244 && mouse_y < this.y + 258) {
			window.player_attr.STR++;
			window.player_attr.point--;
		} else if (mouse_y > this.y + 262 && mouse_y < this.y + 276) {
			window.player_attr.DEX++;
			window.player_attr.point--;
		} else if (mouse_y > this.y + 280 && mouse_y < this.y + 294) {
			window.player_attr.INT++;
			window.player_attr.point--;
		} else if (mouse_y > this.y + 298 && mouse_y < this.y + 318) {
			window.player_attr.LUK++;
			window.player_attr.point--;
		}
		window.player_attr.update();
	}

	this.draw = function(ctx) {
		this.drawFrame(ctx);
	}

	this.drawFrame = function(ctx) {
		ctx.save();
		ctx.drawImage(window.resource.ui["ability"][0], this.x, this.y);

		ctx.font = "14px Arial";
		ctx.textAlign = "left";
		ctx.textBaseline = "top";
		ctx.fillStyle = "black";
		ctx.fillText(window.player_attr.curr_hp + " / " + window.player_attr.max_hp, this.x + 55, this.y + 30);
		ctx.fillText(window.player_attr.curr_mp + " / " + window.player_attr.max_mp, this.x + 55, this.y + 48);
		ctx.fillText(window.player_attr.curr_exp +  " / " + window.player_attr.max_exp, this.x + 55, this.y + 66);
		ctx.fillText(window.player_attr.work, this.x + 55, this.y + 84);

		ctx.fillText(window.player_attr.min_attack + " ~ " + window.player_attr.max_attack, this.x + 55, this.y + 120);
		ctx.fillText(window.player_attr.power_hit * 100 + "%", this.x + 55, this.y + 138);
		ctx.fillText(window.player_attr.defense, this.x + 55, this.y + 156);
		ctx.fillText(window.player_attr.magic_defense, this.x + 55, this.y + 174);

		ctx.fillText(window.player_attr.point, this.x + 70, this.y + 218);

		ctx.fillText(window.player_attr.STR, this.x + 55, this.y + 244);
		ctx.fillText(window.player_attr.DEX, this.x + 55, this.y + 262);
		ctx.fillText(window.player_attr.INT, this.x + 55, this.y + 280);
		ctx.fillText(window.player_attr.LUK, this.x + 55, this.y + 298);

		var index = 1;
		if (window.player_attr.point == 0) {
			index = 1;
		} else {
			index = 2;
		}

		ctx.drawImage(window.resource.ui["ability"][index], this.x + 140, this.y + 245);
		ctx.drawImage(window.resource.ui["ability"][index], this.x + 140, this.y + 263);	
		ctx.drawImage(window.resource.ui["ability"][index], this.x + 140, this.y + 281);
		ctx.drawImage(window.resource.ui["ability"][index], this.x + 140, this.y + 299);

		ctx.restore();
	}
}

function Equipment() {
	this.x = 500;
	this.y = 50;

	this.mouse_point = {index: -1, mouse_x: 0, mouse_y: 0};

	this.weapon = null;
	this.clothes = null;

	this.mouseHover = function(mouse_x, mouse_y) {
		this.mouse_point.index = -1;
		if (this.y + 128 > mouse_y || this.y + 159 < mouse_y) return;

		this.mouse_point.mouse_x = mouse_x;
		this.mouse_point.mouse_y = mouse_y;

		if (this.x + 110 < mouse_x && this.x + 143 > mouse_x) {
			this.mouse_point.index = 0;
		} else if (this.x + 43 < mouse_x && this.x + 74 > mouse_x) {
			this.mouse_point.index = 1;
		}
	}

	this.draw = function(ctx) {
		ctx.save();
		ctx.drawImage(window.resource.ui["equipment"][0], this.x, this.y);

		ctx.font = "14px Arial";
		ctx.fillStyle = "white";
		if (this.weapon != null) {
			ctx.drawImage(this.weapon.img, this.x + 110, this.y + 128, 31, 31);
		}
		if (this.clothes != null) {
			ctx.drawImage(this.clothes.img, this.x + 43, this.y + 128, 31, 31);
		}

		if (this.weapon != null && this.mouse_point.index == 0) {
			ctx.strokeStyle = "black";
			ctx.roundRect(this.mouse_point.mouse_x - 1, this.mouse_point.mouse_y - 1, 202, 82, 10, false, true);
			ctx.strokeStyle = "white";
			ctx.roundRect(this.mouse_point.mouse_x, this.mouse_point.mouse_y, 200, 80, 10, false, true);
			ctx.globalAlpha = 0.5;
			ctx.fillStyle = "black";
			ctx.roundRect(this.mouse_point.mouse_x, this.mouse_point.mouse_y, 200, 80, 10, true, false);
			ctx.globalAlpha = 1;

			ctx.font = "14px Arial";
			ctx.fillStyle = "white";
			ctx.textAlign = "center";
			ctx.textBaseline = "top";
			ctx.fillText(this.weapon.name, this.mouse_point.mouse_x + 100, this.mouse_point.mouse_y + 5);
			ctx.drawImage(this.weapon.img, this.mouse_point.mouse_x + 10, this.mouse_point.mouse_y + 30, 40, 40);
			
			ctx.font = "12px Arial";
			ctx.textAlign = "left";
			
			for (var i in this.weapon.des) {
				ctx.fillText(this.weapon.des[i], this.mouse_point.mouse_x + 60 , this.mouse_point.mouse_y + 30 + 15*i);
			}
		}
		if (this.clothes != null && this.mouse_point.index == 1) {
			ctx.strokeStyle = "black";
			ctx.roundRect(this.mouse_point.mouse_x - 1, this.mouse_point.mouse_y - 1, 202, 82, 10, false, true);
			ctx.strokeStyle = "white";
			ctx.roundRect(this.mouse_point.mouse_x, this.mouse_point.mouse_y, 200, 80, 10, false, true);
			ctx.globalAlpha = 0.5;
			ctx.fillStyle = "black";
			ctx.roundRect(this.mouse_point.mouse_x, this.mouse_point.mouse_y, 200, 80, 10, true, false);
			ctx.globalAlpha = 1;

			ctx.font = "14px Arial";
			ctx.fillStyle = "white";
			ctx.textAlign = "center";
			ctx.textBaseline = "top";
			ctx.fillText(this.clothes.name, this.mouse_point.mouse_x + 100, this.mouse_point.mouse_y + 5);
			ctx.drawImage(this.clothes.img, this.mouse_point.mouse_x + 10, this.mouse_point.mouse_y + 30, 40, 40);
			
			ctx.font = "12px Arial";
			ctx.textAlign = "left";
			
			for (var i in this.clothes.des) {
				ctx.fillText(this.clothes.des[i], this.mouse_point.mouse_x + 60 , this.mouse_point.mouse_y + 30 + 15*i);
			}
		}
		ctx.restore();
	}
}