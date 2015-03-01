/**
 * Created by takovoy on 22.11.2014.
 */

var CanvasObject = function(id,drawingObject,parameters){
    this.now = parameters || {};
    this.id = id || '' + Math.random();
    this.after = {
        list: {},
        append: function(name,value,time,type){
            this.list[name] = {
                value: value,
                time: time,
                type: type
            };
        },
        remove: function(name){
            delete this.list[name];
        }
    };
    this.drawingStack = drawingObject.stack;
    this.childrens = {};
};

Object.defineProperties(CanvasObject.prototype,{
    x: {
        get: function(){
            if(this.parent){
                return +this.now.x + this.parent.x;
            }
            return +this.now.x;
        },
        set: function(value){
            this.now.x = +value;
        }
    },
    y: {
        get: function(){
            if(this.parent){
                return +this.now.y + this.parent.y;
            }
            return +this.now.y;
        },
        set: function(value){
            this.now.y = +value;
        }
    }
});

CanvasObject.prototype.start = function(){
    this.drawingStack.append(this);
};
CanvasObject.prototype.stop = function(){
    this.drawingStack.remove(this.id);
};

CanvasObject.prototype.appendChild = function(canvasObject){
    canvasObject.parent = this.now;
    this.childrens[canvasObject.id] = canvasObject;
};
CanvasObject.prototype.removeChild = function(id){
    delete this.childrens[id];
};

CanvasObject.prototype.animate = function(){};