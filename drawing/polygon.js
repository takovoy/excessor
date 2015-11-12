/**
 * Created by takovoy on 21.01.2015.
 */


var polygon = new Polygon({
    id          :'myLittlePolygon',
    drawing     :drawingData.drawing,
    settings    :{
        radius  : 30,
        fill    :   getRandomRGB(100,250)
    },
    sidesCount  : 5
});
polygon.x = polygon.y = 100;