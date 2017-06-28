var beamsCluster = new Cluster(8,{
    radian  : function (iterator,cluster) {return Math.PI*2 / (cluster.count + 1);},
    x       : function(iteration,cluster){
        return formula.getPointOnCircle(
                (Math.PI*2/(cluster.count + 1)) * (iteration),
                70,
                -cluster.parent.now.x,
                -cluster.parent.now.y
            )[0] / iteration
    },
    y       : function(iteration,cluster){
        return formula.getPointOnCircle(
                (Math.PI*2/(cluster.count + 1)) * (iteration),
                70,
                -cluster.parent.now.x,
                -cluster.parent.now.y
            )[1] / iteration
    }
});

var center = new Circle({id: 'sunCenter', drawing: scene, settings: {fill: '#FFB151',x:150,y:150}, radius: 15}).start();

center
    .moveProperty('radius',47,1500)
    .operationContext
    .event('callback', function (event, transform, canvasObject) {
        canvasObject
            .moveProperty('radius',45,1000)
            .operationContext
            .event(0,function (event, transform, canvasObject) {transform.reverse = false;})
            .event(100,function (event, transform, canvasObject) {transform.reverse = true;});

        canvasObject.childrens.list[1]
            .moveProperty('radius',40,1000)
            .operationContext
            .event(0,function (event, transform, canvasObject) {transform.reverse = false;})
            .event(100,function (event, transform, canvasObject) {transform.reverse = true;});

        canvasObject.childrens.list[2].moveProperty('radius',30,800);
    });

center
    .append(new Circle  ({id: 1, settings: {fill: '#ff8951'}, radius: 35}))
    .append(new Circle  ({id: 2, settings: {fill: '#ff5555'}, radius: 35}))
    .append(new Curve   ({
        id              : 'light',
        settings        : {fill: '#FFB151', radian: -Math.PI/2}, x: 70,
        points          : [[0,0], [20,0], [45,50], [-50,10], [0,130], [50,10], [-45,50], [-20,0], [0,0]]
    }))
    .operationContext
    .append(beamsCluster)
    .moveProperty('points',[[0,0], [20,0], [50,50], [-60,10], [0,150], [60,10], [-50,50], [-20,0], [0,0]],400)
    .operationContext
    .options.recourse = true;