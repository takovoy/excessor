/**
 * Created by takovoy on 22.01.2015.
 */

var Curve = function(options){
    CanvasObject.apply(this,arguments);
    this.constructor    = Curve;
    this.now.points     = options.points;
};

Curve.prototype = Object.create(CanvasObject.prototype);

Curve.prototype.animate = function(context){
    context.beginPath();

    if(this.now.points.length < 2) {
        return
    }

    if(this.now.showBreakpoints){
        for(var j = 0;this.now.points[j];j++){
            context.moveTo(this.now.points[j][0] + this.parent.x,this.now.points[j][1] + this.parent.y);
            context.arc(this.now.points[j][0] + this.parent.x,this.now.points[j][1] + this.parent.y,2,0,Math.PI*2);
        }
        context.fill();
        context.closePath();
        context.beginPath();
    }

    context.moveTo(this.now.points[0][0] + this.parent.x,this.now.points[0][1] + this.parent.y);

    if(this.now.shift > 101){
        this.now.shift = 101;
    }

    for(var i = 0;i <= this.now.shift;i += this.now.step){
        var coord = formula.getPointOnCurve(i,this.now.points);
        context.lineTo(coord[0] + this.parent.x,coord[1] + this.parent.y);
    }

    changeContext(context,this.now);

    context.closePath();
};