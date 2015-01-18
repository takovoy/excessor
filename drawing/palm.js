/**
 * Created by takovoy on 29.12.2014.
 */

var random = function(min,max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

var palm = new CanvasObject('myLittlePalm',canvas);
palm.x = palm.y = 50;
var palmBranchAnimate = function(context){
    var index = this.now.index;
    context.beginPath();
    context.fillStyle = 'green';
    context.moveTo(this.x,this.y);
    context.quadraticCurveTo(
        this.x + this.now.shiftX * 5,
        this.y + this.now.shiftY / 2.5 - index/2,
        this.x + this.now.shiftX * 8,
        this.y + this.now.shiftY * 5 - index
    );
    context.quadraticCurveTo(
        this.x + this.now.shiftX * 2,
        this.y + 30 - index/2,
        this.x,
        this.y
    );
    context.stroke();
    context.fill();
    context.closePath();
    if(index <= 0){
        this.now.checked = false
    } else if(index >= 10){
        this.now.checked = true
    }
    if(!this.now.checked){this.now.index += this.now.stepDown}
    else {this.now.index -= this.now.stepUp}
};

for(var i = 1;i<5;i++){
    var index = 1;
    if(i > 2){index = -1}
    var branch = new CanvasObject('branch' + i,canvas,{
        shiftX: 5 * index,
        shiftY: 5 + (i % 2) * i / 2,
        index: (i % 2) * 10,
        checked: !!(i % 2),
        stepUp: random(5,10) / 10,
        stepDown: random(5,10) / 10
    });
    branch.x = 0;
    branch.y = 0;
    branch.animate = palmBranchAnimate;
    palm.appendChild(branch);
}

(function(){
    var palmTrunk = new Circle(10,'palmTrunk',canvas,
        {fill: '#994433',stroke: '#000000'}
    );
    palm.appendChild(palmTrunk);
})();

window.addEventListener('load',function(){
    palm.start();
    hat.start();
});