/**
 * Created by takovoy on 25.09.2016.
 */


var plane = new CanvasObject({
    id: 'plane',
    drawing: scene
});

var sky = new CanvasObject({
    id: 'sky',
    drawing: scene
});

var ground = new CanvasObject({
    id: 'ground',
    drawing: scene
});

ground.x = 0;
ground.y = 300;

plane
    .childrens
    .append(sky)
    .childrens
    .append(ground);

ground.childrens.append(new Curve({
    id: 'lastPlane',
    drawing: scene,
    settings        : {step: 1,shift: 100,fill: '#ffffff'},
    points          : [
        [0,0],
        [500,-100],
        [2000,100],
        [2000,400],
        [500,400],
        [0,400]
    ],
    x: -100,
    y: 20
}))
    .operationContext
    .moveProperty('x',0,300)
    .moveProperty('fill','#fce883',600);

ground.childrens.append(new Curve({
    id: 'middlePlane',
    drawing: scene,
    settings        : {step: 1,shift: 100,fill: '#ffffff'},
    points          : [
        [0,0],
        [500,-100],
        [2000,100],
        [2000,400],
        [500,400],
        [0,400]
    ],
    x: -200,
    y: 50
}))
    .operationContext
    .moveProperty('x',0,600)
    .moveProperty('fill','#ffe570',600);

ground.childrens.append(new Curve({
    id: 'firstPlane',
    drawing: scene,
    settings        : {step: 1,shift: 100,fill: '#ffffff'},
    points          : [
        [0,0],
        [500,-100],
        [2000,100],
        [2000,400],
        [500,400],
        [0,400]
    ],
    x: -300,
    y: 100
}))
    .operationContext
    .moveProperty('x',0,800)
    .moveProperty('fill','#fcdd76',600);

sky.childrens.append(new Curve({
    id: 'lastPlane',
    drawing: scene,
    settings        : {step: 1,shift: 100,fill: '#ffffff'},
    points          : [
        [0,0],
        [500,-100],
        [2000,-200],
        [2000,600],
        [500,400],
        [0,400]
    ],
    x: -100,
    y: 0
}))
    .operationContext
    .moveProperty('x',0,300)
    .moveProperty('fill','#e9eef5',900);

sky.childrens.append(new Curve({
    id: 'middlePlane',
    drawing: scene,
    settings        : {step: 1,shift: 100,fill: '#ffffff'},
    points          : [
        [0,0],
        [500,-100],
        [2000,-200],
        [2000,600],
        [500,400],
        [0,400]
    ],
    y: -130
}))
    .operationContext
    .move([0,-180],600)
    .moveProperty('fill','#e6e6fa',1200);

sky.childrens.append(new Curve({
    id: 'firstPlane',
    drawing: scene,
    settings        : {step: 1,shift: 100,fill: '#ffffff'},
    points          : [
        [0,0],
        [500,-100],
        [2000,-200],
        [2000,600],
        [500,400],
        [0,400]
    ],
    y: -180
}))
    .operationContext
    .move([0,-270],800)
    .moveProperty('fill','#d3deed',1800);

plane.start();