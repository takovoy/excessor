/**
 * Created by takovoy on 30.11.2014.
 */

var Circle = function(radius,id,drawingObject,parameters){
    this.now = parameters || {};
    if(drawingObject)this.drawingStack = drawingObject.stack;

    Object.defineProperties(this,{
        radius: {
            get: function(){
                return this.now.radius;
            },
            set: function(value){
                this.now.radius = value;
            }
        }
    });
    this.radius = radius;
    this.id = id || '' + Math.random();
    this.constructor = Circle;
};
Circle.prototype = Object.create(CanvasObject.prototype);

Circle.prototype.animate = function(context){
    context.beginPath();
    context.arc(this.x,this.y,this.radius,0,Math.PI*2);
    if(this.now.fill){
        context.fillStyle = this.now.fill;
        context.fill();
    }
    if(this.now.stroke){
        context.strokeStyle = this.now.stroke;
        context.stroke();
    }
    context.closePath();
};