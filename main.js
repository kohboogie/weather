var piece;
var canvasId = 'myCanvas';

function init()
{
	piece = new Weather(document.getElementById(canvasId));
	//if no parent, we are not in an iframe so we handle resizing ourselves
	if (!window.parent || window.parent.onResize==null)
	{
		window.onresize = function() { onWindowResize(); };
		window.onorientationchange = function() { onWindowResize(); };
	}
	onWindowResize();
	//
	piece.start();
}

var viewSize;
function onWindowResize(instant)
{
	setSize(window.innerWidth, window.innerHeight);
}
function setSize(w,h)
{
	//can also be called from parent window
	var canvas = document.getElementById(canvasId);
	var s = window.devicePixelRatio;
	if (isNaN(s) || s==0) s = 1;
	if (getQueryParam("s")==1) s=1;//test!
	canvas.getContext('2d').scale(s,s);
	canvas.width = w*s;
	canvas.height = h*s;
	if (!Device.desktop)
	{
		canvas.width = Math.min(2046, canvas.width);
		canvas.height = Math.min(2046, canvas.height);
	}
	canvas.style.width = w+"px";
	canvas.style.height = h+"px";
	//log("setSize",w,h,s,w*s,h*s);
	if (piece) piece.setSize(w,h,s);
}

function getQueryParam(key)
{
	//if key is set but has no value or no '=', return false
	key = key.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
	var regex = new RegExp("[\\?&]"+key+"(=([^&#]*))*");
	var qs = regex.exec(window.location.href);
	if (qs == null) return null;
	else return qs[2]==null ? false : qs[2];
}

function log()
{
	if (window.console && window.console.log) window.console.log(arguments);
	log2.apply(null, arguments);
}
function log2()
{
	if (document.getElementById("output")) 
	{
		var str = "";
		for (var i=0;i<arguments.length;i++) 
		{
			if (i>0) str += ", ";
			str += arguments[i];
		}
		document.getElementById("output").innerHTML = str;
	}
}