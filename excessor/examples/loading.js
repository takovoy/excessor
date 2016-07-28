/**
 * Created by Dima on 24.01.2016.
 */

var scene = new Drawing(1000,700);

var circles = [
    new Circle({
        drawing : scene,
        settings: {
            x       : 0,
            y       : 0,
            fill    : getRandomRGB(50,220)
        },
        radius  : 30
    }),
    new Circle({
        drawing : scene,
        settings: {
            x       : 1000,
            y       : 0,
            fill    : getRandomRGB(50,220)
        },
        radius  : 30
    }),
    new Circle({
        drawing : scene,
        settings: {
            x       : 0,
            y       : 700,
            fill    : getRandomRGB(50,220)
        },
        radius  : 30
    }),
    new Circle({
        drawing : scene,
        settings: {
            x       : 1000,
            y       : 700,
            fill    : getRandomRGB(50,220)
        },
        radius  : 30
    })
];

for(var key in circles){
    circles[key].start();
    circles[key]
        .move([500,350],1000)
        .event(80,function(canvasObject,transform,event){
            //canvasObject.
        });
}

window.onload = function(){
    document.body.appendChild(scene.DOMObject);
    scene.fps = 60;
};