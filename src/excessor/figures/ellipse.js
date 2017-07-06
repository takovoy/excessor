/**
 * Created by takovoySuper on 25.06.2015.
 */

function Ellipse ( options ) {
    CanvasObject.apply(this,arguments);
    this.constructor= Ellipse;
    this.now.step   = this.now.step || 0.1;
}

Ellipse.prototype = Object.create(CanvasObject.prototype);

Ellipse.prototype.animate = function(context){
    var shift = 0;
    var coord = formula.getPointOnEllipse(this.now.semiAxisX,this.now.semiAxisY,shift,this.now.radian,this.x,this.y);
    context.moveTo(coord[0],coord[1]);

    for(;shift <= Math.PI*2;shift += this.now.step){
        var coordinate = formula.getPointOnEllipse(this.now.semiAxisX,this.now.semiAxisY,shift,this.now.radian,this.x,this.y);
        context.lineTo(coordinate[0],coordinate[1]);
    }
    context.lineTo(coord[0],coord[1]);

    changeContext(context,this.now);
};