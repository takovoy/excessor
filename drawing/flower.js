/**
 * Created by Пользователь on 21.01.2015.
 */

var flower = new CanvasObject('myFlowerAnimate',canvas,
    {
        step: 0,
        petalCount: 6
    }
);
flower.x = flower.y = 100;
flower.appendChild(new Circle(40,'flowerCenter',canvas,{fill: '#FFB151'}));
flower.animate = function(context){
    for(var i = 0;i < this.now.petalCount;i++){
        if(!this.childrens['petal_' + i]){
            this.appendChild(new Polygon(3,'petal_' + i,canvas,{radius: 5, fill: getRandomRGB(100,200)}));
        }
        if(this.childrens['petal_' + i].now.radius < 30){
            this.childrens['petal_' + i].now.radius += 0.5
        } else {
            return;
        }
        this.childrens['petal_' + i].now.radian = this.now.step;
        this.childrens['petal_' + i].x = formula.coordPointFromCircle((Math.PI*2/this.now.petalCount)*i + this.now.step,70,0,0)[0];
        this.childrens['petal_' + i].y = formula.coordPointFromCircle((Math.PI*2/this.now.petalCount)*i + this.now.step,70,0,0)[1];
    }
    if(this.now.step > Math.PI*2){
        this.now.step = 0;
    }
    this.now.step += 0.05
};

window.addEventListener('load',function(){
    flower.start();
});