/**
 * Created by takovoy on 12.12.2014.
 */

var Line = function(point,id,drawingObject){
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
        point: {
            get: function(){
                return this.now.point;
            },
            set: function(value){
                this.now.point = value;
            }
        }
    });
    this.now = {};
    this.point = point || [];
    this.pushPoint = function(value){
        this.now.point.push(value);
    };
    this.id = id || '' + Math.random();
    this.constructor = Line;
};
Line.prototype = Object.create(CanvasObject.prototype);

Line.prototype.animate = function(context){
    if(this.point.length < 2){return;}
    context.beginPath();
    context.moveTo(this.point[0][0],this.point[0][1]);
    for(var i = 1;this.point[i];i++){
        context.lineTo(this.point[i][0],this.point[i][1]);
    }
    context.stroke();
    context.closePath();
};