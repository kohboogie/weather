if (!window.lib) { window.lib = {}; }

var p; // shortcut to reference prototypes

// stage content:



// symbols:
(lib.background = function(mode,startPosition,loop) {
if (loop == null) { loop = false; }	this.initialize(mode,startPosition,loop,{},true);

	// 1
	this.instance = new lib.Symbol1();

	this.timeline.addTween(Tween.get(this.instance).to({alpha:0},23).to({_off:true},1).wait(76));

	// 2
	this.instance_1 = new lib.Symbol2();

	this.timeline.addTween(Tween.get(this.instance_1).wait(24).to({alpha:0},24).to({_off:true},1).wait(51));

	// 3
	this.instance_2 = new lib.Symbol3();
	this.instance_2._off = true;

	this.timeline.addTween(Tween.get(this.instance_2).wait(24).to({_off:false},0).wait(25).to({alpha:0},24).to({_off:true},1).wait(26));

	// 4
	this.instance_3 = new lib.Symbol4();
	this.instance_3._off = true;

	this.timeline.addTween(Tween.get(this.instance_3).wait(49).to({_off:false},0).wait(25).to({alpha:0},25).wait(1));

	// 5
	this.instance_4 = new lib.Symbol5();
	this.instance_4._off = true;

	this.timeline.addTween(Tween.get(this.instance_4).wait(74).to({_off:false},0).wait(26));

}).prototype = p = new MovieClip();
p.nominalBounds = new Rectangle(-499.9,-299.9,1000,600);


(lib.Symbol1 = function() {
	this.initialize();

	// Layer 1
	this.shape = new Shape();
	this.shape.graphics.lf(["#ffffff","#fbfeff","#eefcff","#d9f8ff","#baf2fe","#90ebfd","#57e1fc","#00d5fa","#00caf9"],[0,0.145,0.282,0.412,0.541,0.667,0.788,0.91,1],0,300,0,-299.9).p("EBOHgu3MicPAAAMAAABdvMCcPAAAMAAAhdv").f();

	this.addChild(this.shape);
}).prototype = p = new Container();
p.nominalBounds = new Rectangle(-499.9,-299.9,1000,600);


(lib.Symbol2 = function() {
	this.initialize();

	// Layer 1
	this.shape = new Shape();
	this.shape.graphics.lf(["#ffffff","#f4fdff","#d7f8ff","#a6effe","#59e1fc","#00cff9","#00caf9","#0150ba"],[0,0.059,0.153,0.275,0.416,0.576,0.612,0.996],0,300,0,-299.9).p("EhOIAu4MCcPAAAMAAAhdvMicPAAAMAAABdv").f();

	this.addChild(this.shape);
}).prototype = p = new Container();
p.nominalBounds = new Rectangle(-499.9,-299.9,1000,600);


(lib.Symbol3 = function() {
	this.initialize();

	// Layer 1
	this.shape = new Shape();
	this.shape.graphics.lf(["#d2e6e8","#cbdce0","#b7c2ca","#9798a8","#9394a5","#65616a"],[0,0.125,0.329,0.592,0.612,0.996],0.1,300,0.1,-299.9).p("EhOHgu3MAAABdvMCcQAAAMAAAhdvMicQAAA").f();

	this.addChild(this.shape);
}).prototype = p = new Container();
p.nominalBounds = new Rectangle(-499.9,-299.9,1000,600);


(lib.Symbol4 = function() {
	this.initialize();

	// Layer 1
	this.shape = new Shape();
	this.shape.graphics.lf(["#b3b3b3","#9695ab","#716fa0","#544e97","#3e338f","#301b8a","#280687","#260086","#17222d"],[0,0.043,0.11,0.18,0.255,0.329,0.412,0.51,0.89],0,300,0,-299.9).p("EhOHAu4MCcPAAAMAAAhdvMicPAAAMAAABdv").f();

	this.addChild(this.shape);
}).prototype = p = new Container();
p.nominalBounds = new Rectangle(-499.9,-299.9,1000,600);


(lib.Symbol5 = function() {
	this.initialize();

	// Layer 1
	this.shape = new Shape();
	this.shape.graphics.f("#000000").p("EBOIgu3MicPAAAMAAABdvMCcPAAAMAAAhdv").f();

	this.addChild(this.shape);
}).prototype = p = new Container();
p.nominalBounds = new Rectangle(-499.9,-299.9,1000,600);