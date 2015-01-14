/**
 * Created by takovoy on 11.01.2015.
 */

var QuadraticCurve = function(points,id,drawingObject){
    Object.defineProperties(this,{
        points: {
            get: function(){
                return this.now.points;
            },
            set: function(value){
                this.now.points = value;
            }
        }
    });
    this.now = {};
    this.points = points;
    this.id = id || '' + Math.random();
    this.start = function(){
        drawingObject.stack.append(this);
    };
    this.stop = function(){
        drawingObject.stack.remove(this.id);
    };
};
QuadraticCurve.prototype = Object.create(CanvasObject.prototype);

QuadraticCurve.prototype.animate = function(context){
    if(this.points.length < 2){return;}
    context.beginPath();
    for(var i = 1;this.points[i];i += 2){

    }
    context.closePath();
};