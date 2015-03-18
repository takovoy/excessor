/**
 * Created by takovoy on 30.11.2014.
 */

var Circle = function(radius,id,drawingObject,parameters){
    this.now            = parameters || {};
    this.now.radius     = radius;
    this.id             = id || '' + Math.random();
    this.constructor    = Circle;
    if(drawingObject){
        this.drawingObject = drawingObject;
    }
};

Circle.prototype = Object.create(CanvasObject.prototype);

Circle.prototype.animate = function(context){
    context.beginPath();
    context.arc(this.x,this.y,this.now.radius,0,Math.PI*2);
    changeContext(context,this.now);
    context.closePath();
};