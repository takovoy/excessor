/**
 * Created by Пользователь on 25.02.2015.
 */

var drawingData = {
    drawing         : new Drawing(200,400),
    _createdObject  : undefined,
    checkedObject   : undefined,
    checkedPoint    : undefined,
    objects         : new PropertyListing(function(self){
        var data = [];
        for(var key in self.list){
            var dataLen = data.length;
            data[dataLen] = {};
            data[dataLen].description = key;
            data[dataLen].action = function(value){
                drawingData.objects.list[value].appendChild(drawingData.checkedObject);
            };
        }
        toolbarModel.elements.create.inheritance.data = data;
    }),
    onStart         : new PropertyListing()
};

Object.defineProperties(drawingData,{
    createdObject: {
        get: function(){return this._createdObject},
        set: function(value){
            this._createdObject = value;
            this.checkedObject  = this._createdObject;
        }
    }
});