
function Spline ( options ) {
    Line.apply(this,arguments);
    this.constructor    = Spline;
}

Spline.prototype = Object.create( CanvasObject.prototype );

Object.defineProperties(Spline.prototype,{
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
    if(this.now.shift > 100){
        this.now.shift = 100;
    }

    var splines = [[]];
    var splineIndex = 0;
    for(var index = 0;points[index];index++){
        if(points[index] === false){
            splineIndex++;
            continue;
        }
        splines[splineIndex].push(points[index]);
    }

    for(splineIndex = 0;splines[splineIndex];splineIndex++){
        var spline = splines[splineIndex];
        context.moveTo(
            spline[0][0] + center[0],
            spline[0][1] + center[1]
        );
        var lastPoint = spline[0];
        for(var shift = 0;shift <= this.now.shift;shift += this.now.step){
            var coord = formula.getPointOnSpline(shift,spline,this.services);
            if(Math.abs(lastPoint[0] - coord[0]) < 1 && Math.abs(lastPoint[1] - coord[1]) < 1){continue}
            lastPoint = coord;
            context.lineTo(coord[0] + center[0],coord[1] + center[1]);
        }
    }
    changeContext(context,this.now);
};