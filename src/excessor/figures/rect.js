/**
 * Created by takovoy on 30.11.2014.
 */

function Rect ( options ) {
    CanvasObject.apply( this, arguments );
    this.constructor    = Rect;
    this.now.width      = this.now.width || options.width || 0;
    this.now.height     = this.now.height || options.height || this.now.width;
}

Rect.prototype = Object.create( CanvasObject.prototype );

Rect.prototype.animate = function( context ){
    var radian = this.radian;
    var coord  = [this.x,this.y];
    context.moveTo(coord[0],coord[1]);
    coord = formula.getPointOnCircle(radian,this.width,coord[0],coord[1]);
    context.lineTo(coord[0],coord[1]);
    coord = formula.getPointOnCircle(radian + Math.PI / 2,this.height,coord[0],coord[1]);
    context.lineTo(coord[0],coord[1]);
    coord = formula.getPointOnCircle(radian + Math.PI / 2,this.height,this.x,this.y);
    context.lineTo(coord[0],coord[1]);
    context.lineTo(this.x,this.y);
    changeContext( context, this.now );
};