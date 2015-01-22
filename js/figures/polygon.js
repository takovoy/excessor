/**
 * Created by Пользователь on 21.01.2015.
 */

var Polygon = function(sidesCount,id,drawingObject,parameters){
    this.now = parameters || {};
    if(!parameters.radian){this.now.radian = Math.PI/180*270}
    Object.defineProperties(this,{
        sidesCount: {
            get: function(){
                return this.now.sidesCount;
            },
            set: function(value){
                this.now.sidesCount = value;
            }
        },
        x: {
            get: function(){
                if(this.parent){return this.now.x + this.parent.x}
                return this.now.x;
            },
            set: function(value){
                this.now.x = value;
            }
        },
        y: {
            get: function(){
                if(this.parent){return this.now.y + this.parent.y}
                return this.now.y;
            },
            set: function(value){
                this.now.y = value;
            }
        }
    });
    this.x = 0;
    this.y = 0;
    this.sidesCount = sidesCount;
    this.id = id || '' + Math.random();
    this.start = function(){
        drawingObject.stack.append(this);
    };
    this.stop = function(){
        drawingObject.stack.remove(this.id);
    };
    this.animate = function(context){
        if(this.sidesCount < 3){return false}
        context.beginPath();
        context.moveTo(
            formula.coordPointFromCircle(this.now.radian,this.now.radius,this.x,this.y)[0],
            formula.coordPointFromCircle(this.now.radian,this.now.radius,this.x,this.y)[1]
        );
        for(var i = 0;i < this.sidesCount;i++){
            context.lineTo(
                formula.coordPointFromCircle(Math.PI*2 / this.sidesCount * i + this.now.radian,this.now.radius,this.x,this.y)[0],
                formula.coordPointFromCircle(Math.PI*2 / this.sidesCount * i + this.now.radian,this.now.radius,this.x,this.y)[1]
            );
        }
        context.lineTo(
            formula.coordPointFromCircle(this.now.radian,this.now.radius,this.x,this.y)[0],
            formula.coordPointFromCircle(this.now.radian,this.now.radius,this.x,this.y)[1]
        );
        if(this.now.fill){
            context.fillStyle = this.now.fill;
            context.fill();
        }
        if(this.now.stroke){
            context.strokeStyle = this.now.stroke;
            context.stroke();
        }
        context.closePath();
    }
};
Polygon.prototype = Object.create(CanvasObject.prototype);