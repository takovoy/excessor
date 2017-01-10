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

Object.defineProperties(Line.prototype,{
    points : {
        get: function(){
            if(this.radian != this.services.radian){
                if(!this.services.points){
                    this.services.points = [];
                }
                var radian = this.radian - (Math.PI/4);
                for(var key in this.now.points){
                    this.services.points[key] = [
                        this.now.points[key][0] * Math.cos(radian) -
                        this.now.points[key][1] * Math.sin(radian),
                        this.now.points[key][0] * Math.sin(radian) +
                        this.now.points[key][1] * Math.cos(radian)
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