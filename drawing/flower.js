/**
 * Created by Пользователь on 21.01.2015.
 */

var sun = new CanvasObject({
    id          :'myFlowerAnimate',
    drawing     : drawingData.drawing,
    settings        : {
        shift: 0,
        step: 0.1,
        petalCount: 6
    }
});
sun.x = sun.y = 100;

sun.appendChild(new Curve({
    id              : 'flowerStem',
    drawing         : drawingData.drawing,
    settings        : {step: 1,shift: 1,stroke: 'green'},
    points          : [
        [100,100],
        [140,200],
        [60,300],
        [100,400]
    ]
}));

sun.appendChild(new Curve({
    id              : 'sheet_0',
    drawing         : drawingData.drawing,
    settings        : {step: 1,shift: 0,stroke: 'green'},
    points          : [
        [100,250],
        [150,160],
        [280,380],
        [150,140],
        [170,330],
        [100,250]
    ]
}));

sun.appendChild(new Curve({
    id              : 'sheet_1',
    drawing         : drawingData.drawing,
    settings        : {step: 1,shift: 0,stroke: 'green'},
    points          : [
        [100,250],
        [50,160],
        [-80,380],
        [50,140],
        [50,330],
        [100,250]
    ]
}));

sun.appendChild(new Circle({
    id              :'sunCenter',
    drawing         : drawingData.drawing,
    settings        : {fill: '#FFB151',x:0,y:0},
    radius          : 15
}));

sun.childrens.list.flowerStem.after.append('shift',{shift:0,endShift:100,start: 0,end: 100,time: 3500});
sun.childrens.list.sunCenter.after.append('radius',{shift:0,endShift:100,start: 15,end: 40,time: 1000});

sun.animate = function(context){
    if(this.childrens.list['flowerStem'].now.shift >= 50){
        return;
    }
    if(Math.round(this.childrens.list['flowerStem'].now.shift) == 50){
        this.childrens.list['sheet_0'].after.append('shift',{shift:0,endShift:100,start: 0,end: 100,time: 3500});
        this.childrens.list['sheet_1'].after.append('shift',{shift:0,endShift:100,start: 0,end: 100,time: 3500});
    }

    if(this.childrens.list['sunCenter'].radius >= 39){
        this.now.step = (this.now.step / 1.5) * 1.4;
    }

    for(var i = 0;i < this.now.petalCount;i++){
        if(!this.childrens.list['beam_' + i]){
            this.appendChild(new Polygon({
                id              : 'beam_' + i,
                drawing         : drawingData.drawing,
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