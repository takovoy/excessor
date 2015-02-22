/**
 * Created by takovoy on 22.11.2014.
 */

function random (min,max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomRGB (min,max){
    return 'rgb(' + random(min,max) + ',' + random(min,max) + ',' + random(min,max) + ')'
}

var Drawing = function(width,height){
    var self = this;
    this.canvas = document.createElement('canvas');
    this.canvas.width = width || 0;
    this.canvas.height = height || 0;
    this.context = this.canvas.getContext('2d');
    this.stack = {
        list: {},
        append: function (canvasObject) {
            this.list[canvasObject.id] = canvasObject;
        },
        remove: function (id) {
            delete this.list[id];
        }
    };
    this.render = function(canvasObject){
        self.context.beginPath();
        self.context.fillStyle = '#000000';
        self.context.strokeStyle = '#000000';
        self.context.closePath();
        //moveTo(self.stack.list[key]);
        for(var child in canvasObject.childrens){
            this.render(canvasObject.childrens[child]);
        }
        canvasObject.animate(this.context);
    };
    Object.defineProperty(this,'fps',{
        get: function(){
            return this._fps;
        },
        set: function(value){
            var self = this;
            if(this.core){clearInterval(this.core)}
            if(value != 0){
                this.core = setInterval(function(){
                    self.context.clearRect(0,0,self.canvas.width,self.canvas.height);
                    for (var key in self.stack.list) {
                        self.render(self.stack.list[key]);
                    }
                },1000 / +value);
            }
            this._fps = value
        }
    });
};