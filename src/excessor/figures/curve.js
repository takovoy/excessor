
function Curve ( options ) {
    Line.apply(this,arguments);
    this.constructor = Curve;
}

Curve.prototype = Object.create( CanvasObject.prototype );

Object.defineProperties(Curve.prototype,{
    points : {
        get: function(){
            if(!this.services.points){
                this.services.points = [];
            }

            var radian  = this.radian,
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
            this.services.length = formula.getLengthOfCurve(value,this.now.step);
            this.now.points = value;
        }
    }
});
Curve.prototype.animate = function(context){
    var points = this.points;
    var center = [this.x,this.y];
    if(points.length < 2) {return}
    context.moveTo(
        points[0][0] + center[0],
        points[0][1] + center[1]
    );
    if(this.now.shift > 100){
        this.now.shift = 100;
    }
    var lastPoint = points[0];
    for(var i = 0;i <= this.now.shift;i += this.now.step){
        var coord = formula.getPointOnCurve(i,points);
        if(Math.abs(lastPoint[0] - coord[0]) < 1 && Math.abs(lastPoint[1] - coord[1]) < 1){continue}
        lastPoint = coord;
        context.lineTo(coord[0] + center[0],coord[1] + center[1]);
    }
    changeContext(context,this.now);
};