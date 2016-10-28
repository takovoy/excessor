/**
 * Created by yeIAmCrasyProgrammer on 28.10.2016.
 */

var scene   = new Drawing(1000,500);

var beamsCluster = new Cluster(5,{
    radian  : Math.PI*2 / 6,
    x       : function(iteration,cluster){
        return formula.getPointOnCircle(
                (Math.PI*2/6) * (iteration + 1),
                70,
                -cluster.parent.now.x,
                -cluster.parent.now.y
            )[0] / iteration
    },
    y       : function(iteration,cluster){
        return formula.getPointOnCircle(
                (Math.PI*2/6) * (iteration + 1),
                70,
                -cluster.parent.now.x,
                -cluster.parent.now.y
            )[1] / iteration
    }
});

var center  = new Circle({
    id              :'sunCenter',
    drawing         : scene,
    settings        : {fill: '#FFB151',x:250,y:250},
    radius          : 15
})
    .moveProperty('radius',40,1000)
    .moveProperty('fill','#ff5555',1000)
    .start();

center
    .moveProperty('radian',Math.PI*2,10000)
    .operationContext
    .options.recourse = true;

center.childrens
    .append(new Curve({
        id              : 'light',
        settings        : {
            stroke      : '#FFB151',
            shift       : 100,
            step        : 1
        },
        x               : formula.getPointOnCircle(
            (Math.PI*2/6),
            70,
            0,
            0
        )[0],
        y               : formula.getPointOnCircle(
            (Math.PI*2/6),
            70,
            0,
            0
        )[1],
        points          : [
            [0,0],
            [50,50],
            [0,100],
            [-50,150],
            [0,200]
        ]
    }))
    .operationContext
    .moveProperty('radius',30,1000)
    .childrens
    .append(beamsCluster);

center.moveProperty('fill','#ff5555',1000);