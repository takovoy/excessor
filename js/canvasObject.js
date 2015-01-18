/**
 * Created by takovoy on 22.11.2014.
 */

var CanvasObject = function(id,drawingObject,parameters){
    this.now = parameters || {};
    Object.defineProperties(this,{
        x: {
            get: function(){
                if(this.parent){
                    return this.parent.x + this.now.x;
                }
                return this.now.x;
            },
            set: function(value){
                this.now.x = value;
            }
        },
        y: {
            get: function(){
                if(this.parent){
                    return this.parent.y + this.now.y;
                }
                return this.now.y;
            },
            set: function(value){
                this.now.y = value;
            }
        }
    });
    this.x = this.now.x || 0;
    this.y = this.now.y || 0;
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
    this.start = function(){
        drawingObject.stack.append(this);
    };
    this.stop = function(){
        drawingObject.stack.remove(this.id);
    };
    this.childrens = {};
    this.appendChild = function(canvasObject){
        canvasObject.parent = this.now;
        this.childrens[canvasObject.id] = canvasObject;
    };
    this.removeChild = function(id){
        delete this.childrens[id];
    };
    this.animate = function(){};
};