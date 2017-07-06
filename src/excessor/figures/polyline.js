/**
 * Created by takovoy on 31.07.2016.
 */

function Polyline (options){
    CanvasObject.apply(this,arguments);
    this.constructor    = Polyline;
    this.now.points     = options.points;
}

Polyline.prototype = Object.create(CanvasObject.prototype);

Polyline.prototype.animate = function(context){
    if(this.now.points.length < 2) {
        return
    }

    context.moveTo(
        this.now.points[0][0] + this.x,
        this.now.points[0][1] + this.y
    );

    if(this.now.shift > 101){
        this.now.shift = 101;
    }

    for(var i = 0;i <= this.now.shift;i += this.now.step){
        var coord = formula.getPointOnCurve(i,this.now.points);
        context.lineTo(coord[0] + this.parent.x,coord[1] + this.parent.y);
    }

    changeContext(context,this.now);
};