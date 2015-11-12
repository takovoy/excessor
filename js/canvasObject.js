/**
 * Created by takovoy on 22.11.2014.
 */

var CanvasObject = function(options){
    this.id             = options.id || '' + Math.random();
    this.now            = options.settings || {};
    this.childrens      = new PropertyListing(
        function(self,object){          //append callback
            object.parent = self.now;
        },
        function(self){                 //remove callback

        },
        this
    );
    this.events         = new EventsListing();
    this._transform     = new Listing();
    if(options.drawing){
        this.drawing = options.drawing;
    }
};

Object.defineProperties(CanvasObject.prototype,{
    x       : {
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
    y       : {
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

CanvasObject.prototype.start        = function(){
    this.drawing.stack.append(this);
};
CanvasObject.prototype.stop         = function(){
    this.drawing.stack.remove(this.id);
};

CanvasObject.prototype.appendChild  = function(canvasObject){
    canvasObject.parent = this.now;
    this.childrens.list[canvasObject.id] = canvasObject;
};
CanvasObject.prototype.removeChild  = function(id){
    delete this.childrens.list[id];
};

CanvasObject.prototype.animate      = function(){};
CanvasObject.prototype.transform = function(transform){
    if(!this._transform){
        this._transform = new Listing();
    }
    if (!transform) {return this._transform;}
    this._transform.append(transform.id,transform);
};
CanvasObject.prototype.moveTo       = function(coord,time){
    if(!time){
        this.x = coord[0];
        this.y = coord[1];
        return;
    }
    this.transform(new Transform({
        property: 'trajectory',
        type    : 'line',
        points  : [
            [
                this.x,
                this.y
            ],
            coord
        ],
        time    : time
    }));
};
CanvasObject.prototype.movePropertyTo   = function(property,value,time){
    if(!time){
        this.now[property] = value;
        return;
    }
    this.transform(new Transform({
        property:property,
        start   : this.now[property],
        end     : value,
        time    : time
    }))
};