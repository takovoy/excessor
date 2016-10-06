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

    if(this.now.points.length < 2) {
        return
    }

    //отобразить контрольные точки на холсте
    if(this.now.showBreakpoints){
        context.beginPath();

        markControlPoints( this.now.points, context, this);

        context.fill();
        context.closePath();
    }

    context.beginPath();
    context.moveTo(
        this.now.points[0][0] + this.x,
        this.now.points[0][1] + this.y
    );

    if(this.now.shift > 101){
        this.now.shift = 101;
    }

    for(var i = 0;i <= this.now.shift;i += this.now.step){
        var coord = formula.getPointOnCurve(i,this.now.points,this.now.radian);
        context.lineTo(coord[0] + this.x,coord[1] + this.y);
    }

    changeContext(context,this.now);

    context.closePath();
};