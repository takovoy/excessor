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
        self.context.clearRect(0,0,self.canvas.width,self.canvas.height);
        for (var key in self.stack.list) {
            self.stack.list[key].animate(self.context);
        }
    }, 1000 / 25);

    Object.defineProperty(this,'fps',{
        set: function(value){
            var self = this;
            self.core = setInterval(function(){
                self.context.clearRect(0,0,self.canvas.width,self.canvas.height);
                for(var key in self.stack.list){
                    self.stack.list[key].animate(self.context);
                }
            },1000 / +value)
        }
    });
};