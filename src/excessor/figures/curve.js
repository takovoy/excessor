/**
 * Created by takovoy on 22.01.2015.
 */

var Curve = function(options){
    CanvasObject.apply(this,arguments);
    this.constructor    = Curve;
    this.now.points     = this.now.points || options.points || [];
    this.services.points= [];
};

Curve.prototype = Object.create(CanvasObject.prototype);


Object.defineProperties(CanvasObject.prototype,{
    points : {
        get: function(){
            if(this.radian != this.services.radian){
                if(!this.services.points){
                    this.services.points = [];
                }
                for(var key in this.now.points){
                    this.services.points[key] = [
                        this.now.points[key][0] * Math.cos(this.radian) -
                        this.now.points[key][1] * Math.sin(this.radian),
                        this.now.points[key][0] * Math.sin(this.radian) +
                        this.now.points[key][1] * Math.cos(this.radian)
                    ]
                }
                this.services.radian = this.radian;
            }
            return this.services.points;
        },
        set: function(value){
            this.now.points = value;
        }
    }
});
Curve.prototype.animate = function(context){

    if(this.now.points.length < 2) {
        return
    }

    //отобразить контрольные точки на холсте
    if(this.now.showBreakpoints){
        context.beginPath();

        markControlPoints( this.points, context, this);

        context.fill();
        context.closePath();
    }

    context.beginPath();
    context.moveTo(
        this.points[0][0] + this.x,
        this.points[0][1] + this.y
    );

    if(this.now.shift > 101){
        this.now.shift = 101;
    }

    for(var i = 0;i <= this.now.shift;i += this.now.step){
        var coord = formula.getPointOnCurve(i,this.points);
        context.lineTo(coord[0] + this.x,coord[1] + this.y);
    }

    changeContext(context,this.now);

    context.closePath();
};