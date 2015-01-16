/**
 * Created by takovoy on 30.11.2014.
 */

var canvas;
var circle;

window.onload = function(){
    canvas = new Drawing(200, 200);
    circle = new Circle(20, 'myLittleCircle', canvas);
    circle.start();
};