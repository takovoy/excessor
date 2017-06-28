var line = new Line({
    drawing: scene,
    points: [[100,100], [200,200]],
    settings: {stroke: '#000000'}
}).start();

var path = new Path({
    drawing: scene,
    points: [[100,110], [200,210]],
    settings: {stroke: '#000000'}
}).start();