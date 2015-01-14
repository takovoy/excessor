/**
 * Created by takovoy on 05.12.2014.
 */

var moveTo = function(canvasObject,timeStep){
    for(var key in canvasObject.after.list){
        if(!canvasObject.now[key] ||
            canvasObject.now[key] == canvasObject.after.list[key]
        ){
            canvasObject.after.remove(key);
            continue;
        }
        canvasObject.now[key] += canvasObject.after.list[key].time;
    }
};