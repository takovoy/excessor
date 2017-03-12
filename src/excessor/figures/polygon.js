/**
 * Created by Пользователь on 21.01.2015.
 */

function Polygon ( options ) {
    CanvasObject.apply( this, arguments );
    this.constructor        = Polygon;
    this.now.sidesCount     = this.now.sidesCount || options.sidesCount || 3;
    this.now.radius         = this.now.radius || options.radius || 0;
}

Polygon.prototype           = Object.create( CanvasObject.prototype );

Polygon.prototype.animate   = function( context ){
    if( this.now.sidesCount < 3 ){ return false }

    var start = formula.getPointOnCircle(this.radian,this.now.radius,this.x,this.y);

    context.beginPath();
    context.moveTo( start[0], start[1] );

    for( var i = 0; i < this.now.sidesCount; i++ ){
        var coordinate = formula.getPointOnCircle( Math.PI*2/this.now.sidesCount*i+this.radian, this.now.radius, this.x, this.y );
        context.lineTo( coordinate[0], coordinate[1] );
    }

    context.lineTo( start[0], start[1] );

    changeContext(context,this.now);
    context.closePath();
};