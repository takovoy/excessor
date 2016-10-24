/**
 * Created by Пользователь on 21.01.2015.
 */

var Polygon = function(options){
    CanvasObject.apply(this,arguments);
    this.constructor        = Polygon;
    this.now.sidesCount     = options.sidesCount;
    if(!this.now.radian){this.now.radian = Math.PI/180*270}
};

Polygon.prototype           = Object.create(CanvasObject.prototype);

Polygon.prototype.animate   = function(context){
    if(this.now.sidesCount < 3){
        return false
    }

    context.beginPath();

    context.moveTo(
        formula.getPointOnCircle(this.radian,this.now.radius,this.x,this.y)[0],
        formula.getPointOnCircle(this.radian,this.now.radius,this.x,this.y)[1]
    );

    for(var i = 0;i < this.now.sidesCount;i++){
        context.lineTo(
            formula.getPointOnCircle(Math.PI*2 / this.now.sidesCount * i + this.radian,this.now.radius,this.x,this.y)[0],
            formula.getPointOnCircle(Math.PI*2 / this.now.sidesCount * i + this.radian,this.now.radius,this.x,this.y)[1]
        );
    }

    context.lineTo(
        formula.getPointOnCircle(this.radian,this.now.radius,this.x,this.y)[0],
        formula.getPointOnCircle(this.radian,this.now.radius,this.x,this.y)[1]
    );

    changeContext(context,this.now);

    context.closePath();
};