/**
 * Created by takovoy on 12.12.2014.
 */

var Line = function(options){
    CanvasObject.apply(this,arguments);
    this.constructor    = Line;
    this.now.points      = options.points || [];
};

Line.prototype = Object.create(CanvasObject.prototype);

Line.prototype.animate = function(context){
    if(this.now.points.length < 2){return;}
    context.beginPath();
    context.moveTo(this.now.points[0][0],this.now.points[0][1]);
    for(var i = 1;this.now.points[i];i++){
        context.lineTo(this.now.points[i][0],this.now.points[i][1]);
    }
    context.stroke();
    context.closePath();
};