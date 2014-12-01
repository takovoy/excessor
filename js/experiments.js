/**
 * Created by takovoy on 30.11.2014.
 */

var Circle = function(x,y,radius,id,drawingObject){
    this.radius = radius;
    this.id = id || '' + Math.random();
    this.x = x || 0;
    this.y = y || 0;
    this.start = function(){
        drawingObject.stack.append(this);
    };
    this.stop = function(){
        drawingObject.stack.remove(this.id);
    };
};
Circle.prototype = Object.create(CanvasObject.prototype);

Circle.prototype.animate = function(context){
    context.beginPath();
    context.arc(this.x,this.y,this.radius,0,Math.PI*2);
    context.fill();
    context.closePath();
};