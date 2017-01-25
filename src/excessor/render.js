/**
 * Created by takovoy on 22.11.2014.
 */

//http://yabs.yandex.ru/count/0jMIl3QAw2S40000gQ1000AEkuoBY0LIbG6R0cv3jm4aCeYusn741eczXwCC0PsWkbGBfe88Yh8x9uuCtBH2X8GDlR__5zi8gYwbeZsP3Bodt88CZG7T0TwG9FIHl4Oej0INy3Z14pPa6qGBauKDeYwP1KACeurr0RQS472rcFXUeAKTW06leurr0REGg66qcFXUsQKTW07QaAXXb9pN4wULb3geiQEHOGIam0000BWChkWlWbU9GZWSiG6oj3000a2veBfK2xlrYr4mFff3q0N1__________yFmksmB3WpvzqGnOyFql__________3zF__________m_k0TlrowgZHPf3q0NVXGtbaF8hxOCezTmSHMU8BmBstq1ENCDkL7qY?q=%D0%B1%D1%80%D1%83%D1%81%D0%BE%D0%B2%D1%8B%D0%B5+%D0%B4%D0%BE%D0%BC%D0%B0+%D0%BE%D1%82+%D0%BF%D1%80%D0%BE%D0%B8%D0%B7%D0%B2%D0%BE%D0%B4%D0%B8%D1%82%D0%B5%D0%BB%D1%8F
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