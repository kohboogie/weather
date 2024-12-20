(function(window) {
	var Weather = function(canvas) {
		this.initialize(canvas);
	}
	var p = Weather.prototype = new Container();
	p.canvas;
	p.stage;
	p.tickCount = 0;//elapsed ticks
	p.ry = 0;
	p.drops = [];
	p.paused = false;
	p.fast = false;
	p.inverted = false;
	p.tickInvert;
	p.debugSpeedFactor = 1;
	p.soundCurrent = null;
	//
	p.initialize = function(canvas) 
	{
		Container.prototype.initialize.apply(this);
		SoundController.init([{id:"sounds/rain",loop:true},{id:"sounds/birds",loop:true},{id:"sounds/thunder"}]);
		//
		this.canvas = canvas;
		this.stage = new Stage(canvas);
		this.stage.addChild(this);
		//
		log("initialize :"+ window.screen.width, window.screen.height, window.devicePixelRatio, Config.drop.strokeWidth);
		
		this.initTouch();
		var that = this;
		window.onkeyup = function(e) { that.onKeyUp(e); };
		//
		this.setDropGraphics();
		this.addBackground();
		this.addRain();
	}
	
	p.initTouch = function()
	{
		this.touch = window.ontouchstart !== undefined;
		if (this.touch)
		{
			var that = this;
			this.canvas.addEventListener('touchstart', function(e) { that.onTouchStart(e); }, false);
			this.canvas.addEventListener('touchmove', function(e) { that.onTouchMove(e); }, false);
			this.canvas.addEventListener('touchend', function(e) { that.onTouchEnd(e); }, false);
			this.canvas.addEventListener('click', function(e) { that.onClick(e); }, false);
		}
	}
	
	p.touchRx = 0;
	p.touchRy = 0;
	p.touchLastPos;
	p.touchLastTime;
	p.onTouchStart = function(e)
	{
		e.preventDefault();
		var x = e.touches[0].pageX;
		var y = e.touches[0].pageY;
		//log("onTouchStart",x,y);
		this.touchLastPos = new Point(x,y);
		this.touchLastTime = new Date().getTime();
		this.touching = true;
	}
	p.onTouchMove = function(e)
	{
		e.preventDefault();
		var t = new Date().getTime();
		if (t-this.touchLastTime < 50) return;
		this.touchLastTime = t;
		var x = e.touches[0].pageX;
		var y = e.touches[0].pageY;
		var dx = x-this.touchLastPos.x;
		var dy = y-this.touchLastPos.y;
		//check if swipe movement angle is within bounds, for both directions
		var a = Math.abs(Math.atan2(dy,dx) / Math.PI * 180);//0..180
		if (a>=Config.touch.verticalThreshold && a<=180-Config.touch.verticalThreshold) 
		{
			this.touchRy = Math.max(0, Math.min(1, this.touchRy + dy * Config.touch.verticalFactor / this.canvas.height));
		}
		if (a<=Config.touch.horizontalThreshold || a>=180-Config.touch.horizontalThreshold)  
		{
			this.touchRx = Math.max(0, Math.min(1, this.touchRx + dx * Config.touch.horizontalFactor / this.canvas.width));
		}
		//
		this.touchLastPos = new Point(x,y);
		//set sound here because it should be user initiated on iOS+chrome
		this.updateSound(this.touchRy);
	}
	p.onTouchEnd = function(e)
	{
		e.preventDefault();
		this.touching = false;
		log("onTouchEnd");//somehow this log call is necessary to avoid hangup!
	}
	p.onClick = function(e)
	{
		log("onClick");
		SoundController.play("sounds/birds", {loop:true});
	}
	
	p.onKeyUp = function(e)
	{
		if (!Config.debug) return;
		var c = String.fromCharCode(e.which);
		if (c=="P") this.paused = !this.paused;
		else if (c=="S") SoundController.setMute(!SoundController.getMute());
		else if (c=="Z") this.debugSpeedFactor = this.debugSpeedFactor == 1 ? .1 : 1;
	}
	
	p.setSize = function(w,h,dpr)
	{
		this.x = this.canvas.width/2;
		this.y = this.canvas.height/2;		
		var ref = lib.background.prototype.nominalBounds;
		this.bg.scaleX = this.canvas.width/ref.width;//use canvas.width because this is corrected for devicepixelratio
		this.bg.scaleY = this.canvas.height/ref.height;
		//log("setSize",w,h,this.canvas.width,this.canvas.height,ref.width,ref.height, dpr, this.bg.x, this.bg.regX);
		this.updateBackground(this.ry, true);
		this.stage.update();
	}
	
	p.start = function()
	{
		Ticker.setFPS(Config.framerate);
		Ticker.addListener(this);
	}
	
	p.tick = function()
	{
		if (this.paused) return;
		this.tickCount += this.fast ? 12 : 1;
		//update bg only if mousey has changed
		var ry,rx;
		if (this.touch)
		{
			ry = this.touchRy;
			rx = this.touchRx;
		}
		else
		{
			if (this.mousePos)
			{
				var dx = this.stage.mouseX - this.mousePos.x;
				this.touchRx = Math.max(0, Math.min(1, this.touchRx + dx * Config.touch.horizontalFactor / this.canvas.width));
			}
			this.mousePos = new Point(this.stage.mouseX, this.stage.mouseY);
			//
			ry = this.stage.mouseY / this.canvas.height;
			//rx = this.stage.mouseX / this.canvas.width;
			rx = this.touchRx;
		}
		//touchRx back to .5
		if (!this.touching) this.touchRx = .5 - (.5-this.touchRx) * Config.rain.angleDecreaseFactor;
		//
		if (this.ry!=ry)
		{
			this.ry = ry;
			this.updateBackground(ry);
		}
		//update raindrops
		this.updateRain(rx, ry);
		//
		this.updateSound(ry);
		this.updateLightning(ry);
		//
		this.stage.update();
		log(this.ry);//do this trace because android browser doesnt seem to update screen properly without change in non-canvas element...
	}	
	
	p.addBackground = function()
	{
		if (this.bg) this.removeChild(this.bg);
		this.bg = new lib.background();
		this.bg.stop();
		this.addChild(this.bg);
	}
	
	p.updateSound = function(r)
	{
		var id = r>Config.sound.cutOff ? "sounds/rain" : "sounds/birds";
		var vol;
		if (id=="sounds/birds") vol = r / Config.sound.cutOff;
		else vol = (r-Config.sound.cutOff) / (1-Config.sound.cutOff);
		if (this.soundCurrent!=id)
		{
			SoundController.stop(this.soundCurrent);
			SoundController.play(id);
			this.soundCurrent = id;
			//log(r,id,vol);
		}
		SoundController.setVolume(this.soundCurrent, vol*100);
	}
	
	p.updateBackground = function(r, forceCache)
	{
		var ref = lib.background.prototype.nominalBounds;
		var t = this.bg.timeline.duration;
		var old = this.bg.currentFrame;
		var f = Math.round(t * r);
		if (old!=f || forceCache)
		{
			this.bg.gotoAndStop(f);
			var ref = lib.background.prototype.nominalBounds;
			var w = ref.width;//this.canvas.width;
			var h = ref.height;//this.canvas.height;
			this.bg.cache(-w/2,-h/2,w,h);
		}
	}
	
	
	p.addRain = function()
	{
		if (this.rain) this.removeChild(this.rain);
		this.rain = new Container();
		this.addChild(this.rain);
	}
	
	p.updateRain = function(rx, ry)
	{
		var h = .5 * this.canvas.height;
		var factor = Config.rain.angleFactorMin + ry * (Config.rain.angleFactorMax-Config.rain.angleFactorMin)
		var angle = Config.rain.angle * (rx*2-1) * factor;
		var angleR = angle/180 * Math.PI;
		//var dx = Config.rain.horizontalSpeed * rx;
		var remove = [];
		for (var i=0;i<this.drops.length;i++)
		{
			var drop = this.drops[i];
			drop.rotation = -angle;
			drop.dx += drop.v * Math.sin(angleR);
			drop.x = drop.dx + drop.rx * this.canvas.width;//unnecassary when no horizontal movement
			drop.y += drop.v * this.debugSpeedFactor;
			if (drop.y - drop.scaleY*100 > h) 
			{
				remove.push(i);
				this.rain.removeChild(drop);
			}
		}
		for (i=remove.length-1;i>=0;i--)
		{
			var n = remove[i];
			this.drops.splice(n,1);
		}
		//add new according to current density
		var factor = Config.rain.densityFactorMin + ry * (Config.rain.densityFactorMax-Config.rain.densityFactorMin);
		var n = Config.rain.density * factor;
		n = Math.floor(n) + (Math.random()<n-Math.floor(n) ? 1 : 0);
		for (var j=0;j<Math.floor(n);j++) this.addRainDrop(ry);
	}
	
	p.countId = 0;
	p.addRainDrop = function(r)
	{
		var drop = new Shape();
		drop.id = this.countId++;
		var margin = (Math.cos(Config.rain.angle/180*Math.PI) * this.canvas.height)/this.canvas.width;
		drop.rx = (1+2*margin) * Math.random()- (.5+margin);//relative x of drop on canvas
		drop.dx = 0;//for horizontal offset 
		var factor = Config.drop.speedFactorMin + r * (Config.drop.speedFactorMax-Config.drop.speedFactorMin);
		drop.v = factor * RandomUtil.getRandom(Config.drop.speedMin, Config.drop.speedMax);
		var factor = Config.drop.sizeFactorMin + r * (Config.drop.sizeFactorMax-Config.drop.sizeFactorMin);
		var size = Math.round(factor * RandomUtil.getRandom(Config.drop.sizeMin, Config.drop.sizeMax));
		drop.y = -.55 * this.canvas.height;//start a bit higher than top
		drop.x = drop.rx * this.canvas.width;
		drop.scaleY = size/100;
		drop.graphics = this.dropGraphics;
		this.rain.addChild(drop);
		this.drops.push(drop);
	}
	
	p.thunderLast = 0;
	
	p.updateLightning = function(r)
	{	
		if (r<Config.lightning.threshold)
		{ 
			if (this.inverted) this.invert(false);
		}
		else
		{
			if (!this.inverted)
			{
				var now = Math.floor(new Date().getTime() / 1000);
				if (now - this.thunderLast > Config.sound.thunderInterval && Math.random()<Config.lightning.chance) 
				{
					this.invert(true);
					SoundController.play("sounds/thunder");
					SoundController.sounds["sounds/thunder"].setTime(0);
					this.thunderLast = now;
					this.tickInvert = this.tickCount;
				}
			}
			else if (this.tickInvert+Config.lightning.duration<this.tickCount)
			{
				this.invert(false);
			}
		}
	}
	
	p.invert = function(on)
	{
		this.inverted = on;
		this.setDropGraphics();
		this.bg.visible = !this.inverted;
	}
	
	p.setDropGraphics = function()
	{
		if (!this.dropGraphics) this.dropGraphics = new Graphics();
		var g = this.dropGraphics;
		g.clear();
		var colors;
		if (this.inverted) colors = ["rgba(0,0,0,0)","rgba(0,0,0,255)"];
		else colors = ["rgba(255,255,255,0)","rgba(255,255,255,255)"]	
		g.beginLinearGradientStroke(colors,[0,1],0,-100,0,0).setStrokeStyle(Config.drop.strokeWidth,1);
		g.moveTo(0,-100).lineTo(0,0);
	}
	
	window.Weather = Weather;
}(window));

