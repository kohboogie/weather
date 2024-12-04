var Config = {};

Config.debug = true;

Config.framerate = 60;//should be divisor of 60: 6,10,12,15,20,30,60

//Multiplication factor for size settings on small devices. 
//Applied to Config.drop.strokeWidth,Config.drop.sizeMin,Config.drop.sizeMax
Config.smallDeviceSizeFactor = .5;

//Multiplication factor for density when on device
Config.devicePerformanceFactor = .5;

Config.touch = {};
Config.touch.horizontalFactor = 1.2;//multiplier for touch devices used in calc'ing angle of rain
Config.touch.verticalFactor = 1.0;//multiplier for touch devices used in calc'ing 'mouse y'
Config.touch.horizontalThreshold = 50;//angles between which a swipe will be considered horizontal
Config.touch.verticalThreshold = 30;//angles between which a swipe will be considered vertical

Config.rain = {};
Config.rain.density = 2;//1 = on average 1 drop added each frame
Config.rain.densityFactorMin = 0;//min for multiplication factor based on mouse y
Config.rain.densityFactorMax = 6;
Config.rain.angle = 40;//degrees, angle of rain when mouse at window edge (0 in center)
Config.rain.angleFactorMin = .5;//min for multiplication factor based on mouse y
Config.rain.angleFactorMax = 1;
Config.rain.angleDecreaseFactor = .95;//determines speed at which horizontal angle will return to 0

Config.drop = {};
Config.drop.strokeWidth = 2;
Config.drop.speedMin = 60;//min offset per frame in pixels
Config.drop.speedMax = 90;
Config.drop.speedFactorMin = .5;//min for multiplication factor based on mouse y
Config.drop.speedFactorMax = 1;
Config.drop.sizeMin = 15;//min length of drop in pixels
Config.drop.sizeMax = 250;
Config.drop.sizeFactorMin = .5;//min for multiplication factor based on mouse y
Config.drop.sizeFactorMax = 1;


Config.lightning = {};
Config.lightning.threshold = .9;//percentage (0..1) of window height below which lightning can occur
Config.lightning.chance = .1;//chance that lightning starts, tested on each frame
Config.lightning.duration = 6;//duration of lightning in frames


Config.sound = {};
Config.sound.cutOff = .2;//percentage of screen height. threshold between birds and rain sound
Config.sound.thunderInterval = 5;//min interval between 2 thunders (and lightnings)

/*
KEYBOARD SHORTCUTS:
p : toggle pause
s : toggle sound
*/

//adjust some sizes according to screen size
//adjust some settings on devices
(function(window)
{
	if (Math.min(window.screen.width, window.screen.height) < 400)
	{
		var factor = Config.smallDeviceSizeFactor;
		Config.drop.strokeWidth *= factor;
		Config.drop.sizeMin *= factor;
		Config.drop.sizeMax *= factor;
	}
	if (!Device.desktop)
	{
		Config.rain.density *= Config.devicePerformanceFactor;
	}
}
(window));