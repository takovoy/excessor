/**
 * Created by takovoy on 22.11.2014.
 */


function Drawing (width,height){
    this.DOMObject          = document.createElement('canvas');
    this.DOMObject.width    = width || 0;
    this.DOMObject.height   = height || 0;
    this.context            = this.DOMObject.getContext('2d');
    this.stack              = new PropertyListing();
    this._fps               = 0;
    this.core               = false;
}

Drawing.prototype.render = function(canvasObject,id){
    canvasObject.id = id;
    this.context.beginPath();
    this.context.fillStyle = '#000000';
    this.context.strokeStyle = '#000000';
    this.context.closePath();

    //динамика
    dynamic.move(canvasObject);
    canvasObject.animate(this.context);

    for(var child in canvasObject.childrens.list){
        this.render(canvasObject.childrens.list[child],child);
    }
};

Drawing.prototype.pause = function(){
    this.fps = 0;
};

Drawing.prototype.play = function(){
    var self = this;
    if(this.core){clearInterval(this.core)}
    this.core = setInterval(function(){
        self.context.clearRect(0,0,self.DOMObject.width,self.DOMObject.height);
        for (var key in self.stack.list) {
            self.render(self.stack.list[key],key);
        }
    },1000 / +self.fps);
};

Object.defineProperty(Drawing.prototype,'fps',{
    get: function(){
        return this._fps;
    },
    set: function(value){
        var self = this;
        if(this.core){clearInterval(this.core)}
        if(value != 0){
            this.core = setInterval(function(){
                self.context.clearRect(0,0,self.DOMObject.width,self.DOMObject.height);
                for (var key in self.stack.list) {
                    self.render(self.stack.list[key],key);
                }
            },1000 / +value);
        }
        this._fps = value
    }
});