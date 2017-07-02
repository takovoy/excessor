
function Path ( options ) {
    Line.apply(this,arguments);
    this.constructor = Path;
}

Path.prototype = Object.create( CanvasObject.prototype );

Object.defineProperties(Path.prototype,{
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
                if(this.now.points[key].length > 3){
                    this.services.points[key] = this.now.points[key];
                    this.services.points[key][4] = (this.services.points[key][4] || 0) + radian;
                    continue;
                }
                this.services.points[key] = [
                    coordinate[0] * cos - coordinate[1] * sin,
                    coordinate[0] * sin + coordinate[1] * cos,
                    coordinate[2]
                ]
            }

            return this.services.points;

        },
        set: function(value){
            this.services.map   = formula.getMapOfPath(value,this.now.step);
            this.services.length= 0;
            for(var key in this.services.map){
                this.services.length += this.services.map[key];
            }
            this.now.points = value;
        }
    }
});
Path.prototype.animate = function(context){
    var points = this.points;
    var center = [this.x,this.y];
    context.beginPath();
    var toMovePoint = points[0];
    if(toMovePoint.length > 3){
        toMovePoint = [0,0];
    }
    context.moveTo(
        toMovePoint[0] + center[0],
        toMovePoint[1] + center[1]
    );
    if(this.now.shift > 100){
        this.now.shift = 100;
    }
    var lastPoint = points[0];
    for(var i = 0;i <= this.now.shift;i += this.now.step){
        var coord = formula.getPointOnPath(i,points,this.services);
        if(Math.abs(lastPoint[0] - coord[0]) < 1 && Math.abs(lastPoint[1] - coord[1]) < 1){continue}
        lastPoint = coord;
        context.lineTo(coord[0] + center[0],coord[1] + center[1]);
    }
    changeContext(context,this.now);
    context.closePath();
};