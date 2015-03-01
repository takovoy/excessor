/**
 * Created by Пользователь on 21.01.2015.
 */

var Polygon = function(sidesCount,id,drawingObject,parameters){
    this.now = parameters || {};
    if(drawingObject)this.drawingStack = drawingObject.stack;

    if(!this.now.radian){this.now.radian = Math.PI/180*270}
    Object.defineProperties(this,{
        sidesCount: {
            get: function(){
                return this.now.sidesCount;
            },
            set: function(value){
                this.now.sidesCount = +value;
            }
        }
    });
    this.sidesCount = sidesCount;
    this.id = id || '' + Math.random();
    this.constructor = Polygon;
};
Polygon.prototype = Object.create(CanvasObject.prototype);

Polygon.prototype.animate = function(context){
    if(this.sidesCount < 3){return false}
    context.beginPath();
    context.moveTo(
        formula.getPointOnCircle(this.now.radian,this.now.radius,this.x,this.y)[0],
        formula.getPointOnCircle(this.now.radian,this.now.radius,this.x,this.y)[1]
    );
    for(var i = 0;i < this.sidesCount;i++){
        context.lineTo(
            formula.getPointOnCircle(Math.PI*2 / this.sidesCount * i + this.now.radian,this.now.radius,this.x,this.y)[0],
            formula.getPointOnCircle(Math.PI*2 / this.sidesCount * i + this.now.radian,this.now.radius,this.x,this.y)[1]
        );
    }
    context.lineTo(
        formula.getPointOnCircle(this.now.radian,this.now.radius,this.x,this.y)[0],
        formula.getPointOnCircle(this.now.radian,this.now.radius,this.x,this.y)[1]
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
};