/**
 * Created by yeIAmCrasyProgrammer on 28.10.2016.
 */

var scene   = new Drawing(1000,1000);

var beamsCluster = new Cluster(8,{
    radian  : function (iterator,cluster) {
        return Math.PI*2 / (cluster.count + 1);
    },
    x       : function(iteration,cluster){
        return formula.getPointOnCircle(
                (Math.PI*2/(cluster.count + 1)) * (iteration + 1),
                70,
                -cluster.parent.now.x,
                -cluster.parent.now.y
            )[0] / iteration
    },
    y       : function(iteration,cluster){
        return formula.getPointOnCircle(
                (Math.PI*2/(cluster.count + 1)) * (iteration + 1),
                70,
                -cluster.parent.now.x,
                -cluster.parent.now.y
            )[1] / iteration
    }
});

var center  = new Circle({
    id              :'sunCenter',
    drawing         : scene,
    settings        : {fill: '#FFB151',x:500,y:350},
    radius          : 15
})
    .moveProperty('radius',40,1000)
    .moveProperty('fill','#ff5555',1000)
    .start();

center
    .moveProperty('radian',Math.PI*2,50000)
    .operationContext
    .options.recourse = true;

center
    .childrens
    .append(new Curve({
        id              : 'light',
        settings        : {
            fill        : '#FFB151',
            shift       : 100,
            step        : 1,
            radian      : 0
        },
        x               : formula.getPointOnCircle(
            (Math.PI*2/beamsCluster.count),
            70,
            0,
            0
        )[0],
        y               : formula.getPointOnCircle(
            (Math.PI*2/beamsCluster.count),
            70,
            0,
            0
        )[1],
        points          : [
            [0,0],
            [20,0],
            [50,50],
            [-60,10],
            [0,150],
            [60,10],
            [-50,50],
            [-20,0],
            [0,0]
        ]
    }))
    .operationContext
    .childrens
    .append(beamsCluster)
    .moveProperty('points',[
        [0,0],
        [20,0],
        [45,50],
        [-50,10],
        [0,120],
        [50,10],
        [-45,50],
        [-20,0],
        [0,0]
    ],300)
    .operationContext
    .event(45,function(event,transform){
        transform.reverse = true;
    })
    .event(0,function(event,transform){
        transform.reverse = false;
    });

center.moveProperty('fill','#ff5555',1000);