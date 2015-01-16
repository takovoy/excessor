/**
 * Created by takovoy on 30.11.2014.
 */

var canvas;
var circle;


canvas = new Drawing(200, 200,function(){return document.body});
circle = new Circle(20, 'myLittleCircle', canvas);
circle.x = circle.y = 100;
//window.addEventListener('load',function(){
//    circle.start();
//});