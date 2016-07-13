/**
 * Created by takovoy on 17.02.2015.
 */

function PropertyListing (append,remove,parent){
    this.list   = {};
    this.up     = append || function(){};
    this.rem    = remove || function(){};
    this.parent = parent;
}

PropertyListing.prototype.append = function (object) {
    this.list[object.id] = object;
    return this.up(this.parent,object);
};
PropertyListing.prototype.remove = function (id) {
    delete this.list[id];
    this.rem(this.parent);
};
PropertyListing.prototype.getObject = function (id,recourse) {
    if(!recourse){
        return this.list[id];
    } else {
        for(var key in this.list){
            if(key == id)   {return this.list[key];}
            var object = this.list[key].childrens.getObject(id,true);
            if(object)      {return object;}
        }
        return false
    }
};
PropertyListing.prototype.getObjectsMap = function(){
    var map = {};
    for(var key in this.list){
        map[key] = this.list[key].childrens.getObjectsMap();
    }
    return map;
};