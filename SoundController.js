(function(window) {

/**
* Simple sound controller using Buzz sound library.
**/
var SoundController = {};

SoundController.sounds = {};//cache

SoundController.init = function(sounds, forced)
{
	//preload sounds
	//sounds: [{id:'path/file_without_extension', loop:true}]	
	if (sounds)
	{
		for (var i=0;i<sounds.length;i++)
		{
			var item = sounds[i];
			var id = item.id;
			var params = {};
			params.preload = item.preload==null ? true : item.preload;
			params.autoplay = item.autoplay==null ? false : item.autoplay;
			params.formats = item.formats==null ? ["ogg", "mp3"]  : item.formats;
			params.loop = item.loop==null ? false  : item.loop;
			SoundController.sounds[id] = new buzz.sound(id, params);
			if (params.autoplay) SoundController.sounds[id].play();//because autoplay ignored on ios
			//SoundController.sounds[id].bind("timeupdate", SoundController.buildEventHandler(id));
			//SoundController.sounds[id].bind("ended", SoundController.buildEventHandler(id));
			//SoundController.sounds[id].bind("pause", SoundController.buildEventHandler(id));
			//SoundController.sounds[id].bind("abort", SoundController.buildEventHandler(id));
			//SoundController.sounds[id].bind("error", SoundController.buildEventHandler(id));
			//SoundController.sounds[id].bind("dataunavailable", SoundController.buildEventHandler(id));
			//SoundController.sounds[id].bind("canplay", SoundController.buildEventHandler(id));			
		}
	}
}
SoundController.buildEventHandler = function(id)
{
	return function(e) { console.log(id, e.type); };
}
SoundController.play = function(id, params)
{
	//log("SoundController.play",id);
	if (SoundController.getMute()) return;
	var sound = SoundController.sounds[id];//use preloaded sound
	if (sound) 
	{
		sound.play();
	}
	else
	{
		if (!params) params = {};
		params.autoplay = true;
		SoundController.sounds[id] = new buzz.sound(id, params);
		SoundController.sounds[id].play();
	}
	//if (SoundController.getMute()) SoundController.setMute(true);
}

SoundController.stop = function(id)
{
	var sound = SoundController.sounds[id];//use preloaded sound
	if (sound) sound.stop();
}

SoundController.setVolume = function(id, volume)
{
	var sound = SoundController.sounds[id];
	if (sound && !isNaN(volume)) sound.setVolume(volume);
}

SoundController.setMute = function(on)
{
	if (on) buzz.all().mute();
	else buzz.all().unmute();
	SoundController.muted = on;
	
}
SoundController.getMute = function()
{
	return SoundController.muted;
}

window.SoundController = SoundController;
}(window));