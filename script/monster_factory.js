function MonsterFactory() {
	this.createNormalMonsterData = function(ax, ay, awidth, res, name, hit_delay, die_delay, move_delay, stand_delay) {
		var is_right = Math.random() > 0.5 ? true : false;
		var is_move = Math.random() > 0.5 ? true : false;

		var count = parseInt(window.WAIT_FRAME * Math.random());

		var width = res["stand"][0].width;
		var height = res["stand"][0].height;
		var x = ax + parseInt((Math.random() * (awidth - width)));
		var y = ay - height;

		var hit_animation = new Animation(res["hit1"], hit_delay);
		var die_animation = new Animation(res["die1"], die_delay, 0);
		var move_animation = new Animation(res["move"], move_delay);
		var stand_animation = new Animation(res["stand"], stand_delay);
		return {ax: ax, ay: ay, awidth: awidth, // 活动范围
				x: x, y: y, width: width, height: height, // 位置属性
				is_right: is_right, is_move: is_move, count: count, // 怪物状态属性
				name: name,
				hit_animation: hit_animation, die_animation: die_animation, move_animation: move_animation, stand_animation: stand_animation // 动画
			};
	}

	this.getNormalMonster = function(data) {
		switch(data.name) {
			case "Caracol azul":
				return new NormalMonster(this.createNormalMonsterData(data.ax, data.ay, data.awidth, window.resource.lanwoniu, data.name,
										 500, 900, 900, 900));
			case "Mini cogu":
				return new NormalMonster(this.createNormalMonsterData(data.ax, data.ay, data.awidth, window.resource.moguzai, data.name, 
										500, 600, 600, 600));
			case "Cogumelo espinhoso":
				return new NormalMonster(this.createNormalMonsterData(data.ax, data.ay, data.awidth, window.resource.jinjidecimogu, data.name, 
									500, 600, 500, 600));
			case "Mini Snake":
				return new NormalMonster(this.createNormalMonsterData(data.ax, data.ay, data.awidth, window.resource.xiaoqingshe, data.name, 
									500, 600, 400, 500));
			case "Golem de aço":
				return new NormalMonster(this.createNormalMonsterData(data.ax, data.ay, data.awidth, window.resource.gangjiashitouren, data.name, 
									500, 600, 1500, 1000));

			case "Slime":
				return new NormalMonster(this.createNormalMonsterData(data.ax, data.ay, data.awidth, window.resource.lvshuilingqiu, data.name, 
									500, 600, 600, 600));
			case "Porco com laço":
				return new NormalMonster(this.createNormalMonsterData(data.ax, data.ay, data.awidth, window.resource.piaopiaozhu, data.name, 
									500, 600, 400, 500));
			case "Porco":
				return new NormalMonster(this.createNormalMonsterData(data.ax, data.ay, data.awidth, window.resource.zhu, data.name, 
									500, 600, 400, 500));
			case "Cogumelo laranja":
				return new NormalMonster(this.createNormalMonsterData(data.ax, data.ay, data.awidth, window.resource.huamogu, data.name, 
									500, 600, 400, 500));
			case "Gato flautista":
				return new NormalMonster(this.createNormalMonsterData(data.ax, data.ay, data.awidth, window.resource.chuidizidemao, data.name, 
									500, 600, 400, 500));

			case "Borboleta":
				return new NormalMonster(this.createNormalMonsterData(data.ax, data.ay, data.awidth, window.resource.hudie, data.name, 
									500, 600, 400, 500));
			case "Golem de pedra":
				return new NormalMonster(this.createNormalMonsterData(data.ax, data.ay, data.awidth, window.resource.shitouren, data.name, 
									500, 600, 800, 800));
			case "Golem de pedra negro":
				return new NormalMonster(this.createNormalMonsterData(data.ax, data.ay, data.awidth, window.resource.heishitouren, data.name, 
									500, 600, 800, 800));
			case "Porco de aço":
				return new NormalMonster(this.createNormalMonsterData(data.ax, data.ay, data.awidth, window.resource.gangtiezhu, data.name, 
									500, 600, 400, 500));
		}
	}

	this.createSkillAttackMonsterData = function(ax, ay, awidth, res, name, hit_delay, die_delay, move_delay, stand_delay, attack_delay, flag_frame, attack_effect_delay, attack_hit_delay, attack_width, attack_height) {
		var is_right = Math.random() > 0.5 ? true : false;
		var is_move = Math.random() > 0.5 ? true : false;

		var count = parseInt(window.WAIT_FRAME * Math.random());

		var width = res["stand"][0].width;
		var height = res["stand"][0].height;
		var x = ax + parseInt((Math.random() * (awidth - width)));
		var y = ay - height;

		var hit_animation = new Animation(res["hit1"], hit_delay);
		var die_animation = new Animation(res["die1"], die_delay, 0);
		var move_animation = new Animation(res["move"], move_delay);
		var stand_animation = new Animation(res["stand"], stand_delay);

		var attack_animation = new Animation(res["attack1"], attack_delay, flag_frame);
		var data =  {ax: ax, ay: ay, awidth: awidth, // 活动范围
				x: x, y: y, width: width, height: height, // 位置属性
				is_right: is_right, is_move: is_move, count: count, // 怪物状态属性
				name: name,
				attack_rect: new Rect(x + width / 2, y + height / 2 - attack_height / 2, attack_width, attack_height / 2 + height / 2),
				hit_animation: hit_animation, die_animation: die_animation, move_animation: move_animation, stand_animation: stand_animation,
				attack_animation: attack_animation// 动画
			};
		return data;
	}

	this.getSkillAttackMonster = function(data) {
		switch(data.name) {
			case "Pixil estelar":
				return new SkillAttackMonster(this.createSkillAttackMonsterData(data.ax, data.ay, data.awidth, window.resource.xingguangjingling, data.name,
										 500, 
										 900, 
										 900, 
										 900, 
										 1500, 6,
										 1000, 
										 400, 
										 200, 200));
			case "Pixil lunar":
				return new SkillAttackMonster(this.createSkillAttackMonsterData(data.ax, data.ay, data.awidth, window.resource.yueguangjingling, data.name,
										 500, 
										 900, 
										 900, 
										 900, 
										 1500, 6,
										 1000, 
										 400, 
										 250, 200));
			case "Pixil solar":
				return new SkillAttackMonster(this.createSkillAttackMonsterData(data.ax, data.ay, data.awidth, window.resource.riguangjingling, data.name,
										 500, 
										 900, 
										 900, 
										 900, 
										 1500, 6,
										 1000, 
										 400, 
										 250, 200));
		}
	}
}