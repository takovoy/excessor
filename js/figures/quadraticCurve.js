/**
 * Created by takovoy on 11.01.2015.
 */

var QuadraticCurve = function(points,id,drawingObject,parameters){
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
    this.now = parameters || {};
    this.points = points || [];
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
    context.beginPath();
    if(this.now.moveTo){
        if(this.points.length == 0){
            context.closePath();
            return;
        }
        context.moveTo(this.now.moveTo[0],this.now.moveTo[1]);
    } else {
        if(this.points.length < 2){
            context.closePath();
            return;
        }
    }
    for(var i = 1;this.points[i];i += 2){
        context.quadraticCurveTo(
            this.points[i - 1][0],
            this.points[i - 1][1],
            this.points[i][0],
            this.points[i][1]
        );
    }
    context.stroke();
    context.closePath();
};