/**
 * Created by takovoy on 22.11.2014.
 */

var Drawing = function(width,height,DOMObject){
    var self = this;
    this.canvas = document.createElement('canvas');
    this.canvas.width = width || 0;
    this.canvas.height = height || 0;
    DObjects.push([DOMObject,this.canvas]);
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
        self.context.clearRect(0,0,self.canvas.width,self.canvas.height);
        for (var key in self.stack.list) {
            self.context.beginPath();
            self.context.fillStyle = '#000000';
            self.context.strokeStyle = '#000000';
            self.context.closePath();
            //moveTo(self.stack.list[key]);
            for(var child in self.stack.list[key].childrens){

            }
            self.stack.list[key].animate(self.context);
        }
    };
    Object.defineProperty(this,'fps',{
        set: function(value){
            var self = this;
            self.core = setInterval(function(){
                self.render();
            },1000 / +value)
        }
    });
    this.fps = 25;
};

var DObjects = [];
window.addEventListener('load',function(){
    for(var i in DObjects){
        DObjects[i][0]().appendChild(DObjects[i][1]);
    }
});