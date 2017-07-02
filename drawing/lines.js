//var line = new Line({
//    drawing: scene,
//    points: [[100,100], [200,200]],
//    settings: {stroke: '#000000'}
//}).start();

var path1 = new Path({
    drawing: scene,
    points: [[20,40,Math.PI,0], [150,0], [100,100]],
    settings: {stroke: '#000000',x:40,y:20}
}).start();

//var path11 = new Path({
//    drawing: scene,
//    points: [[20,20,Math.PI,0], [100,120], [200,220]],
//    settings: {stroke: '#000000',x:20,y:20}
//}).start();

//var path2 = new Path({
//    drawing: scene,
//    points: [[100,140], [20,20,0,Math.PI], [200,240]],
//    settings: {stroke: '#000000'}
//}).start();

var path3 = new Path({
    drawing: scene,
    points: [[100,160], [200,260], [40,20,Math.PI,Math.PI*2 + Math.PI,Math.PI/4], [20,20,0,Math.PI*2],[250,350]],
    settings: {stroke: '#000000',shift:0}
}).start().moveProperty('shift',100,5000);

//var path4 = new Path({
//    drawing: scene,
//    points: [[20,20,0,Math.PI*2]],
//    settings: {stroke: '#000000',x:250,y:350}
//}).start();