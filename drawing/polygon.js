/**
 * Created by takovoy on 21.01.2015.
 */


var polygon = new Polygon(5,'myLittlePolygon',canvas,
    {
        radius: 30,
        fill:   getRandomRGB(100,250)
    }
);
polygon.x = polygon.y = 100;

window.addEventListener('load',function(){
//    polygon.start();
});