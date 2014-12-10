/**
 * Created by takovoy on 22.11.2014.
 */

var Drawing = function(width,height){
    var self = this;
    this.canvas = document.createElement('canvas');
    this.canvas.width = width || 0;
    this.canvas.height = height || 0;
    document.body.appendChild(this.canvas);
    this.context = this.canvas.getContext('2d');
    this.render = function(){
        this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
        for (var key in this.stack.list) {
            this.context.beginPath();
            this.stack.list[key].animate(this.context);
            this.context.closePath();
        }
    };
    this.stack = {
        list: {},
        append: function (canvasObject) {
            this.list[canvasObject.id] = canvasObject;
        },
        remove: function (id) {
            delete this.list[id];
        }
    };
    this.core = setInterval(function () {
        self.render();
    }, 1000 / 25);

    Object.defineProperty(this,'fps',{
        set: function(value){
            var self = this;
            self.core = setInterval(function(){
                self.render();
            },1000 / +value)
        }
    });
};