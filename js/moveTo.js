/**
 * Created by takovoy on 05.12.2014.
 */

var moveTo = function(canvasObject){
    var fps = canvasObject.drawingObject.fps;
    var incidence = 1000 / fps;
    for(var key in canvasObject.after.list){
        if(!canvasObject.now[key] ||
            canvasObject.now[key] == canvasObject.after.list[key]
        ){
            canvasObject.after.remove(key);
            continue;
        }
        canvasObject.now[key] += canvasObject.after.list[key].value / (canvasObject.after.list[key].time / incidence);
    }
};

var dynamic = {

    move: function(canvasObject){
        var fps = canvasObject.drawingObject.fps;
        var incidence = 1000 / fps;
        for(var key in canvasObject.after.list){
            if(!canvasObject.now[key] ||
                canvasObject.now[key] == canvasObject.after.list[key]
            ){
                canvasObject.after.remove(key);
                continue;
            }
            canvasObject.now[key] += canvasObject.after.list[key].value / (canvasObject.after.list[key].time / incidence);
        }
    },

    data: {
        trajectory: {
            circle  : function(radius,center,shift){
                return formula.getPointOnCircle(Math.PI*2/100*shift,radius,center[0],center[1]);
            },
            polygon : function(radius,center,shift){},
            line    : function(points,shift){},
            curve   : function(points,shift){}
        },
        color   : null,
        radian  : null,
        radius  : null
    }
};