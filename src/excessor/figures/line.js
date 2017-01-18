/**
 * Created by takovoy on 12.12.2014.
 */

var Line = function(options){
    CanvasObject.apply(this,arguments);
    this.constructor    = Line;
    this.now.points     = this.now.points || options.points || [];
    this.services.points= [];
};

Line.prototype = Object.create(CanvasObject.prototype);

Line.prototype.animate = function(context){
    if(this.now.points.length < 2){return;}
    context.beginPath();
    context.moveTo(
        this.points[0][0] + this.x,
        this.points[0][1] + this.y
    );

    if(this.now.shift > 101){
        this.now.shift = 101;
    }
    for(var i = 0;i <= this.now.shift;i += this.now.step){
        var coord = formula.getPointOnLine(i,this.points);
        context.lineTo(coord[0] + this.x,coord[1] + this.y);
    }
    changeContext(context,this.now);
    context.closePath();
};