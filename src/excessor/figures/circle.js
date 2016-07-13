/**
 * Created by takovoy on 30.11.2014.
 */

var Circle = function(options){
    CanvasObject.apply(this,arguments);
    this.constructor    = Circle;
    this.now.radius     = options.radius;
};

Circle.prototype = Object.create(CanvasObject.prototype);

Circle.prototype.animate = function(context){
    context.beginPath();
    context.arc(this.x,this.y,this.now.radius,0,Math.PI*2);
    changeContext(context,this.now);
    context.closePath();
};