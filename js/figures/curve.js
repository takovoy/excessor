/**
 * Created by takovoy on 22.01.2015.
 */

var Curve = function(points,id,drawingObject,parameters){
    this.now = parameters || {};
    if(drawingObject)this.drawingObject = drawingObject;
    this.after = {
        list: {},
        append: function(name,data){
            this.list[name] = data;
        },
        remove: function(name){
            delete this.list[name];
        }
    };

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
    this.points = points;
    this.id = id || '' + Math.random();
    this.constructor = Curve;
};
Curve.prototype = Object.create(CanvasObject.prototype);

Curve.prototype.animate = function(context){
    context.beginPath();
    if(this.points.length < 2) {return}
    if(this.now.showBreakpoints){
        for(var j = 0;this.points[j];j++){
            context.moveTo(this.points[j][0],this.points[j][1]);
            context.arc(this.points[j][0],this.points[j][1],2,0,Math.PI*2);
        }
    }
    context.fill();
    context.closePath();
    context.beginPath();
    context.moveTo(this.points[0][0],this.points[0][1]);
    if(this.now.shift > 101){
        this.now.shift = 101;
    }
    for(var i = 0;i <= this.now.shift;i += this.now.step){
        var coord = formula.getPointOnCurve(i,this.points);
        context.lineTo(coord[0],coord[1]);
    }
    changeContext(context,this.now);
    context.closePath();
};