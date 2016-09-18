/**
 * Created by Пользователь on 21.01.2015.
 */

var scene = new Drawing(400,400);

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
    .moveProperty('shift',100,3500)
    .event(50,function(event,transform,canvasObject){
        transform.pause();
        sun.childrens.list['sheet_0'].transform(new Transform({
            property:'shift',
            end     : 100,
            time    : 3500,
            recourse: false
        })).event(100,function(event,transform,canvasObject){
            transform.reverse = true;
        });

        sun.childrens.list['sheet_1'].moveProperty('shift',100,3500);

        sun.animate = function(){};
    });

sun.childrens.append(new Circle({
    id              :'sunCenter',
    drawing         : scene,
    settings        : {fill: '#FFB151',x:0,y:0},
    radius          : 15
})).moveProperty('radius',40,1000);

sun.childrens.list.sunCenter.moveProperty('fill','#ff5555',1000);

sun.animate = function(context){
    if(this.childrens.list['sunCenter'].radius >= 39){
        this.now.step = (this.now.step / 1.5) * 1.4;
    }

    for(var i = 0;i < this.now.petalCount;i++){
        if(!this.childrens.list['beam_' + i]){
            this.childrens.append(new Polygon({
                id              : 'beam_' + i,
                drawing         : scene,
                settings        : {radius: 5, fill: '#FFB151'},
                sidesCount      : 3
            }));
        }
        if(this.childrens.list['beam_' + i].now.radius < 30){
            this.childrens.list['beam_' + i].now.radius++;
        }
        this.childrens.list['beam_' + i].now.radian = (Math.PI*2/this.now.petalCount)*i + this.now.shift;
        this.childrens.list['beam_' + i].x = formula.getPointOnCircle((Math.PI*2/this.now.petalCount)*i + this.now.shift,70,0,0)[0];
        this.childrens.list['beam_' + i].y = formula.getPointOnCircle((Math.PI*2/this.now.petalCount)*i + this.now.shift,70,0,0)[1];
    }

    if(this.now.shift > Math.PI*2){
        this.now.shift = 0;
    }
    this.now.shift += this.now.step;
};