/**
 * Created by takovoy on 30.11.2014.
 */

function Circle ( options ) {
    CanvasObject.apply( this, arguments );
    this.constructor    = Circle;
    this.now.radius     = this.now.radius || options.radius || 0;
    if(this.now.shift === 0 || options.shift === 0){
        this.now.shift  = 0;
    } else {
        this.now.shift  = this.now.shift || options.shift || 100;
    }
}

Circle.prototype = Object.create( CanvasObject.prototype );

Circle.prototype.animate = function( context ){
    context.beginPath();
    var radian = this.radian;
    context.arc( this.x, this.y, this.now.radius, radian, Math.PI*2/100*this.now.shift + radian );
    changeContext( context, this.now );
    context.closePath();
};