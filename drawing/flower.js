﻿/**
 * Created by Пользователь on 21.01.2015.
 */

var scene = new Drawing(1000,500);

var sun = new CanvasObject({
    id          :'myFlowerAnimate',
    drawing     : scene,
    settings        : {
        shift: 0,
        step: 0.1,
        petalCount: 6
    }
});

sun.x = sun.y = 100;

sun.childrens.append(new Curve({
    id              : 'sheet_0',
    drawing         : scene,
    settings        : {step: 1,shift: 0,stroke: 'green'},
    points          : [
        [0,150],
        [50,60],
        [180,280],
        [50,40],
        [70,230],
        [0,150]
    ]
}));

sun.childrens.append(new Curve({
    id              : 'sheet_1',
    drawing         : scene,
    settings        : {step: 1,shift: 0,stroke: 'green'},
    points          : [
        [0,150],
        [-50,60],
        [-180,280],
        [-50,40],
        [-50,230],
        [0,150]
    ]
}));

sun.childrens
    .append(new Curve({
        id              : 'flowerStem',
        drawing         : scene,
        settings        : {step: 1,shift: 1,stroke: 'green'},
        points          : [
            [0,0],
            [40,100],
            [-40,200],
            [0,300]
        ]
    }))
    .operationContext
    .moveProperty('shift',100,3500)
    .operationContext
    .event(50,function(event,transform,canvasObject){
        //transform.pause();
        sun.childrens.list['sheet_0'].transform(new Transform({
            property:'shift',
            end     : 100,
            time    : 3500,
            recourse: false
        }))
            .operationContext
            .event(100,function(event,transform,canvasObject){
                //transform.reverse = true;
            });

        sun.childrens.list['sheet_1'].moveProperty('shift',100,3500);

        sun.animate = function(){};
    });

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

var center = sun.childrens.append(new Circle({
    id              :'sunCenter',
    drawing         : scene,
    settings        : {fill: '#FFB151',x:0,y:0},
    radius          : 15
}))
    .operationContext
    .moveProperty('radius',40,1000)
    .moveProperty('radian',3,1000)
    .moveProperty('fill','#ff5555',1000);

center.childrens
    .append(new Polygon({
        id              : 'beam_',
        settings        : {
            radius      : 5,
            radian      : (Math.PI*2/6),
            fill        : '#FFB151'
        },
        sidesCount      : 3,
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
        )[1]
    }))
    .operationContext
    .moveProperty('radius',30,1000)
    .childrens
    .append(beamsCluster);

console.log(beamsCluster);

sun.childrens.list.sunCenter.moveProperty('fill','#ff5555',1000);

sun.animate = function(context){
    if(center.radius >= 39){
        this.now.step = (this.now.step / 1.5) * 1.4;
    }
};