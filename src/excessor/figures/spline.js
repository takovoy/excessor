/**
 * Created by takovoy on 22.01.2015.
 */

function Spline ( options ) {
    CanvasObject.apply(this,arguments);
    this.constructor    = Spline;
    this.now.step       = +this.now.step || +options.step || 1;
    this.points         = this.now.points || options.points || [];
    this.services.points= [];
}

Spline.prototype = Object.create( CanvasObject.prototype );

Object.defineProperties(Spline.prototype,{
    points : {
        get: function(){

            if(!this.services.points){
                this.services.points = [];
            }

            var radian  = this.radian - ( Math.PI/4 ),
                sin     = Math.sin( radian ),
                cos     = Math.cos( radian );

            for( var key = 0;this.now.points[key];key++){
                var coordinate = this.now.points[key];
                this.services.points[key] = [
                    coordinate[0] * cos - coordinate[1] * sin,
                    coordinate[0] * sin + coordinate[1] * cos,
                    coordinate[2]
                ]
            }

            return this.services.points;

        },
        set: function(value){
            this.services.map   = formula.getMapOfSpline(value,this.now.step);
            this.services.length= 0;
            for(var key in this.services.map){
                this.services.length += this.services.map[key];
            }
            this.now.points = value;
        }
    }
});
Spline.prototype.animate = function(context){
    var points = this.points;
    var center = [this.x,this.y];
    if(points.length < 2) {return}
    context.beginPath();
    context.moveTo(
        points[0][0] + center[0],
        points[0][1] + center[1]
    );
    if(this.now.shift > 100){
        this.now.shift = 100;
    }
    var lastPoint = points[0];
    for(var i = 0;i <= this.now.shift;i += this.now.step){
        var coord = formula.getPointOnSpline(i,points,this.services);
        if(Math.abs(lastPoint[0] - coord[0]) < 1 && Math.abs(lastPoint[1] - coord[1]) < 1){continue}
        lastPoint = coord;
        context.lineTo(coord[0] + center[0],coord[1] + center[1]);
    }
    changeContext(context,this.now);
    context.closePath();
};