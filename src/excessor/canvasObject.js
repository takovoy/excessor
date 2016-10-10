/**
 * Created by takovoy on 22.11.2014.
 */

var CanvasObject = function(options){
    this.id             = options.id || '' + Math.random();
    this.now            = options.settings || {};
    this.now.x          = this.now.x || options.x || 0;
    this.now.y          = this.now.y || options.y || 0;
    this._transform     = new Listing();
    this.childrens      = new PropertyListing(
        function(self,object){
            object.parent = self;
            self.operationContext = object;
            return self;
        },
        function(self){

        },
        this
    );
    this.drawing = options.drawing || this.parent.drawing || undefined;
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
    return this;
};
CanvasObject.prototype.stop         = function(){
    this.drawing.stack.remove(this.id);
    return this;
};
CanvasObject.prototype.animate      = function(){};
CanvasObject.prototype.transform = function(transform){
    if(!this._transform){
        this._transform = new Listing();
    }
    if (!transform) {return this._transform;}
    this._transform.append(transform.id,transform);
    this.operationContext = transform;
    return this;
};
CanvasObject.prototype.move       = function(coord,time){
    if(!time){
        this.x = coord[0];
        this.y = coord[1];
        return;
    }
    return this.transform(new Transform({
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
CanvasObject.prototype.moveProperty   = function(property,value,time){
    if(!time){
        this.now[property] = value;
        return;
    }
    return this.transform(new Transform({
        property:property,
        start   : this.now[property],
        end     : value,
        time    : time
    }))
};