/**
 * Created by takovoy on 17.02.2015.
 */

function PropertyListing (append,remove){
    this.list = {};
    this.up = append || function(){};
    this.rem = remove || function(){};
}

PropertyListing.prototype.append = function (object) {
    this.list[object.id] = object;
    this.up(this,object);
};
PropertyListing.prototype.remove = function (id) {
    delete this.list[id];
    this.rem(this);
};
PropertyListing.prototype.getObject = function (id) {
    return this.list[id];
};