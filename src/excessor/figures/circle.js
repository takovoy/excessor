/**
 * Created by takovoy on 30.11.2014.
 */

var Circle = function( options ){
    CanvasObject.apply( this, arguments );
    this.constructor    = Circle;
    this.now.radius     = this.now.radius || options.radius || 0;
    this.now.shift      = this.now.shift || options.shift || 100;
};

Circle.prototype = Object.create( CanvasObject.prototype );

Circle.prototype.animate = function( context ){
    context.beginPath();
    context.arc( this.x, this.y, this.now.radius, 0, Math.PI*2/100*this.now.shift );
    changeContext( context, this.now );
    context.closePath();
};