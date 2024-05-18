function Bg(data) {
	this.x = data.x;
	this.y = data.y;
	this.res = data.res;

	this.width = this.res.width;
	this.height = this.res.height;

	this.draw = function(ctx) {
		ctx.drawImage(this.res, this.x, this.y, window.WIDTH, window.HEIGHT);
	}
}

function UI() {
	this.x = 0;
	this.y = window.HEIGHT - 62;
	this.res = window.resource.ui["main_bar"][0];

	this.tip = {color: "white", tip: "[Autor] Bem-vindo ao MapleStory World!"};

	this.createTip = function(type, tip) {
		var color;
		switch(type) {
			case 0:
				color = "yellow";
				break;
			case 1:
				color = "white";
				break;
		}
		return {color: color, tip: tip};
	}

	this.update = function() {
		var num = parseInt(Math.random() * 5000);
		switch(num) {
			case 0:
				this.tip = this.createTip(0, "[Ajuda] Pressione as teclas de direção no feixe de luz para mudar de mapa.");
				break;
			case 1:
				this.tip = this.createTip(0, "[Ajuda] Quando a mochila estiver cheia, os itens podem ser descartados.");
				break;
			case 2:
				this.tip = this.createTip(0, "[Ajuda] Pressione as setas do teclado no ar para subir em cordas e escadas.");
				break;
			case 3:
				this.tip = this.createTip(1, "[Autor] Este jogo é apenas para teste.");
				break;
			case 4:
				this.tip = this.createTip(1, "[Autor]QQ1439080086.");
				break;
			case 5:
				this.tip = this.createTip(0, "[Ajuda] Depois de matar monstros, há uma certa probabilidade de obter equipamentos, que podem melhorar os atributos do personagem.")
				break;
			case 6:
				this.tip = this.createTip(0, "[Ajuda] Após passar de nivel, você pode obter 5 pontos de habilidade, que são usados ​​para melhorar os atributos do personagem.");
				break;
			case 7:
				this.tip = this.createTip(0, "[Ajuda] A força afeta o poder de ataque e o poder de defesa.");
				break;
			case 8:
				this.tip = this.createTip(0, "[Ajuda] A agilidade afeta o poder de ataque, o poder de defesa e o poder de defesa mágica.");
				break;
			case 9:
				this.tip = this.createTip(0, "[Ajuda] A inteligência afeta a defesa mágica.");
				break;
			case 10:
				this.tip = this.createTip(0, "[Ajuda] A sorte afeta o poder de ataque.");
				break;
		}
	}

	this.draw = function(ctx) {
		ctx.save();
		ctx.drawImage(this.res, this.x, this.y);
		ctx.fillStyle = this.tip.color;
		ctx.font = "12px liwen";
		ctx.textAlign = "left";
		ctx.textBaseline = "top";
		ctx.fillText(this.tip.tip, 10, window.HEIGHT - 54);

		var lineGradient = ctx.createLinearGradient (255, window.HEIGHT - 32,255, window.HEIGHT - 12);  
		lineGradient.addColorStop(0, 'rgba(255,0,0, 0.8)');    
		lineGradient.addColorStop(1, 'rgba(255,99,71, 0.8)');    
		ctx.fillStyle = lineGradient;    
		ctx.roundRect(254, window.HEIGHT - 32, 137 * window.player_attr.curr_hp / window.player_attr.max_hp, 12, 3, true, false);

		var lineGradient = ctx.createLinearGradient (423, window.HEIGHT - 32,423, window.HEIGHT - 12);  
		lineGradient.addColorStop(0, 'rgba(65,105,225, 0.8)');    
		lineGradient.addColorStop(1, 'rgba(100,149,237, 0.8)');    
		ctx.fillStyle = lineGradient;   
		ctx.roundRect(423, window.HEIGHT - 32, 137 * window.player_attr.curr_mp / window.player_attr.max_mp, 12, 3, true, false);

		
		var lineGradient = ctx.createLinearGradient (423, window.HEIGHT - 32,423, window.HEIGHT - 12);  
		lineGradient.addColorStop(0, 'rgba(124,252,0, 0.8)');    
		lineGradient.addColorStop(1, 'rgba(255,215,0, 0.8)');    
		ctx.fillStyle = lineGradient;   

		ctx.roundRect(254, window.HEIGHT - 15, 305 * window.player_attr.curr_exp / window.player_attr.max_exp, 12, 3, true, false);

		ctx.fillStyle = "yellow";
		ctx.textAlign = "left";
		ctx.textBaseline = "top";
		ctx.font = "24px liwen";
		ctx.fillText(window.player_attr.level, 35, window.HEIGHT - 31);

		ctx.fillStyle = "white";
		ctx.font = "14px liwen";
		ctx.textAlign = "right";
		ctx.fillText("[" + window.player_attr.curr_hp + "/" + window.player_attr.max_hp + "]", 390, window.HEIGHT - 33);
		ctx.fillText("[" + window.player_attr.curr_mp + "/" + window.player_attr.max_mp + "]", 560, window.HEIGHT - 33);
		ctx.fillText(window.player_attr.curr_exp + "[" + (window.player_attr.curr_exp / window.player_attr.max_exp * 100).toFixed(2) + "%]", 560, window.HEIGHT - 16);

		ctx.restore();
	}
}
