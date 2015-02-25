/**
 * Created by takovoy on 17.02.2015.
 */

function PropertyListing (){
    this.list = {}
}

PropertyListing.prototype.append = function (object) {
    this.list[object.id] = object;
};
PropertyListing.prototype.remove = function (id) {
    delete this.list[id];
};