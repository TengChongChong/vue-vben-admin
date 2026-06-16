/**
 * Represents a canvas on which BPMN 2.0 constructs can be drawn.
 * 
 * Some of the icons used are licenced under a Creative Commons Attribution 2.5
 * License, see http://www.famfamfam.com/lab/icons/silk/
 * 
 * @see ProcessDiagramGenerator
 * @author (Java) Joram Barrez
 * @author (Javascript) Dmitry Farafonov
 */
 
//Color.Cornsilk

const ARROW_HEAD_SIMPLE = "simple";
const ARROW_HEAD_EMPTY = "empty";
const ARROW_HEAD_FILL = "FILL";
const MULTILINE_VERTICAL_ALIGN_TOP = "top";
const MULTILINE_VERTICAL_ALIGN_MIDDLE = "middle";
const MULTILINE_VERTICAL_ALIGN_BOTTOM = "bottom";
const MULTILINE_HORIZONTAL_ALIGN_LEFT = "start";
const MULTILINE_HORIZONTAL_ALIGN_MIDDLE = "middle";
const MULTILINE_HORIZONTAL_ALIGN_RIGHT = "end";

// Predefined sized
const TEXT_PADDING = 3;
const ARROW_WIDTH = 4;
const CONDITIONAL_INDICATOR_WIDTH = 16;
const MARKER_WIDTH = 12;
const ANNOTATION_TEXT_PADDING = 7;

// Colors
const TASK_COLOR = Color.OldLace; // original: Color.get(255, 255, 204);
const TASK_STROKE_COLOR = Color.black; /*Color.SlateGrey; */
//var EXPANDED_SUBPROCESS_ATTRS = Color.black; /*Color.SlateGrey; */
const BOUNDARY_EVENT_COLOR = Color.white;
const CONDITIONAL_INDICATOR_COLOR = Color.get(255, 255, 255);
const HIGHLIGHT_COLOR = Color.Firebrick1;
//var SEQUENCEFLOW_COLOR = Color.DimGrey;
const SEQUENCEFLOW_COLOR = Color.black;

const CATCHING_EVENT_COLOR = Color.black; /* Color.SlateGrey; */
const START_EVENT_COLOR = Color.get(251,251,251);
const START_EVENT_STROKE_COLOR = Color.black; /* Color.SlateGrey; */
const END_EVENT_COLOR = Color.get(251,251,251);
//var END_EVENT_STROKE_COLOR = Color.black;
const NONE_END_EVENT_COLOR = Color.Firebrick4;
const NONE_END_EVENT_STROKE_COLOR = Color.Firebrick4;
const ERROR_END_EVENT_COLOR = Color.Firebrick;
const ERROR_END_EVENT_STROKE_COLOR = Color.Firebrick;
//var LABEL_COLOR = Color.get(112, 146, 190);
const LABEL_COLOR = Color.get(72, 106, 150);

// Fonts
const NORMAL_FONT = {font: "10px Arial", opacity: 1, fill: Color.black};
const LABEL_FONT = {font: "11px Arial", "font-style":"italic", opacity: 1, "fill": LABEL_COLOR};
const LABEL_FONT_SMOOTH = {font: "10px Arial", "font-style":"italic", opacity: 1, "fill": LABEL_COLOR, stroke: LABEL_COLOR, "stroke-width":.4};
const TASK_FONT = {font: "11px Arial", opacity: 1, fill: Color.black};
const TASK_FONT_SMOOTH = {font: "11px Arial", opacity: 1, fill: Color.black, stroke: LABEL_COLOR, "stroke-width":.4};
const POOL_LANE_FONT = {font: "11px Arial", opacity: 1, fill: Color.black};
const EXPANDED_SUBPROCESS_FONT = {font: "11px Arial", opacity: 1, fill: Color.black};

// Strokes
const NORMAL_STROKE = 1;
const SEQUENCEFLOW_STROKE = 1.5;
const SEQUENCEFLOW_HIGHLIGHT_STROKE = 2;
const THICK_TASK_BORDER_STROKE = 2.5;
const GATEWAY_TYPE_STROKE = 3.2;
const END_EVENT_STROKE = NORMAL_STROKE+2;
const MULTI_INSTANCE_STROKE = 1.3;
const EVENT_SUBPROCESS_ATTRS = 	{"stroke": Color.black, "stroke-width": NORMAL_STROKE, "stroke-dasharray": ". "};
//var EXPANDED_SUBPROCESS_ATTRS = {"stroke": Color.black, "stroke-width": NORMAL_STROKE, "fill": Color.FloralWhite};
const EXPANDED_SUBPROCESS_ATTRS = {"stroke": Color.black, "stroke-width": NORMAL_STROKE, "fill": Color.WhiteSmoke};
const NON_INTERRUPTING_EVENT_STROKE = "- ";

const TASK_CORNER_ROUND = 10;
const EXPANDED_SUBPROCESS_CORNER_ROUND = 10;

// icons
const ICON_SIZE = 16;
const ICON_PADDING = 4;
const USERTASK_IMAGE = 		"images/deployer/user.png";
const SCRIPTTASK_IMAGE = 		"images/deployer/script.png";
const SERVICETASK_IMAGE = 	"images/deployer/service.png";
const RECEIVETASK_IMAGE = 	"images/deployer/receive.png";
const SENDTASK_IMAGE = 		"images/deployer/send.png";
const MANUALTASK_IMAGE = 		"images/deployer/manual.png";
const BUSINESS_RULE_TASK_IMAGE = "images/deployer/business_rule.png";
const TIMER_IMAGE = 			"images/deployer/timer.png";
const MESSAGE_CATCH_IMAGE = 	"images/deployer/message_catch.png";
const MESSAGE_THROW_IMAGE = 	"images/deployer/message_throw.png";
const ERROR_THROW_IMAGE = 	"images/deployer/error_throw.png";
const ERROR_CATCH_IMAGE = 	"images/deployer/error_catch.png";
const SIGNAL_CATCH_IMAGE = 	"images/deployer/signal_catch.png";
const SIGNAL_THROW_IMAGE = 	"images/deployer/signal_throw.png";
const MULTIPLE_CATCH_IMAGE = 	"images/deployer/multiple_catch.png";


const ObjectType = {
	ELLIPSE: "ellipse",
	FLOW: "flow",
	RECT: "rect",
	RHOMBUS: "rhombus"
};

function OBJ(type){
	this.c = null;
	this.type = type;
	this.nestedElements = [];
};
OBJ.prototype = {
	
};

const CONNECTION_TYPE = {
	SEQUENCE_FLOW: "sequence_flow",
	MESSAGE_FLOW: "message_flow",
	ASSOCIATION: "association"
};

const ProcessDiagramCanvas = function(){
};
ProcessDiagramCanvas.prototype = {
// var DefaultProcessDiagramCanvas = {
	canvasHolder: "holder",
	canvasWidth: 0, 
	canvasHeight: 0,
	paint: Color.black,
	strokeWidth: 0,
	font: null,
	fontSmoothing: null,
	
	g: null,
	ninjaPaper: null,
	
	objects: [],
	
	processDefinitionId: null,
	activity: null,
	
	frame: null,
	
	
	debug: false,
	
	/**
	* Creates an empty canvas with given width and height.
	*/
	init: function(width, height, processDefinitionId){
		this.canvasWidth = width;
		this.canvasHeight = height;
		
		// TODO: name it as 'canvasName'
		if (!processDefinitionId)
			processDefinitionId = "holder";
		
		this.processDefinitionId = processDefinitionId;
		this.canvasHolder = this.processDefinitionId;

		const h = document.getElementById(this.canvasHolder);
		if (!h) return;
		
		h.style.width = this.canvasWidth;
		h.style.height = this.canvasHeight;
		
		this.g = Raphael(this.canvasHolder);
		this.g.clear();
	
		//this.setPaint(Color.DimGrey);
		this.setPaint(Color.black);
		//this.setPaint(Color.white);
		this.setStroke(NORMAL_STROKE);
		
		//this.setFont("Arial", 11);
		this.setFont(NORMAL_FONT);
		//this.font = this.g.getFont("Arial");
		
		this.fontSmoothing = true;
		
		// ninja!
		const RaphaelOriginal = Raphael;
		this.ninjaPaper =(function (local_raphael) {
			const paper = local_raphael(1, 1, 1, 1, processDefinitionId);
			return paper;
		})(Raphael.ninja());
		Raphael = RaphaelOriginal;
	},
	setPaint: function(color){
		this.paint = color;
	},
	getPaint: function(){
		return this.paint;
	},
	setStroke: function(strokeWidth){
		this.strokeWidth = strokeWidth;
	},
	getStroke: function(){
		return this.strokeWidth;
	},
	/*
	setFont: function(family, weight, style, stretch){
		this.font = this.g.getFont(family, weight);
	},
	*/
	setFont: function(font){
		this.font = font;
	},
	getFont: function(){
		return this.font;
	},
	drawShaddow: function(object){
		const border = object.clone();
		border.attr({"stroke-width": this.strokeWidth + 6, 
					"stroke": Color.white,
					"fill": Color.white,
					"opacity": 1,
					"stroke-dasharray":null});
		//border.toBack();
		object.toFront();
		
		return border;
	},
	
	setConextObject: function(obj){
		this.contextObject = obj;
	},
	getConextObject: function(){
		return this.contextObject;
	},
	setContextToElement: function(object){
		const contextObject = this.getConextObject();
		object.id = contextObject.id;
		object.data("contextObject", contextObject);
	},
	onClick: function(event, instance, element){
	  const overlay = element;
	  const set = overlay.data("set");
	  const contextObject = overlay.data("contextObject");
	  //console.log("["+contextObject.getProperty("type")+"], activityId: " + contextObject.getId());
	  if (ProcessDiagramGenerator.options && ProcessDiagramGenerator.options.on && ProcessDiagramGenerator.options.on.click) {
	    const args = [instance, element, contextObject];
	    ProcessDiagramGenerator.options.on.click.apply(event, args);
	  }
	},
	onRightClick: function(event, instance, element){
	  const overlay = element;
	  const set = overlay.data("set");
	  const contextObject = overlay.data("contextObject");
	  //console.log("[%s], activityId: %s (RIGHTCLICK)", contextObject.getProperty("type"), contextObject.getId());

	  if (ProcessDiagramGenerator.options && ProcessDiagramGenerator.options.on && ProcessDiagramGenerator.options.on.rightClick) {
	    const args = [instance, element, contextObject];
	    ProcessDiagramGenerator.options.on.rightClick.apply(event, args);
	  }
	},
	onHoverIn: function(event, instance, element){
	  const overlay = element;
	  const set = overlay.data("set");
	  const contextObject = overlay.data("contextObject");

	  const border = instance.g.getById(contextObject.id + "_border");
	  border.attr("opacity", 0.3);

	  // provide callback
	  if (ProcessDiagramGenerator.options && ProcessDiagramGenerator.options.on && ProcessDiagramGenerator.options.on.over) {
	    const args = [instance, element, contextObject];
	    ProcessDiagramGenerator.options.on.over.apply(event, args);
	  }
	 },
	 onHoverOut: function(event, instance, element){
	   const overlay = element;
	   const set = overlay.data("set");
	   const contextObject = overlay.data("contextObject");

	   const border = instance.g.getById(contextObject.id + "_border");
	   border.attr("opacity", 0.0);
	   // provide callback
	   if (ProcessDiagramGenerator.options && ProcessDiagramGenerator.options.on && ProcessDiagramGenerator.options.on.out) {
	     const args = [instance, element, contextObject];
	     ProcessDiagramGenerator.options.on.out.apply(event, args);
	   }
	 },
	 addHandlers: function(set, x, y, width, height, type){
	   const contextObject = this.getConextObject();

	   const cx = x+width/2, cy = y+height/2;
	   if (type == "event") {
	     var border = this.g.ellipse(cx, cy, width/2+4, height/2+4);
	     var overlay = this.g.ellipse(cx, cy, width/2, height/2);
	   } else if (type == "gateway") {
	     // rhombus
	     var border = this.g.path( `M${  x - 4  } ${  y + (height / 2) 
	         }L${  x + (width / 2)  } ${  y + height + 4 
	         }L${  x + width + 4  } ${  y + (height / 2) 
	         }L${  x + (width / 2)  } ${  y - 4 
	         }z` );
	     var overlay = this.g.path(  `M${  x  } ${  y + (height / 2) 
	         }L${  x + (width / 2)  } ${  y + height 
	         }L${  x + width  } ${  y + (height / 2) 
	         }L${  x + (width / 2)  } ${  y 
	         }z` );
	   } else if (type == "task") {
	     var border = this.g.rect(x - 4, y - 4, width+9, height+9, TASK_CORNER_ROUND+4);
	     var overlay = this.g.rect(x, y, width, height, TASK_CORNER_ROUND);
	   }

	   border.attr({stroke: Color.get(132,112,255)/*Color.Tan1*/,"stroke-width": 4, opacity: 0.0});
	   border.id = `${contextObject.id  }_border`;

	   set.push(border);

	   overlay.attr({stroke: Color.Orange,"stroke-width": 3, fill: Color.get(0,0,0), opacity: 0.0, cursor: "hand"});
	   overlay.data("set",set);
	   overlay.id = contextObject.id;
	   overlay.data("contextObject",contextObject);

	   const instance = this;
	   overlay.mousedown(function(event){if (event.button == 2) instance.onRightClick(event, instance, this);});
	   overlay.click(function(event){instance.onClick(event, instance, this);});
	   overlay.hover(function(event){instance.onHoverIn(event, instance, this);}, function(event){instance.onHoverOut(event, instance, this);});
	 },
	
	/*
	 * Start Events:
	 * 
	 *	drawNoneStartEvent
	 *	drawTimerStartEvent
	 *	drawMessageStartEvent
	 *	drawErrorStartEvent
	 *	drawSignalStartEvent
	 *	_drawStartEventImage
	 *	_drawStartEvent
	 */
	 
	drawNoneStartEvent: function(x, y, width, height) {
	  this.g.setStart();
	  
		const isInterrupting = undefined;
		this._drawStartEvent(x, y, width, height, isInterrupting, null);
		
		const set = this.g.setFinish();
		this.addHandlers(set, x, y, width, height, "event");
	},
	
	drawTimerStartEvent: function(x, y, width, height, isInterrupting, name) {
	  this.g.setStart();
	  
		this._drawStartEvent(x, y, width, height, isInterrupting, null);
		
		const cx = x + width/2 - this.getStroke()/4;
		const cy = y + height/2 - this.getStroke()/4;
		
		const w = width*.9;// - this.getStroke()*2;
		const h = height*.9;// - this.getStroke()*2;
		
		this._drawClock(cx, cy, w, h);
		
		if (this.gebug)
			const center = this.g.ellipse(cx, cy, 3, 3).attr({stroke:"none", fill: Color.green});
		
		const set = this.g.setFinish();
		this.addHandlers(set, x, y, width, height, "event");
	},
	
	drawMessageStartEvent: function(x, y, width, height, isInterrupting, name) {
	  this.g.setStart();
	  
		this._drawStartEvent(x, y, width, height, isInterrupting, null);
		
		this._drawStartEventImage(x, y, width, height, MESSAGE_CATCH_IMAGE);
		
		const set = this.g.setFinish();
    this.addHandlers(set, x, y, width, height, "event");
	},
	
	drawErrorStartEvent: function(x, y, width, height, name) {
	  this.g.setStart();
		const isInterrupting = undefined;
		this._drawStartEvent(x, y, width, height, isInterrupting);

		this._drawStartEventImage(x, y, width, height, ERROR_CATCH_IMAGE);
		
		const set = this.g.setFinish();
    this.addHandlers(set, x, y, width, height, "event");
	},
	
	drawSignalStartEvent: function(x, y, width, height, isInterrupting, name) {
	  this.g.setStart();
		this._drawStartEvent(x, y, width, height, isInterrupting, null);
		
		this._drawStartEventImage(x, y, width, height, SIGNAL_CATCH_IMAGE);
		
		const set = this.g.setFinish();
    this.addHandlers(set, x, y, width, height, "event");
	},
	
	drawMultipleStartEvent: function(x, y, width, height, isInterrupting, name) {
	  this.g.setStart();
		
	  this._drawStartEvent(x, y, width, height, isInterrupting, null);
		
		const cx = x + width/2 - this.getStroke()/4;
		const cy = y + height/2 - this.getStroke()/4;
		
		const w = width*1;
		const h = height*1;
		
		this._drawPentagon(cx, cy, w, h);
		
		const set = this.g.setFinish();
    this.addHandlers(set, x, y, width, height, "event");
	},
	
	_drawStartEventImage: function(x, y, width, height, image){
		const cx = x + width/2 - this.getStroke()/2;
		const cy = y + height/2 - this.getStroke()/2;
		
		const w = width*.65;// - this.getStroke()*2;
		const h = height*.65;// - this.getStroke()*2;
		
		const img = this.g.image(image, cx-w/2, cy-h/2, w, h);
	},
	_drawStartEvent: function(x, y, width, height, isInterrupting){
		const originalPaint = this.getPaint();
		if (typeof(START_EVENT_STROKE_COLOR) !== "undefined")
			this.setPaint(START_EVENT_STROKE_COLOR);
		
		
		width -= this.strokeWidth / 2;
		height -= this.strokeWidth / 2;
		
		x = x + width/2;
		y = y + height/2;
		
		const circle = this.g.ellipse(x, y, width/2, height/2);
		
		circle.attr({"stroke-width": this.strokeWidth, 
				"stroke": this.paint, 
				//"stroke": START_EVENT_STROKE_COLOR,
				"fill": START_EVENT_COLOR});
				
		// white shaddow
		this.drawShaddow(circle);
		
		if (isInterrupting!=null && isInterrupting!=undefined && !isInterrupting) 
			circle.attr({"stroke-dasharray": NON_INTERRUPTING_EVENT_STROKE});

		this.setContextToElement(circle);
		
		
		this.setPaint(originalPaint);
	},
	
	/*
	 * End Events:
	 * 
	 *	drawNoneEndEvent
	 *	drawErrorEndEvent
	 *	drawMessageEndEvent
	 *	drawSignalEndEvent
	 *	drawMultipleEndEvent
	 *  _drawEndEventImage
	 *	_drawNoneEndEvent
	 */
	 
	drawNoneEndEvent: function(x, y, width, height) {
	  this.g.setStart();
	  
		this._drawNoneEndEvent(x, y, width, height, null, "noneEndEvent");
		
		const set = this.g.setFinish();
    this.addHandlers(set, x, y, width, height, "event");
	},
	
	drawErrorEndEvent: function(x, y, width, height) {
	  this.g.setStart();
		const type = "errorEndEvent";
		this._drawNoneEndEvent(x, y, width, height, null, type);
		
		this._drawEndEventImage(x, y, width, height, ERROR_THROW_IMAGE);
		
		const set = this.g.setFinish();
    this.addHandlers(set, x, y, width, height, "event");
	},
	
	drawMessageEndEvent: function(x, y, width, height, name) {
	  this.g.setStart();
		const type = "errorEndEvent";
		this._drawNoneEndEvent(x, y, width, height, null, type);
		
		this._drawEndEventImage(x, y, width, height, MESSAGE_THROW_IMAGE);
		
		const set = this.g.setFinish();
    this.addHandlers(set, x, y, width, height, "event");
	},
	
	drawSignalEndEvent: function(x, y, width, height, name) {
	  this.g.setStart();
		const type = "errorEndEvent";
		this._drawNoneEndEvent(x, y, width, height, null, type);
		
		this._drawEndEventImage(x, y, width, height, SIGNAL_THROW_IMAGE);
		
		const set = this.g.setFinish();
    this.addHandlers(set, x, y, width, height, "event");
	},
	
	drawMultipleEndEvent: function(x, y, width, height, name) {
	  this.g.setStart();
		const type = "errorEndEvent";
		this._drawNoneEndEvent(x, y, width, height, null, type);
		
		const cx = x + width/2;// - this.getStroke();
		const cy = y + height/2;// - this.getStroke();
		
		const w = width*1;
		const h = height*1;
		
		const filled = true;
		this._drawPentagon(cx, cy, w, h, filled);
		
		const set = this.g.setFinish();
    this.addHandlers(set, x, y, width, height, "event");
	},
	
	drawTerminateEndEvent: function(x, y, width, height) {
	  this.g.setStart();
		const type = "errorEndEvent";
		this._drawNoneEndEvent(x, y, width, height, null, type);
		
		const cx = x + width/2;// - this.getStroke()/2;
		const cy = y + height/2;// - this.getStroke()/2;
		
		const w = width/2*.6;
		const h = height/2*.6;
		
		const circle = this.g.ellipse(cx, cy, w, h).attr({fill: Color.black});
		
		const set = this.g.setFinish();
    this.addHandlers(set, x, y, width, height, "event");
	},
	
	_drawEndEventImage: function(x, y, width, height, image){
		const cx = x + width/2 - this.getStroke()/2;
		const cy = y + height/2 - this.getStroke()/2;
		
		const w = width*.65;
		const h = height*.65;
		
		const img = this.g.image(image, cx-w/2, cy-h/2, w, h);
	},
	
	_drawNoneEndEvent: function(x, y, width, height, image, type) {
		const originalPaint = this.getPaint();
		if (typeof(CATCHING_EVENT_COLOR) !== "undefined")
			this.setPaint(CATCHING_EVENT_COLOR);
			
		let strokeColor = this.getPaint();
		let fillColor = this.getPaint();
		
		if (type == "errorEndEvent") {
			strokeColor = ERROR_END_EVENT_STROKE_COLOR;
			fillColor = ERROR_END_EVENT_COLOR;
		} else if (type == "noneEndEvent") {
			strokeColor = NONE_END_EVENT_STROKE_COLOR;
			fillColor = NONE_END_EVENT_COLOR;
		} else 
			
		// event circles
		width -= this.strokeWidth / 2;
		height -= this.strokeWidth / 2;
		
		x = x + width/2;// + this.strokeWidth/2;
		y = y + width/2;// + this.strokeWidth/2;
		
		// outerCircle
		const outerCircle = this.g.ellipse(x, y, width/2, height/2);
		
		// white shaddow
		const shaddow = this.drawShaddow(outerCircle);
		
		outerCircle.attr({"stroke-width": this.strokeWidth,
						"stroke": strokeColor,
						"fill": fillColor});
		
		const innerCircleX = x;
		const innerCircleY = y;
		const innerCircleWidth = width/2 - 2;
		const innerCircleHeight = height/2 - 2;
		const innerCircle = this.g.ellipse(innerCircleX, innerCircleY, innerCircleWidth, innerCircleHeight);
		innerCircle.attr({"stroke-width": this.strokeWidth,
				"stroke": strokeColor,
				"fill": Color.white});

		// TODO: implement it
		//var originalPaint = this.getPaint();
		//this.g.setPaint(BOUNDARY_EVENT_COLOR);
		
		this.setPaint(originalPaint);
	},
	
	/*
	 * Catching Events:
	 * 
	 *	drawCatchingTimerEvent
	 *	drawCatchingErrorEvent
	 *	drawCatchingSignalEvent
	 *  drawCatchingMessageEvent
	 *	drawCatchingMultipleEvent
	 *	_drawCatchingEventImage
	 *	_drawCatchingEvent
	 */
	 
	
	drawCatchingTimerEvent: function(x, y, width, height, isInterrupting, name) {
	  this.g.setStart();
		this._drawCatchingEvent(x, y, width, height, isInterrupting, null);
		
		const innerCircleWidth = width - 4;
		const innerCircleHeight = height - 4;
		
		const cx = x + width/2 - this.getStroke()/4;
		const cy = y + height/2 - this.getStroke()/4;
		
		const w = innerCircleWidth*.9;// - this.getStroke()*2;
		const h = innerCircleHeight*.9;// - this.getStroke()*2;
		
		this._drawClock(cx, cy, w, h);
		
		const set = this.g.setFinish();
		this.addHandlers(set, x, y, width, height, "event");
	},

	drawCatchingErrorEvent: function(x, y, width, height, isInterrupting, name) {
	  this.g.setStart();
		this._drawCatchingEvent(x, y, width, height, isInterrupting, null);
		
		this._drawCatchingEventImage(x, y, width, height, ERROR_CATCH_IMAGE);
		
		const set = this.g.setFinish();
    this.addHandlers(set, x, y, width, height, "event");
	},
	
	drawCatchingSignalEvent: function(x, y, width, height, isInterrupting, name) {
	  this.g.setStart();
		this._drawCatchingEvent(x, y, width, height, isInterrupting, null);
		
		this._drawCatchingEventImage(x, y, width, height, SIGNAL_CATCH_IMAGE);
		
		const set = this.g.setFinish();
    this.addHandlers(set, x, y, width, height, "event");
	},
	
	drawCatchingMessageEvent: function(x, y, width, height, isInterrupting, name) {
	  this.g.setStart();
		this._drawCatchingEvent(x, y, width, height, isInterrupting, null);
		
		this._drawCatchingEventImage(x, y, width, height, MESSAGE_CATCH_IMAGE);
		
		const set = this.g.setFinish();
    this.addHandlers(set, x, y, width, height, "event");
	},
	
	drawCatchingMultipleEvent: function(x, y, width, height, isInterrupting, name) {
	  this.g.setStart();
		this._drawCatchingEvent(x, y, width, height, isInterrupting, null);
		
		const cx = x + width/2 - this.getStroke();
		const cy = y + height/2 - this.getStroke();
		
		const w = width*.9;
		const h = height*.9;
		
		this._drawPentagon(cx, cy, w, h);
		
		const set = this.g.setFinish();
    this.addHandlers(set, x, y, width, height, "event");
	},
	
	_drawCatchingEventImage: function(x, y, width, height, image){
		const innerCircleWidth = width - 4;
		const innerCircleHeight = height - 4;
		
		const cx = x + width/2 - this.getStroke()/2;
		const cy = y + height/2 - this.getStroke()/2;
		
		const w = innerCircleWidth*.6;// - this.getStroke()*2;
		const h = innerCircleHeight*.6;// - this.getStroke()*2;
		
		const img = this.g.image(image, cx-w/2, cy-h/2, w, h);
	},
	
	_drawCatchingEvent: function(x, y, width, height, isInterrupting, image) {
		const originalPaint = this.getPaint();
		if (typeof(CATCHING_EVENT_COLOR) !== "undefined")
			this.setPaint(CATCHING_EVENT_COLOR);
			
		// event circles
		width -= this.strokeWidth / 2;
		height -= this.strokeWidth / 2;
		
		x = x + width/2;// + this.strokeWidth/2;
		y = y + width/2;// + this.strokeWidth/2;
		
		// outerCircle
		const outerCircle = this.g.ellipse(x, y, width/2, height/2);
		
		// white shaddow
		const shaddow = this.drawShaddow(outerCircle);
		
		//console.log("isInterrupting: " + isInterrupting, "x:" , x, "y:",y);
		if (isInterrupting!=null && isInterrupting!=undefined && !isInterrupting) 
			outerCircle.attr({"stroke-dasharray": NON_INTERRUPTING_EVENT_STROKE});
		
		outerCircle.attr({"stroke-width": this.strokeWidth,
						"stroke": this.getPaint(),
						"fill": BOUNDARY_EVENT_COLOR});
		
		const innerCircleX = x;
		const innerCircleY = y;
		const innerCircleRadiusX = width/2 - 4;
		const innerCircleRadiusY = height/2 - 4;
		const innerCircle = this.g.ellipse(innerCircleX, innerCircleY, innerCircleRadiusX, innerCircleRadiusY);
		innerCircle.attr({"stroke-width": this.strokeWidth,
				"stroke": this.getPaint()});

		if (image) {
			const imageWidth = imageHeight = innerCircleRadiusX*1.2 + this.getStroke()*2;
			const imageX = innerCircleX-imageWidth/2 - this.strokeWidth/2;
			const imageY = innerCircleY-imageWidth/2 - this.strokeWidth/2;
			const img = this.g.image(image, imageX, imageY, imageWidth, imageHeight);
		}
		
		this.setPaint(originalPaint);
		
		const set = this.g.set();
		set.push(outerCircle, innerCircle, shaddow);
		this.setContextToElement(outerCircle);
		
		// TODO: add shapes to set
		
		/*
		var st = this.g.set();
		st.push(
			this.g.ellipse(innerCircleX, innerCircleY, 2, 2),
			this.g.ellipse(imageX, imageY, 2, 2)
		);
		st.attr({fill: "red", "stroke-width":0});
		*/
	},
	
	/*
	 * Catching Events:
	 * 
	 *	drawThrowingNoneEvent
	 *	drawThrowingSignalEvent
	 *	drawThrowingMessageEvent
	 *	drawThrowingMultipleEvent
	 */
	
	drawThrowingNoneEvent: function(x, y, width, height, name) {
	  this.g.setStart();
		this._drawCatchingEvent(x, y, width, height, null, null);
		
		const set = this.g.setFinish();
    this.addHandlers(set, x, y, width, height, "event");
	},
	
	drawThrowingSignalEvent: function(x, y, width, height, name) {
	  this.g.setStart();
		this._drawCatchingEvent(x, y, width, height, null, null);
		
		this._drawCatchingEventImage(x, y, width, height, SIGNAL_THROW_IMAGE);
		
		const set = this.g.setFinish();
    this.addHandlers(set, x, y, width, height, "event");
	},
	
	drawThrowingMessageEvent: function(x, y, width, height, name) {
	  this.g.setStart();
		this._drawCatchingEvent(x, y, width, height, null, null);
		
		this._drawCatchingEventImage(x, y, width, height, MESSAGE_THROW_IMAGE);
		
		const set = this.g.setFinish();
    this.addHandlers(set, x, y, width, height, "event");
	},
	
	drawThrowingMultipleEvent: function(x, y, width, height, name) {
	  this.g.setStart();
		this._drawCatchingEvent(x, y, width, height, null, null);
		
		const cx = x + width/2 - this.getStroke();
		const cy = y + height/2 - this.getStroke();
		
		const w = width*.9;
		const h = height*.9;
		
		const filled = true;
		this._drawPentagon(cx, cy, w, h, filled);
		
		const set = this.g.setFinish();
    this.addHandlers(set, x, y, width, height, "event");
	},
	
	/*
	 * Draw flows:
	 * 
	 *  _connectFlowToActivity
	 *	_drawFlow
	 *	_drawDefaultSequenceFlowIndicator
	 *	drawSequenceflow
	 *	drawMessageflow
	 *	drawAssociation
	 *	_drawCircleTail
	 *	_drawArrowHead
	 *	_drawConditionalSequenceFlowIndicator
	 *	drawSequenceflowWithoutArrow
	 */
	 
	_connectFlowToActivity: function(sourceActivityId, destinationActivityId, waypoints){
		const sourceActivity = this.g.getById(sourceActivityId);
		const destinationActivity = this.g.getById(destinationActivityId);
		if (sourceActivity == null || destinationActivity == null) {
			if (sourceActivity == null)
				console.error(`source activity[${sourceActivityId}] not found`);
			else
				console.error(`destination activity[${destinationActivityId}] not found`);
			return null;
		}
			const bbSourceActivity = sourceActivity.getBBox()
			const bbDestinationActivity = destinationActivity.getBBox()
			
			const path = [];
			const newWaypoints = [];
			for(let i = 0; i < waypoints.length; i++){
				let pathType = ""
				if (i==0)
					pathType = "M";
				else 
					pathType = "L";
					
				path.push([pathType, waypoints[i].x, waypoints[i].y]);
				newWaypoints.push({x:waypoints[i].x, y:waypoints[i].y});
			}

			const ninjaPathSourceActivity = this.ninjaPaper.path(sourceActivity.realPath);
			const ninjaPathDestinationActivity = this.ninjaPaper.path(destinationActivity.realPath);
			const ninjaBBSourceActivity = ninjaPathSourceActivity.getBBox();
			const ninjaBBDestinationActivity = ninjaPathDestinationActivity.getBBox();
			
			// set target of the flow to the center of the taskObject
			const newPath = path;
			const originalSource = {x: newPath[0][1], y: newPath[0][2]};
			const originalTarget = {x: newPath[newPath.length-1][1], y: newPath[newPath.length-1][2]};
			newPath[0][1] = ninjaBBSourceActivity.x + (ninjaBBSourceActivity.x2 - ninjaBBSourceActivity.x ) / 2;
			newPath[0][2] = ninjaBBSourceActivity.y + (ninjaBBSourceActivity.y2 - ninjaBBSourceActivity.y ) / 2;
			newPath[newPath.length-1][1] = ninjaBBDestinationActivity.x + (ninjaBBDestinationActivity.x2 - ninjaBBDestinationActivity.x ) / 2;
			newPath[newPath.length-1][2] = ninjaBBDestinationActivity.y + (ninjaBBDestinationActivity.y2 - ninjaBBDestinationActivity.y ) / 2;
			
			const ninjaPathFlowObject = this.ninjaPaper.path(newPath);
			const ninjaBBFlowObject = ninjaPathFlowObject.getBBox();
			
			const intersectionsSource = Raphael.pathIntersection(ninjaPathSourceActivity.realPath, ninjaPathFlowObject.realPath);
			const intersectionsDestination = Raphael.pathIntersection(ninjaPathDestinationActivity.realPath, ninjaPathFlowObject.realPath);
			const intersectionSource = intersectionsSource.pop();
			const intersectionDestination = intersectionsDestination.pop();
			
			if (intersectionSource != undefined) {
				if (this.gebug) {
					var diameter = 5;
					const dotOriginal = this.g.ellipse(originalSource.x, originalSource.y, diameter, diameter).attr({"fill": Color.white, "stroke": Color.Pink});
					const dot = this.g.ellipse(intersectionSource.x, intersectionSource.y, diameter, diameter).attr({"fill": Color.white, "stroke": Color.Green});
				}
				
				newWaypoints[0].x = intersectionSource.x;
				newWaypoints[0].y = intersectionSource.y;
			}
			if (intersectionDestination != undefined) {
				if (this.gebug) {
					var diameter = 5;
					const dotOriginal = this.g.ellipse(originalTarget.x, originalTarget.y, diameter, diameter).attr({"fill": Color.white, "stroke": Color.Red});
					const dot = this.g.ellipse(intersectionDestination.x, intersectionDestination.y, diameter, diameter).attr({"fill": Color.white, "stroke": Color.Blue});
				}
				
				newWaypoints[newWaypoints.length-1].x = intersectionDestination.x;
				newWaypoints[newWaypoints.length-1].y = intersectionDestination.y;
			}
			
			this.ninjaPaper.clear();
		return newWaypoints;
	},
	 
	_drawFlow: function(waypoints, conditional, isDefault, highLighted, withArrowHead, connectionType){
		const originalPaint = this.getPaint();
		const originalStroke = this.getStroke();
		
		this.setPaint(SEQUENCEFLOW_COLOR);
		this.setStroke(SEQUENCEFLOW_STROKE);
		
		if (highLighted) {
			this.setPaint(HIGHLIGHT_COLOR);
			this.setStroke(SEQUENCEFLOW_HIGHLIGHT_STROKE);
		}

// TODO: generate polylineId or do something!!
		const uuid = Raphael.createUUID();
		
		const contextObject = this.getConextObject();
		const newWaypoints = waypoints;
		if (contextObject) {
			var newWaypoints = this._connectFlowToActivity(contextObject.sourceActivityId, contextObject.destinationActivityId, waypoints);
			
			if (!newWaypoints) {
				console.error(`Error draw flow from '${contextObject.sourceActivityId}' to '${contextObject.destinationActivityId}' `);
				return;
			}
		}
		const polyline = new Polyline(uuid, newWaypoints, this.getStroke());
		//var polyline = new Polyline(waypoints, 3);
		
		polyline.element = this.g.path(polyline.path);
		polyline.element.attr("stroke-width", this.getStroke());
		polyline.element.attr("stroke", this.getPaint());
			
		if (contextObject) {
			polyline.element.id = contextObject.id;
			polyline.element.data("contextObject", contextObject);
		} else {
			polyline.element.id = uuid;
		}
		
		
		/*
		polyline.element.mouseover(function(){
			this.attr({"stroke-width": NORMAL_STROKE + 2});
		}).mouseout(function(){
			this.attr({"stroke-width": NORMAL_STROKE});
		});
		*/
		
		const last = polyline.getAnchorsCount()-1;
		const x = polyline.getAnchor(last).x;
		const y = polyline.getAnchor(last).y;
		//var c = this.g.ellipse(x, y, 5, 5);
		
		const lastLineIndex = polyline.getLinesCount()-1;
		const line = polyline.getLine(lastLineIndex);
		const firstLine = polyline.getLine(0);
		
		let arrowHead = null,
			circleTail = null,
			defaultSequenceFlowIndicator = null,
			conditionalSequenceFlowIndicator = null;

		if (connectionType == CONNECTION_TYPE.MESSAGE_FLOW) {
			circleTail = this._drawCircleTail(firstLine, connectionType);
		}
		if(withArrowHead)
			arrowHead = this._drawArrowHead(line, connectionType);
		
		//console.log("isDefault: ", isDefault, ", isDefaultConditionAvailable: ", polyline.isDefaultConditionAvailable);
		if (isDefault && polyline.isDefaultConditionAvailable) {
			//var angle = polyline.getLineAngle(0);
			//console.log("firstLine", firstLine);
			defaultSequenceFlowIndicator = this._drawDefaultSequenceFlowIndicator(firstLine);
		}
		
		if (conditional) {
			conditionalSequenceFlowIndicator = this._drawConditionalSequenceFlowIndicator(firstLine);
		}

        // draw flow name
        const flowName = contextObject.name;
        if (flowName) {
            const xPointArray = contextObject.xPointArray;
            const yPointArray = contextObject.yPointArray;
            let textX = xPointArray[0] < xPointArray[1] ? xPointArray[0] : xPointArray[1];
            let textY = yPointArray[0] < yPointArray[1] ? yPointArray[1] : yPointArray[0];
            // fix xy
            textX += 20;
            textY -= 10;
            this.g.text(textX, textY, flowName).attr(LABEL_FONT);
        }
		
		const st = this.g.set();
		st.push(polyline.element, arrowHead, circleTail, conditionalSequenceFlowIndicator);
		polyline.element.data("set", st);
		polyline.element.data("withArrowHead", withArrowHead);
		
		const polyCloneAttrNormal = {"stroke-width": this.getStroke() + 5, stroke: Color.get(132,112,255), opacity: 0.0, cursor: "hand"};
		const polyClone = st.clone().attr(polyCloneAttrNormal).hover(function () {
				//if (polyLine.data("isSelected")) return;
				polyClone.attr({opacity: 0.2});
			}, function () {
				//if (polyLine.data("isSelected")) return;
				polyClone.attr({opacity: 0.0});
			});
		polyClone.data("objectId", polyline.element.id);
		polyClone.click(function(){
			const instance = this;
			const objectId = instance.data("objectId");
			const object = this.paper.getById(objectId);
			const contextObject = object.data("contextObject");
			if (contextObject) {
				console.log(`[flow], objectId: ${  object.id }, flow: ${  contextObject.flow}`);
				ProcessDiagramGenerator.showFlowInfo(contextObject);
			}
		}).dblclick(function(){
			console.log("!!! DOUBLE CLICK !!!");
		}).hover(function (mouseEvent) {
			const instance = this;
			const objectId = instance.data("objectId");
			const object = this.paper.getById(objectId);
			const contextObject = object.data("contextObject");
			if (contextObject)
				ProcessDiagramGenerator.showFlowInfo(contextObject);
		});
		polyClone.data("parentId", uuid);
		
		if (!connectionType || connectionType == CONNECTION_TYPE.SEQUENCE_FLOW)
			polyline.element.attr("stroke-width", this.getStroke());
		else if (connectionType == CONNECTION_TYPE.MESSAGE_FLOW)
			polyline.element.attr({"stroke-dasharray": "--"});
		else if (connectionType == CONNECTION_TYPE.ASSOCIATION)
			polyline.element.attr({"stroke-dasharray": ". "});
		
		this.setPaint(originalPaint);
		this.setStroke(originalStroke);
	},
	
	_drawDefaultSequenceFlowIndicator: function(line) {
		//console.log("line: ", line);
		
		const len = 10; c = len/2, f = 8;
		const defaultIndicator = this.g.path("M" + (-c) + " " + 0 + "L" + (c) + " " + 0);
		defaultIndicator.attr("stroke-width", this.getStroke()+0);
		defaultIndicator.attr("stroke", this.getPaint());
		
		
		const cosAngle = Math.cos((line.angle));
		const sinAngle = Math.sin((line.angle));
		
		const dx = f * cosAngle;
		const dy = f * sinAngle;
		
		const x1 = line.x1 + dx + 0*c*cosAngle;
		const y1 = line.y1 + dy + 0*c*sinAngle;
		
		defaultIndicator.transform(`t${  x1  },${  y1  }`);
		defaultIndicator.transform(`...r${  Raphael.deg(line.angle - 3*Math.PI / 4)  } ${  0  } ${  0}`);
		/*
		var c0 = this.g.ellipse(0, 0, 1, 1).attr({stroke: Color.Blue});
		c0.transform("t" + (line.x1) + "," + (line.y1) + "");
		var center = this.g.ellipse(0, 0, 1, 1).attr({stroke: Color.Red});
		center.transform("t" + (line.x1+dx) + "," + (line.y1+dy) + "");
		*/
		
		return defaultIndicator;
	},
	
	drawSequenceflow: function(waypoints, conditional, isDefault, highLighted) {
		const withArrowHead = true;
		this._drawFlow(waypoints, conditional, isDefault, highLighted, withArrowHead, CONNECTION_TYPE.SEQUENCE_FLOW);
	},
	
	drawMessageflow: function(waypoints, highLighted) {
		const withArrowHead = true;
		const conditional=isDefault=false;
		this._drawFlow(waypoints, conditional, isDefault, highLighted, withArrowHead, CONNECTION_TYPE.MESSAGE_FLOW);
	},
	
	drawAssociation: function(waypoints, withArrowHead, highLighted) {
		const withArrowHead = withArrowHead;
		const conditional=isDefault=false;
		this._drawFlow(waypoints, conditional, isDefault, highLighted, withArrowHead, CONNECTION_TYPE.ASSOCIATION);
	},
  
	_drawCircleTail: function(line, connectionType){
		const diameter = ARROW_WIDTH/2*1.5;
		
		// anti smoothing
		if (this.strokeWidth%2 == 1)
			line.x1 += .5, line.y1 += .5;
		
		const circleTail = this.g.ellipse(line.x1, line.y1, diameter, diameter);
		circleTail.attr("fill", Color.white);
		circleTail.attr("stroke", this.getPaint());
		
		return circleTail;
	},
	
	_drawArrowHead: function(line, connectionType){
		const doubleArrowWidth = 2 * ARROW_WIDTH;
		
		if (connectionType == CONNECTION_TYPE.ASSOCIATION)
			var arrowHead = this.g.path(`M-${  ARROW_WIDTH/2+.5  } -${  doubleArrowWidth  }L 0 0 L${  ARROW_WIDTH/2+.5  } -${  doubleArrowWidth}`);
		else
			var arrowHead = this.g.path(`M0 0L-${  ARROW_WIDTH/2+.5  } -${  doubleArrowWidth  }L${  ARROW_WIDTH/2+.5  } -${  doubleArrowWidth  }z`);
		
		//arrowHead.transform("t" + 0 + ",-" + this.getStroke() + "");
		
		// anti smoothing
		if (this.strokeWidth%2 == 1)
			line.x2 += .5, line.y2 += .5;
		
		arrowHead.transform(`t${  line.x2  },${  line.y2  }`);
		arrowHead.transform(`...r${  Raphael.deg(line.angle - Math.PI / 2)  } ${  0  } ${  0}`);
		
		if (!connectionType || connectionType == CONNECTION_TYPE.SEQUENCE_FLOW)
			arrowHead.attr("fill", this.getPaint());
		else if (connectionType == CONNECTION_TYPE.MESSAGE_FLOW)
			arrowHead.attr("fill", Color.white);
			
		arrowHead.attr("stroke-width", this.getStroke());
		arrowHead.attr("stroke", this.getPaint());
		
		return arrowHead;
	},
	
	/*
	drawArrowHead2: function(srcX, srcY, targetX, targetY) {
		var doubleArrowWidth = 2 * ARROW_WIDTH;
		
		//var arrowHead = this.g.path("M-" + ARROW_WIDTH/2 + " -" + doubleArrowWidth + "L0 0" + "L" + ARROW_WIDTH/2 + " -" + doubleArrowWidth + "z");
		
		var arrowHead = this.g.path("M0 0L-" + ARROW_WIDTH/1.5 + " -" + doubleArrowWidth + "L" + ARROW_WIDTH/1.5 + " -" + doubleArrowWidth + "z");
		//var c = DefaultProcessDiagramCanvas.g.ellipse(0, 0, 3, 3);
		//c.transform("t"+targetX+","+targetY+"");
		
		var angle = Math.atan2(targetY - srcY, targetX - srcX);
		
		arrowHead.transform("t"+targetX+","+targetY+"");
		arrowHead.transform("...r" + Raphael.deg(angle - Math.PI / 2) + " "+0+" "+0);
		
		//console.log(arrowHead.transform());
		//console.log("--> " + Raphael.deg(angle - Math.PI / 2));
		
		arrowHead.attr("fill", this.getPaint());
		arrowHead.attr("stroke", this.getPaint());
		
		/ *
		// shaddow
		var c0 = arrowHead.clone();
		c0.transform("...t-1 1");
		c0.attr("stroke-width", this.strokeWidth);
		c0.attr("stroke", Color.black);
		c0.attr("opacity", 0.15);
		c0.toBack();
		* /
	},
	*/
	
	_drawConditionalSequenceFlowIndicator: function(line){
		const horizontal = (CONDITIONAL_INDICATOR_WIDTH * 0.7);
		const halfOfHorizontal = horizontal / 2;
		const halfOfVertical = CONDITIONAL_INDICATOR_WIDTH / 2;

		const uuid = null;
		const waypoints = [{x: 0, y: 0},
						{x: -halfOfHorizontal, y: halfOfVertical},
						{x: 0, y: CONDITIONAL_INDICATOR_WIDTH},
						{x: halfOfHorizontal, y: halfOfVertical}];
		/*
		var polyline = new Polyline(uuid, waypoints, this.getStroke());
		polyline.element = this.g.path(polyline.path);
		polyline.element.attr("stroke-width", this.getStroke());
		polyline.element.attr("stroke", this.getPaint());
		polyline.element.id = uuid;
		*/
		const polygone = new Polygone(waypoints, this.getStroke());
		polygone.element = this.g.path(polygone.path);
		polygone.element.attr("fill", Color.white);
		
		polygone.transform(`t${  line.x1  },${  line.y1  }`);
		polygone.transform(`...r${  Raphael.deg(line.angle - Math.PI / 2)  } ${  0  } ${  0}`);
		
		
		const cosAngle = Math.cos((line.angle));
		const sinAngle = Math.sin((line.angle));
		
		//polygone.element.attr("stroke-width", this.getStroke());
		//polygone.element.attr("stroke", this.getPaint());
		
		polygone.attr({"stroke-width": this.getStroke(), "stroke": this.getPaint()});
		
		return polygone.element;
	},
  
	drawSequenceflowWithoutArrow: function(waypoints, conditional, isDefault, highLighted) {
		const withArrowHead = false;
		this._drawFlow(waypoints, conditional, isDefault, highLighted, withArrowHead, CONNECTION_TYPE.SEQUENCE_FLOW);
	},
	
	/*
	 * Draw artifacts
	 */
	
	drawPoolOrLane: function(x, y, width, height, name){
		// anti smoothing
		if (this.strokeWidth%2 == 1)
			x = Math.round(x) + .5, y = Math.round(y) + .5;
		
		// shape
		const rect = this.g.rect(x, y, width, height);
		const attr = {"stroke-width": NORMAL_STROKE, stroke: TASK_STROKE_COLOR};
		rect.attr(attr);
		
		// Add the name as text, vertical
		if(name != null && name.length > 0) {
			var attr = POOL_LANE_FONT;
			
			// Include some padding
			const availableTextSpace = height - 6;
			
			// Create rotation for derived font
			const truncated = this.fitTextToWidth(name, availableTextSpace);
			const realWidth = this.getStringWidth(truncated, attr);
			const realHeight = this.getStringHeight(truncated, attr);
			
			//console.log("truncated:", truncated, ", height:", height, ", realHeight:", realHeight, ", availableTextSpace:", availableTextSpace, ", realWidth:", realWidth);
			const newX = x + 2 + realHeight*1 - realHeight/2;
			const newY = 3 + y + availableTextSpace - (availableTextSpace - realWidth) / 2 - realWidth/2;
			const textElement = this.g.text(newX, newY, truncated).attr(attr);
			//console.log(".getBBox(): ", t.getBBox());
			textElement.transform(`r${  Raphael.deg(270 * Math.PI/180)  } ${  newX  } ${  newY}`);
		}
		
		// TODO: add to set
	},
	
	_drawTask: function(name, x, y, width, height, thickBorder) {
		const originalPaint = this.getPaint();
		this.setPaint(TASK_COLOR);
		
		// anti smoothing
		if (this.strokeWidth%2 == 1)
			x = Math.round(x) + .5, y = Math.round(y) + .5;
		
		// shape
		const shape = this.g.rect(x, y, width, height, TASK_CORNER_ROUND);
		const attr = {"stroke-width": this.strokeWidth, stroke: TASK_STROKE_COLOR, fill: this.getPaint()};
		shape.attr(attr);
		//shape.attr({fill: "90-"+this.getPaint()+"-" + Color.get(250, 250, 244)});
		
		const contextObject = this.getConextObject();
		if (contextObject) {
			shape.id = contextObject.id;
			shape.data("contextObject", contextObject);
		}
		
		//var activity = this.getConextObject();
		//console.log("activity: " + activity.getId(), activity);
		//Object.clone(activity);
		
		/*
		c.mouseover(function(){
			this.attr({"stroke-width": NORMAL_STROKE + 2});
		}).mouseout(function(){
			this.attr({"stroke-width": NORMAL_STROKE});
		});
		*/
		
		this.setPaint(originalPaint);

		// white shaddow
		this.drawShaddow(shape);
		
		
		if (thickBorder) {
			shape.attr({"stroke-width": THICK_TASK_BORDER_STROKE});
		} else {
			//g.draw(rect);
		}
		
		// text
		if (name) {
			const fontAttr = TASK_FONT;
			
			// Include some padding
			const paddingX = 5;
			const paddingY = 5;
			const availableTextSpace = width - paddingX*2;
			
			// TODO: this.setFont
			// var originalFont = this.getFont();
			// this.setFont(TASK_FONT)
			/*
			var truncated = this.fitTextToWidth(name, availableTextSpace);
			var realWidth = this.getStringWidth(truncated, fontAttr);
			var realHeight = this.getStringHeight(truncated, fontAttr);
			
			//var t = this.g.text(x + width/2 + realWidth*0/2 + paddingX*0, y + height/2, truncated).attr(fontAttr);
			*/
			//console.log("draw task name: " + name);
			const boxWidth = width - (2 * TEXT_PADDING);
			const boxHeight = height - ICON_SIZE - ICON_PADDING - ICON_PADDING - MARKER_WIDTH - 2 - 2;
			const boxX = x + width/2 - boxWidth/2;
			const boxY = y + height/2 - boxHeight/2 + ICON_PADDING + ICON_PADDING - 2 - 2;
			/*
			var boxWidth = width - (2 * ANNOTATION_TEXT_PADDING);
			var boxHeight = height - (2 * ANNOTATION_TEXT_PADDING);
			var boxX = x + width/2 - boxWidth/2;
			var boxY = y + height/2 - boxHeight/2;
			*/
			
			this.drawTaskLabel(name, boxX, boxY, boxWidth, boxHeight);
		}
	},
	
	drawTaskLabel: function(text, x, y, boxWidth, boxHeight){
		const originalFont = this.getFont();
		this.setFont(TASK_FONT);
			
		this._drawMultilineText(text, x, y, boxWidth, boxHeight, MULTILINE_VERTICAL_ALIGN_MIDDLE, MULTILINE_HORIZONTAL_ALIGN_MIDDLE);
		
		this.setFont(originalFont);
	},
	
	drawAnnotationText: function(text, x, y, width, height){
		//this._drawMultilineText(text, x, y, width, height, "start");
		
		const originalPaint = this.getPaint();
		const originalFont = this.getFont();
		
		this.setPaint(Color.black);
		this.setFont(TASK_FONT);
			
		this._drawMultilineText(text, x, y, width, height, MULTILINE_VERTICAL_ALIGN_TOP, MULTILINE_HORIZONTAL_ALIGN_LEFT);
		
		this.setPaint(originalPaint);
		this.setFont(originalFont);
	},
	
	drawLabel: function(text, x, y, width, height){
		//this._drawMultilineText(text, x, y, width, height, "start");
		
		const originalPaint = this.getPaint();
		const originalFont = this.getFont();
		
		this.setPaint(LABEL_COLOR);
		//this.setFont(LABEL_FONT);
		this.setFont(LABEL_FONT_SMOOTH);
		
		// predefined box width for labels
		// TODO: use label width as is, but not height (for stretching)
		if (!width || !height) {
		  width = 100;
		  height = 0;
		}
		
		// TODO: remove it. It is debug
		x = x - width/2;
	  
		this._drawMultilineText(text, x, y, width, height, MULTILINE_VERTICAL_ALIGN_TOP, MULTILINE_HORIZONTAL_ALIGN_MIDDLE);
		
		this.setPaint(originalPaint);
		this.setFont(originalFont);
	},
	
	/*
	drawMultilineLabel: function(text, x, y){
		var originalFont = this.getFont();
		this.setFont(LABEL_FONT_SMOOTH);
		
		var boxWidth = 80;
		x = x - boxWidth/2
		
		this._drawMultilineText(text, x, y, boxWidth, null, "middle");
		this.setFont(originalFont);
	},
	*/
	
	getStringWidth: function(text, fontAttrs){
		const textElement = this.g.text(0, 0, text).attr(fontAttrs).hide();
		const bb = textElement.getBBox();
		
		//console.log("string width: ", t.getBBox().width);
		return textElement.getBBox().width;
	},
	getStringHeight: function(text, fontAttrs){
		const textElement = this.g.text(0, 0, text).attr(fontAttrs).hide();
		const bb = textElement.getBBox();
		
		//console.log("string height: ", t.getBBox().height);
		return textElement.getBBox().height;
	},
	fitTextToWidth: function(original, width) {
		let text = original;

		// TODO: move attr on parameters
		const attr = {font: "11px Arial", opacity: 0};
		
		// remove length for "..."
		const dots = this.g.text(0, 0, "...").attr(attr).hide();
		const dotsBB = dots.getBBox();
		
		const maxWidth = width - dotsBB.width;
		
		const textElement = this.g.text(0, 0, text).attr(attr).hide();
		let bb = textElement.getBBox();
		
		// it's a little bit incorrect with "..."
		while (bb.width > maxWidth && text.length > 0) {
			text = text.substring(0, text.length - 1);
			textElement.attr({"text": text});
			bb = textElement.getBBox();
		}

		// remove element from paper
		textElement.remove();
		
		if (text != original) {
			text = `${text  }...`;
		}

		return text;
	},
	wrapTextToWidth: function(original, width){
	
		//return original;
		
		let text = original;
		let wrappedText = "\n";
		
		// TODO: move attr on parameters
		const attr = {font: "11px Arial", opacity: 0};
		
		const textElement = this.g.text(0, 0, wrappedText).attr(attr).hide();
		let bb = textElement.getBBox();
		
		let resultText = "";
		let i = 0, j = 0;
		while (text.length > 0) {
			while (bb.width < width && text.length>0) {
				// remove "\n"
				wrappedText = wrappedText.substring(0,wrappedText.length-1);
				// add new char, add "\n"
				wrappedText = `${wrappedText + text.substring(0,1)  }\n`;
				text = text.substring(1);
				
				textElement.attr({"text": wrappedText});
				bb = textElement.getBBox();
				i++;
				if (i>200) break;
			}
			// remove "\n"
			wrappedText = wrappedText.substring(0, wrappedText.length - 1);
			
			if (text.length == 0) {
				resultText += wrappedText;
				break;
			}
			
			// return last char to text
			text = wrappedText.substring(wrappedText.length-1) + text;
			// remove last char from wrappedText
			wrappedText = `${wrappedText.substring(0, wrappedText.length-1)  }\n`;
			
			textElement.attr({"text": wrappedText});
			bb = textElement.getBBox();
			
			//console.log(">> ", wrappedText, ", ", text);
			resultText += wrappedText;
			wrappedText = "\n";
			
			j++;
			if (j>20) break;
		}
		// remove element from paper
		textElement.remove();
		
		return resultText;
	},
	
	wrapTextToWidth2: function(original, width){
		let text = original;
		let wrappedText = "\n";
		
		// TODO: move attr on parameters
		const attr = {font: "11px Arial", opacity: 0};
		
		const textElement = this.g.text(0, 0, wrappedText).attr(attr).hide();
		let bb = textElement.getBBox();
		
		let resultText = "";
		let i = 0, j = 0;
		while (text.length > 0) {
			while (bb.width < width && text.length>0) {
				// remove "\n"
				wrappedText = wrappedText.substring(0,wrappedText.length-1);
				// add new char, add "\n"
				wrappedText = `${wrappedText + text.substring(0,1)  }\n`;
				text = text.substring(1);
				
				textElement.attr({"text": wrappedText});
				bb = textElement.getBBox();
				i++;
				if (i>200) break;
			}
			// remove "\n"
			wrappedText = wrappedText.substring(0, wrappedText.length - 1);
			
			if (text.length == 0) {
				resultText += wrappedText;
				break;
			}
			
			// return last char to text
			text = wrappedText.substring(wrappedText.length-1) + text;
			// remove last char from wrappedText
			wrappedText = `${wrappedText.substring(0, wrappedText.length-1)  }\n`;
			
			textElement.attr({"text": wrappedText});
			bb = textElement.getBBox();
			
			//console.log(">> ", wrappedText, ", ", text);
			resultText += wrappedText;
			wrappedText = "\n";
			
			j++;
			if (j>20) break;
		}
		// remove element from paper
		textElement.remove();
		
		return resultText;
	},
	
	drawUserTask: function(name, x, y, width, height) {
	  this.g.setStart();
		this._drawTask(name, x, y, width, height);
		const img = this.g.image(USERTASK_IMAGE, x + ICON_PADDING, y + ICON_PADDING, ICON_SIZE, ICON_SIZE);
		const set = this.g.setFinish();
		this.addHandlers(set, x, y, width, height, "task");
	},
	
	drawScriptTask: function(name, x, y, width, height) {
	  this.g.setStart();
		this._drawTask(name, x, y, width, height);
		const img = this.g.image(SCRIPTTASK_IMAGE, x + ICON_PADDING, y + ICON_PADDING, ICON_SIZE, ICON_SIZE);
		const set = this.g.setFinish();
    this.addHandlers(set, x, y, width, height, "task");
	},
	
	drawServiceTask: function(name, x, y, width, height) {
	  this.g.setStart();
		this._drawTask(name, x, y, width, height);
		const img = this.g.image(SERVICETASK_IMAGE, x + ICON_PADDING, y + ICON_PADDING, ICON_SIZE, ICON_SIZE);
		const set = this.g.setFinish();
    this.addHandlers(set, x, y, width, height, "task");
	},
	
	drawReceiveTask: function(name, x, y, width, height) {
	  this.g.setStart();
		this._drawTask(name, x, y, width, height);
		const img = this.g.image(RECEIVETASK_IMAGE, x + 7, y + 7, ICON_SIZE, ICON_SIZE);
		const set = this.g.setFinish();
    this.addHandlers(set, x, y, width, height, "task");
	},
	
	drawSendTask: function(name, x, y, width, height) {
	  this.g.setStart();
		this._drawTask(name, x, y, width, height);
		const img = this.g.image(SENDTASK_IMAGE, x + 7, y + 7, ICON_SIZE, ICON_SIZE);
		const set = this.g.setFinish();
    this.addHandlers(set, x, y, width, height, "task");
	},
	
	drawManualTask: function(name, x, y, width, height) {
	  this.g.setStart();
		this._drawTask(name, x, y, width, height);
		const img = this.g.image(MANUALTASK_IMAGE, x + 7, y + 7, ICON_SIZE, ICON_SIZE);
		const set = this.g.setFinish();
    this.addHandlers(set, x, y, width, height, "task");
	},
	
	drawBusinessRuleTask: function(name, x, y, width, height) {
	  this.g.setStart();
		this._drawTask(name, x, y, width, height);
		const img = this.g.image(BUSINESS_RULE_TASK_IMAGE, x + 7, y + 7, ICON_SIZE, ICON_SIZE);
		const set = this.g.setFinish();
    this.addHandlers(set, x, y, width, height, "task");
	},
	
	drawExpandedSubProcess: function(name, x, y, width, height, isTriggeredByEvent){
	  this.g.setStart();
		// anti smoothing
		if (this.strokeWidth%2 == 1)
			x = Math.round(x) + .5, y = Math.round(y) + .5;
		
		// shape
		const rect = this.g.rect(x, y, width, height, EXPANDED_SUBPROCESS_CORNER_ROUND);
		
		// Use different stroke (dashed)
		if(isTriggeredByEvent) {
			rect.attr(EVENT_SUBPROCESS_ATTRS);
		} else {
			rect.attr(EXPANDED_SUBPROCESS_ATTRS);
		}
		
		this.setContextToElement(rect);
		
		const fontAttr = EXPANDED_SUBPROCESS_FONT;
		
		// Include some padding
		const paddingX = 10;
		const paddingY = 5;
		const availableTextSpace = width - paddingX*2;
		
		const truncated = this.fitTextToWidth(name, availableTextSpace);
		const realWidth = this.getStringWidth(truncated, fontAttr);
		const realHeight = this.getStringHeight(truncated, fontAttr);
		
		const textElement = this.g.text(x + width/2 - realWidth*0/2 + 0*paddingX, y + realHeight/2 + paddingY, truncated).attr(fontAttr);
		
		const set = this.g.setFinish();
		// TODO: Expanded Sub Process may has specific handlers
		//this.addHandlers(set, x, y, width, height, "task");
	},
	
	drawCollapsedSubProcess: function(name, x, y, width, height, isTriggeredByEvent) {
	  this.g.setStart();
	  this._drawCollapsedTask(name, x, y, width, height, false);
	  const set = this.g.setFinish();
    this.addHandlers(set, x, y, width, height, "task");
	},
	
	drawCollapsedCallActivity: function(name, x, y, width, height) {
	  this.g.setStart();
		this._drawCollapsedTask(name, x, y, width, height, true);
		const set = this.g.setFinish();
    this.addHandlers(set, x, y, width, height, "task");
	},

	_drawCollapsedTask: function(name, x, y, width, height, thickBorder) {
		// The collapsed marker is now visualized separately
		this._drawTask(name, x, y, width, height, thickBorder);
	},
	
	drawCollapsedMarker: function(x, y, width, height){
		// rectangle
		const rectangleWidth = MARKER_WIDTH;
		const rectangleHeight = MARKER_WIDTH;
		
		// anti smoothing
		if (this.strokeWidth%2 == 1)
			y += .5;
		
		const rect = this.g.rect(x + (width - rectangleWidth) / 2, y + height - rectangleHeight - 3, rectangleWidth, rectangleHeight);
		
		// plus inside rectangle
		const cx = rect.attr("x") + rect.attr("width")/2;
		const cy = rect.attr("y") + rect.attr("height")/2;
		
		const line = this.g.path(
			"M" + cx + " " + (cy+2) + "L" + cx + " " + (cy-2) + 
			"M" + (cx-2) + " " + cy + "L" + (cx+2) + " " + cy
		).attr({"stroke-width": this.strokeWidth});
		
	},
	
	drawActivityMarkers: function(x, y, width, height, multiInstanceSequential, multiInstanceParallel, collapsed){
		if (collapsed) {
			if (!multiInstanceSequential && !multiInstanceParallel) {
				this.drawCollapsedMarker(x, y, width, height);
			} else {
				this.drawCollapsedMarker(x - MARKER_WIDTH / 2 - 2, y, width, height);
				if (multiInstanceSequential) {
					console.log("is collapsed and multiInstanceSequential");
					this.drawMultiInstanceMarker(true, x + MARKER_WIDTH / 2 + 2, y, width, height);
				} else if (multiInstanceParallel) {
					console.log("is collapsed and multiInstanceParallel");
					this.drawMultiInstanceMarker(false, x + MARKER_WIDTH / 2 + 2, y, width, height);
				}
			}
		} else {
			if (multiInstanceSequential) {
				console.log("is multiInstanceSequential");
				this.drawMultiInstanceMarker(true, x, y, width, height);
			} else if (multiInstanceParallel) {
				console.log("is multiInstanceParallel");
				this.drawMultiInstanceMarker(false, x, y, width, height);
			}
		}
	},
	
	drawGateway: function(x, y, width, height) {
		
		const rhombus = this.g.path(	"M" + x + " " + (y + (height / 2)) + 
									"L" + (x + (width / 2)) + " " + (y + height) + 
									"L" + (x + width) + " " + (y + (height / 2)) +
									"L" + (x + (width / 2)) + " " + y +
									"z"
								);
		
		// white shaddow
		this.drawShaddow(rhombus);
		
		rhombus.attr("stroke-width", this.strokeWidth);
		rhombus.attr("stroke", Color.SlateGrey);
		rhombus.attr({fill: Color.white});
		
		this.setContextToElement(rhombus);
		
		return rhombus;
	},
	
	drawParallelGateway: function(x, y, width, height) {
	  this.g.setStart();
	  
		// rhombus
		this.drawGateway(x, y, width, height);

		// plus inside rhombus
		const originalStroke = this.getStroke();
		this.setStroke(GATEWAY_TYPE_STROKE);
		
		const plus = this.g.path(
			"M" + (x + 10) + " " + (y + height / 2) + "L" + (x + width - 10) + " " + (y + height / 2) +	// horizontal
			"M" + (x + width / 2) + " " + (y + height - 10) + "L" + (x + width / 2) + " " + (y + 10)	// vertical
		);
		plus.attr({"stroke-width": this.getStroke(), "stroke": this.getPaint()});
		
		this.setStroke(originalStroke);
		
		const set = this.g.setFinish();
		this.addHandlers(set, x, y, width, height, "gateway");
	},
	
	drawExclusiveGateway: function(x, y, width, height) {
	  this.g.setStart();
	  
		// rhombus
		const rhombus = this.drawGateway(x, y, width, height);

		const quarterWidth = width / 4;
		const quarterHeight = height / 4;
		
		// X inside rhombus
		const originalStroke = this.getStroke();
		this.setStroke(GATEWAY_TYPE_STROKE);
		
		const iks = this.g.path(
			"M" + (x + quarterWidth + 3) + " " + (y + quarterHeight + 3) + "L" + (x + 3 * quarterWidth - 3) + " " + (y + 3 * quarterHeight - 3) + 
			"M" + (x + quarterWidth + 3) + " " + (y + 3 * quarterHeight - 3) + "L" + (x + 3 * quarterWidth - 3) + " " + (y + quarterHeight + 3)
		);
		iks.attr({"stroke-width": this.getStroke(), "stroke": this.getPaint()});
		
		this.setStroke(originalStroke);
		
		const set = this.g.setFinish();
    this.addHandlers(set, x, y, width, height, "gateway");
	},
	
	drawInclusiveGateway: function(x, y, width, height){
	  this.g.setStart();
	  
		// rhombus
		this.drawGateway(x, y, width, height);
		
		const diameter = width / 4;
		
		// circle inside rhombus
		const originalStroke = this.getStroke();
		this.setStroke(GATEWAY_TYPE_STROKE);
		const circle = this.g.ellipse(width/2 + x, height/2 + y, diameter, diameter);
		circle.attr({"stroke-width": this.getStroke(), "stroke": this.getPaint()});
		
		this.setStroke(originalStroke);
		
		const set = this.g.setFinish();
    this.addHandlers(set, x, y, width, height, "gateway");
	},
	
	drawEventBasedGateway: function(x, y, width, height){
	  this.g.setStart();
	  
		// rhombus
		this.drawGateway(x, y, width, height);
		
		const diameter = width / 2;

	    // rombus inside rhombus
	    const originalStroke = this.getStroke();
		this.setStroke(GATEWAY_TYPE_STROKE);
	    
	    
	    // draw GeneralPath (polygon)
	    const n=5;
	    const angle = 2*Math.PI/n;
	    const x1Points = [];
	    const y1Points = [];
		
		for ( var index = 0; index < n; index++ ) {
			const v = index*angle - Math.PI/2;
			x1Points[index] = x + parseInt(Math.round(width/2)) + parseInt(Math.round((width/4)*Math.cos(v)));
        	y1Points[index] = y + parseInt(Math.round(height/2)) + parseInt(Math.round((height/4)*Math.sin(v)));
		}
		//g.drawPolygon(x1Points, y1Points, n);
		
		let path = "";
		for ( var index = 0; index < n; index++ ) {
			if (index == 0) 
				path += "M";
			else 
				path += "L";
			path += `${x1Points[index]  },${  y1Points[index]}`;
		}
		path += "z";
		const polygone = this.g.path(path);
		polygone.attr("stroke-width", this.strokeWidth);
		polygone.attr("stroke", this.getPaint());
		
		this.setStroke(originalStroke);
		
		const set = this.g.setFinish();
    this.addHandlers(set, x, y, width, height, "gateway");
	},
	
	/*
	*  drawMultiInstanceMarker
	*  drawHighLight
	*  highLightFlow
	*/
	
	drawMultiInstanceMarker: function(sequential, x, y, width, height) {
		const rectangleWidth = MARKER_WIDTH;
		const rectangleHeight = MARKER_WIDTH;
		
		// anti smoothing
		if (this.strokeWidth%2 == 1)
			x += .5;//, y += .5;
			
		const lineX = x + (width - rectangleWidth) / 2;
		const lineY = y + height - rectangleHeight - 3;
		
		const originalStroke = this.getStroke();
		this.setStroke(MULTI_INSTANCE_STROKE);
		
		if (sequential) {
			const line = this.g.path(
				"M" + lineX + " " + lineY + 							"L" + (lineX + rectangleWidth) + " " + lineY + 
				"M" + lineX + " " + (lineY + rectangleHeight / 2) + 	"L" + (lineX + rectangleWidth) + " " + (lineY + rectangleHeight / 2) + 
				"M" + lineX + " " + (lineY + rectangleHeight) + 		"L" + (lineX + rectangleWidth) + " " + (lineY + rectangleHeight)
			).attr({"stroke-width": this.strokeWidth});
		} else {
			const line = this.g.path(
				"M" + lineX + " " + 							lineY + "L" + lineX + " " + 					(lineY + rectangleHeight) +
				"M" + (lineX + rectangleWidth / 2) + " " + 	lineY + "L" + (lineX + rectangleWidth / 2) + " " + 	(lineY + rectangleHeight) + 
				"M" + (lineX + rectangleWidth) + " " + 		lineY + "L" + (lineX + rectangleWidth) + " " + 		(lineY + rectangleHeight)
			).attr({"stroke-width": this.strokeWidth});
		}
		
		this.setStroke(originalStroke);
	},
	
	drawHighLight: function(x, y, width, height){
		const originalPaint = this.getPaint();
		const originalStroke = this.getStroke();
		
		this.setPaint(HIGHLIGHT_COLOR);
		this.setStroke(THICK_TASK_BORDER_STROKE);

		//var c = this.g.rect(x - width/2 - THICK_TASK_BORDER_STROKE, y - height/2 - THICK_TASK_BORDER_STROKE, width + THICK_TASK_BORDER_STROKE*2, height + THICK_TASK_BORDER_STROKE*2, 5);
		const rect = this.g.rect(x - THICK_TASK_BORDER_STROKE, y - THICK_TASK_BORDER_STROKE, width + THICK_TASK_BORDER_STROKE*2, height + THICK_TASK_BORDER_STROKE*2, TASK_CORNER_ROUND);
		rect.attr("stroke-width", this.strokeWidth);
		rect.attr("stroke", this.getPaint());
		
		this.setPaint(originalPaint);
		this.setStroke(originalStroke);
	},
	
	highLightActivity: function(activityId){
		const shape = this.g.getById(activityId);
		if (!shape) {
			console.error(`Activity ${  activityId  } not found`);
			return;
		}
		
		const contextObject = shape.data("contextObject");
		if (contextObject)
			console.log(`--> highLightActivity: [${contextObject.getProperty("type")}], activityId: ${  contextObject.getId()}`);
		else
			console.log("--> highLightActivity: ", shape, shape.data("contextObject"));
		
		shape.attr("stroke-width", THICK_TASK_BORDER_STROKE);
		shape.attr("stroke", HIGHLIGHT_COLOR);
	},
	
	highLightFlow: function(flowId){
		const shapeFlow = this.g.getById(flowId);
		if (!shapeFlow) {
			console.error(`Flow ${  flowId  } not found`);
			return;
		}
		
		const contextObject = shapeFlow.data("contextObject");
		if (contextObject)
			console.log(`--> highLightFlow: [${contextObject.id}] ${  contextObject.flow}`);
		//console.log("--> highLightFlow: ", flow.flow, flow.data("set"));
		
		const st = shapeFlow.data("set");
		
		st.attr("stroke-width", SEQUENCEFLOW_HIGHLIGHT_STROKE);
		st.attr("stroke", HIGHLIGHT_COLOR);
		const withArrowHead = shapeFlow.data("withArrowHead");
		if (withArrowHead)
			st[1].attr("fill", HIGHLIGHT_COLOR);
		
		st.forEach(function(el){
			//console.log("---->", el);
			//el.attr("")
		});
	},
	

	_drawClock: function(cx, cy, width, height){
		
		const circle = this.g.ellipse(cx, cy, 1, 1).attr({stroke:"none", fill: Color.get(232, 239, 241)});
		//var c = this.g.ellipse(cx, cy, width, height).attr({stroke:"none", fill: Color.red});
		//x = cx - width/2;
		//y = cy - height/2;
	
		const clock = this.g.path(
		/* outer circle */ "M15.5,2.374		C8.251,2.375,2.376,8.251,2.374,15.5		C2.376,22.748,8.251,28.623,15.5,28.627c7.249-0.004,13.124-5.879,13.125-13.127C28.624,8.251,22.749,2.375,15.5,2.374z" +
		/* inner circle */ "M15.5,26.623	C8.909,26.615,4.385,22.09,4.375,15.5	C4.385,8.909,8.909,4.384,15.5,4.374c4.59,0.01,11.115,3.535,11.124,11.125C26.615,22.09,22.091,26.615,15.5,26.623z" +
		/*  9 */ "M8.625,15.5c-0.001-0.552-0.448-0.999-1.001-1c-0.553,0-1,0.448-1,1c0,0.553,0.449,1,1,1C8.176,16.5,8.624,16.053,8.625,15.5z" +
		/*  8 */ "M8.179,18.572c-0.478,0.277-0.642,0.889-0.365,1.367c0.275,0.479,0.889,0.641,1.365,0.365c0.479-0.275,0.643-0.887,0.367-1.367C9.27,18.461,8.658,18.297,8.179,18.572z" +
		/* 10 */ "M9.18,10.696c-0.479-0.276-1.09-0.112-1.366,0.366s-0.111,1.09,0.365,1.366c0.479,0.276,1.09,0.113,1.367-0.366C9.821,11.584,9.657,10.973,9.18,10.696z" +
		/*  2 */ "M22.822,12.428c0.478-0.275,0.643-0.888,0.366-1.366c-0.275-0.478-0.89-0.642-1.366-0.366c-0.479,0.278-0.642,0.89-0.366,1.367C21.732,12.54,22.344,12.705,22.822,12.428z" +
		/*  7 */ "M12.062,21.455c-0.478-0.275-1.089-0.111-1.366,0.367c-0.275,0.479-0.111,1.09,0.366,1.365c0.478,0.277,1.091,0.111,1.365-0.365C12.704,22.344,12.54,21.732,12.062,21.455z" +
		/* 11 */ "M12.062,9.545c0.479-0.276,0.642-0.888,0.366-1.366c-0.276-0.478-0.888-0.642-1.366-0.366s-0.642,0.888-0.366,1.366C10.973,9.658,11.584,9.822,12.062,9.545z" +
		/*  4 */ "M22.823,18.572c-0.48-0.275-1.092-0.111-1.367,0.365c-0.275,0.479-0.112,1.092,0.367,1.367c0.477,0.275,1.089,0.113,1.365-0.365C23.464,19.461,23.3,18.848,22.823,18.572z" +
		/*  2 */ "M19.938,7.813c-0.477-0.276-1.091-0.111-1.365,0.366c-0.275,0.48-0.111,1.091,0.366,1.367s1.089,0.112,1.366-0.366C20.581,8.702,20.418,8.089,19.938,7.813z" +
		/*  3 */ "M23.378,14.5c-0.554,0.002-1.001,0.45-1.001,1c0.001,0.552,0.448,1,1.001,1c0.551,0,1-0.447,1-1C24.378,14.949,23.929,14.5,23.378,14.5z" +
		/* arrows */ "M15.501,6.624c-0.552,0-1,0.448-1,1l-0.466,7.343l-3.004,1.96c-0.478,0.277-0.642,0.889-0.365,1.365c0.275,0.479,0.889,0.643,1.365,0.367l3.305-1.676C15.39,16.99,15.444,17,15.501,17c0.828,0,1.5-0.671,1.5-1.5l-0.5-7.876C16.501,7.072,16.053,6.624,15.501,6.624z" +
		/*  9 */ "M15.501,22.377c-0.552,0-1,0.447-1,1s0.448,1,1,1s1-0.447,1-1S16.053,22.377,15.501,22.377z" +
		/*  8 */ "M18.939,21.455c-0.479,0.277-0.643,0.889-0.366,1.367c0.275,0.477,0.888,0.643,1.366,0.365c0.478-0.275,0.642-0.889,0.366-1.365C20.028,21.344,19.417,21.18,18.939,21.455z" +
		"");
		clock.attr({fill: Color.black, stroke: "none"});
		//clock.transform("t " + (cx-29.75/2) + " " + (cy-29.75/2));
		//clock.transform("...s 0.85");
		
		//clock.transform("...s " + .85 + " " + .85);
		clock.transform(`t ${  -2.374  } ${  -2.374}`	);
		clock.transform(`...t -${  15.5-2.374  } -${  15.5-2.374}`	);
		clock.transform(`...s ${  1*(width/35)  } ${  1*(height/35)}`);
		clock.transform(`...T ${  cx  } ${  cy}`);
		//clock.transform("t " + (cx-width/2) + " " + (cy-height/2));
		
		//console.log(".getBBox(): ", clock.getBBox());
		//console.log(".attr(): ", c.attrs);
		circle.attr("rx", clock.getBBox().width/2);
		circle.attr("ry", clock.getBBox().height/2);
		
		//return circle
	},
	
	_drawPentagon: function(cx, cy, width, height, filled){
		// draw GeneralPath (polygon)
	    const n=5;
	    const angle = 2*Math.PI/n;
	    const waypoints = [];
		
		for ( let index = 0; index < n; index++ ) {
			const v = index*angle - Math.PI/2;
			const point = {};
			point.x = -width*1.2/2 + parseInt(Math.round(width*1.2/2)) + parseInt(Math.round((width*1.2/4)*Math.cos(v)));
        	point.y = -height*1.2/2 + parseInt(Math.round(height*1.2/2)) + parseInt(Math.round((height*1.2/4)*Math.sin(v)));
			waypoints[index] = point;
		}
		
		const polygone = new Polygone(waypoints, this.getStroke());
		polygone.element = this.g.path(polygone.path);
		if (filled)
			polygone.element.attr("fill", Color.black);
		else
			polygone.element.attr("fill", Color.white);
		
		polygone.element.transform(`s ${  1*(width/35)  } ${  1*(height/35)}`);
		polygone.element.transform(`...T ${  cx  } ${  cy}`);
	},
	
	//_drawMultilineText: function(text, x, y, boxWidth, boxHeight, textAnchor) {
	_drawMultilineText: function(text, x, y, boxWidth, boxHeight, verticalAlign, horizontalAlign) {
		if (!text || text == "") 
			return;
			
		// Autostretch boxHeight if boxHeight is 0
		if (boxHeight == 0)
		  verticalAlign = MULTILINE_VERTICAL_ALIGN_TOP;	  
	
		//var TEXT_PADDING = 3;
		const width = boxWidth;
		if (boxHeight)
			var height = boxHeight;
	
		const layouts = [];
		
		//var font = {font: "11px Arial", opacity: 1, "fill": LABEL_COLOR};
		const font = this.getFont();
		const measurer = new LineBreakMeasurer(this.g, x, y, text, font);
		const lineHeight = measurer.rafaelTextObject.getBBox().height;
		//console.log("text: ", text.replace(/\n/g, "?"));
		
		if (height) {
			var availableLinesCount = parseInt(height/lineHeight);
			//console.log("availableLinesCount: " + availableLinesCount);
		}
		
		let i = 1;
		while (measurer.getPosition() < measurer.text.getEndIndex()) {
			const layout = measurer.nextLayout(width);
			//console.log("LAYOUT: " + layout + ", getPosition: " + measurer.getPosition());
			
			if (layout != null) {
				// TODO: and check if measurer has next layout. If no then don't draw  dots
				if (!availableLinesCount || i < availableLinesCount) {
					layouts.push(layout);
				} else {
					layouts.push(this.fitTextToWidth(`${layout  }...`, boxWidth));
					break;
				}
			}
			i++;
		};
		//console.log(layouts);
		
		measurer.rafaelTextObject.attr({"text": layouts.join("\n")});
		
		if (horizontalAlign)
			measurer.rafaelTextObject.attr({"text-anchor": horizontalAlign}); // end, middle, start
			
		const bb = measurer.rafaelTextObject.getBBox();
		// TODO: there is somethin wrong with wertical align. May be: measurer.rafaelTextObject.attr({"y": y + height/2 - bb.height/2})
		measurer.rafaelTextObject.attr({"y": y + bb.height/2});
		//var bb = measurer.rafaelTextObject.getBBox();
		
		if (measurer.rafaelTextObject.attr("text-anchor") == MULTILINE_HORIZONTAL_ALIGN_MIDDLE )
			measurer.rafaelTextObject.attr("x",  x +  boxWidth/2);
		else if (measurer.rafaelTextObject.attr("text-anchor") == MULTILINE_HORIZONTAL_ALIGN_RIGHT )
			measurer.rafaelTextObject.attr("x",  x +  boxWidth);
		
		const boxStyle = {stroke: Color.LightSteelBlue2, "stroke-width": 1.0, "stroke-dasharray": "- "};
		//var box = this.g.rect(x+.5, y + .5, width, height).attr(boxStyle);
		const textAreaCX = x + boxWidth/2;
				let height = boxHeight;
				if (!height) height = bb.height;
				const textAreaCY = y + height/2;
				const dotLeftTop = this.g.ellipse(x, y, 3, 3).attr({"stroke-width": 0, fill: Color.LightSteelBlue, stroke: "none"}).hide();
				const dotCenter = this.g.ellipse(textAreaCX, textAreaCY, 3, 3).attr({fill: Color.LightSteelBlue2, stroke: "none"}).hide();

				/*
				// real bbox
				var bb = measurer.rafaelTextObject.getBBox();
				var rect = paper.rect(bb.x+.5, bb.y + .5, bb.width, bb.height).attr({"stroke-width": 1});
				*/
				const rect = this.g.rect(x, y, boxWidth, height).attr({"stroke-width": 1}).attr(boxStyle).hide();
				const debugSet = this.g.set();
				debugSet.push(dotLeftTop, dotCenter, rect);
				//debugSet.show();
	},
	
	drawTextAnnotation: function(text, x, y, width, height){
		const lineLength = 18;
		const path = [];
		  path.push(["M", x + lineLength, y]);
		  path.push(["L", x, y]);
		  path.push(["L", x, y + height]);
		  path.push(["L", x + lineLength, y + height]);
		  
		  path.push(["L", x + lineLength, y + height -1]);
		  path.push(["L", x + 1, y + height -1]);
		  path.push(["L", x + 1, y + 1]);
		  path.push(["L", x + lineLength, y + 1]);
		  path.push(["z"]);
	
		const textAreaLines = this.g.path(path);
		
	  const boxWidth = width - (2 * ANNOTATION_TEXT_PADDING);
      const boxHeight = height - (2 * ANNOTATION_TEXT_PADDING);
      const boxX = x + width/2 - boxWidth/2;
      const boxY = y + height/2 - boxHeight/2;
      
      // for debug
          const rectStyle = {stroke: Color(112, 146, 190), "stroke-width": 1.0, "stroke-dasharray": "- "};
          const r = this.g.rect(boxX, boxY, boxWidth, boxHeight).attr(rectStyle);
	  //
      
	  this.drawAnnotationText(text, boxX, boxY, boxWidth, boxHeight);
	},
	
	drawLabel111111111: function(text, x, y, width, height, labelAttrs){
		const  debug = false;
		
		// text
		if (text != null && text != undefined && text != "") {
			const attr = LABEL_FONT;
			
			//console.log("x", x, "y", y, "width", width, "height", height );
			
			wrappedText = text;
			if (labelAttrs && labelAttrs.wrapWidth) {
				wrappedText = this.wrapTextToWidth(wrappedText, labelAttrs.wrapWidth);
			}
			const realWidth = this.getStringWidth(wrappedText, attr);
			const realHeight = this.getStringHeight(wrappedText, attr);
			
			const textAreaCX = x + width/2;
			const textAreaCY = y + 3 + height + this.getStringHeight(wrappedText, attr)/2;
			
			let textX = textAreaCX;
			const textY = textAreaCY;

			const textAttrs = {};
			if (labelAttrs && labelAttrs.align) {
				switch (labelAttrs.align) {
					case "left": 
						textAttrs["text-anchor"] = "start"; 
						textX = textX - realWidth/2;
					break;
					case "center": 
						textAttrs["text-anchor"] = "middle"; 
					break;
					case "right": 
						textAttrs["text-anchor"] = "end"; 
						textX = textX + realWidth/2;
					break;
				}
			}
			if (labelAttrs && labelAttrs.wrapWidth) {
				if (true) {
					// Draw frameborder
					const textAreaStyle = {stroke: Color.LightSteelBlue2, "stroke-width": 1.0, "stroke-dasharray": "- "};
					const textAreaX = textAreaCX - realWidth/2;
					const textAreaY = textAreaCY+.5 - realHeight/2;
					const textArea = this.g.rect(textAreaX, textAreaY, realWidth, realHeight).attr(textAreaStyle);
					
					const textAreaLines = this.g.path("M" + textAreaX + " " + textAreaY + "L" + (textAreaX+realWidth) + " " + (textAreaY+realHeight) + "M" +  + (textAreaX+realWidth) + " " + textAreaY + "L" + textAreaX + " " + (textAreaY+realHeight));
					textAreaLines.attr(textAreaStyle);
					
					this.g.ellipse(textAreaCX, textAreaCY, 3, 3).attr({fill: Color.LightSteelBlue2, stroke: "none"});
				}
			}
			
			const label = this.g.text(textX, textY, wrappedText).attr(attr).attr(textAttrs);
			//label.id = Raphael.createUUID();
			//console.log("label ", label.id, ", ", wrappedText);
			
			if (this.fontSmoothing) {
				label.attr({stroke: LABEL_COLOR, "stroke-width":.4});
			}
			
			// debug
			if (debug) {
				const imageAreaStyle = {stroke: Color.grey61, "stroke-width": 1.0, "stroke-dasharray": "- "};
				const imageArea = this.g.rect(x+.5, y+.5, width, height).attr(imageAreaStyle);
				const imageAreaLines = this.g.path("M" + x + " " + y + "L" + (x+width) + " " + (y+height) + "M" +  + (x+width) + " " + y + "L" + x + " " + (y+height));
				imageAreaLines.attr(imageAreaStyle);
				const dotStyle = {fill: Color.Coral, stroke: "none"};
				this.g.ellipse(x, y, 3, 3).attr(dotStyle);
				this.g.ellipse(x+width, y, 2, 2).attr(dotStyle);
				this.g.ellipse(x+width, y+height, 2, 2).attr(dotStyle);
				this.g.ellipse(x, y+height, 2, 2).attr(dotStyle);
			}
			
			return label;
		}
	},
	
	vvoid: function(){}
};
