/**
 * Created by takovoy on 22.11.2014.
 */


function Drawing (width,height){
    var self = this;
    this.DOMObject          = document.createElement('canvas');
    this.DOMObject.width    = width || 0;
    this.DOMObject.height   = height || 0;
    this.context            = this.DOMObject.getContext('2d');
    this.stack              = new PropertyListing();
    this._fps               = 0;
    this.core               = false;
    this.render             = function(canvasObject,id){
        canvasObject.id = id;
        self.context.beginPath();
        self.context.fillStyle = '#000000';
        self.context.strokeStyle = '#000000';
        self.context.closePath();

        //динамика
        dynamic.move(canvasObject);

        for(var child in canvasObject.childrens.list){
            this.render(canvasObject.childrens.list[child],child);
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
                    self.context.clearRect(0,0,self.DOMObject.width,self.DOMObject.height);
                    for (var key in self.stack.list) {
                        self.render(self.stack.list[key],key);
                    }
                },1000 / +value);
            }
            this._fps = value
        }
    });
}