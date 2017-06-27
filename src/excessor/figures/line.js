/**
 * Created by takovoy on 12.12.2014.
 */

function Line ( options ) {
    CanvasObject.apply(this,arguments);
    this.constructor    = Line;
    this.now.points     = this.now.points || options.points || [];
    this.services.points= [];
}

Line.prototype = Object.create(CanvasObject.prototype);

Object.defineProperties(Line.prototype,{
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