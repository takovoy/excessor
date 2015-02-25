/**
 * Created by Пользователь on 25.02.2015.
 */

var drawingData = {
    drawing         : new Drawing(200,400),
    _createdObject  : undefined,
    checkedObject   : undefined,
    objects         : new PropertyListing(),
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