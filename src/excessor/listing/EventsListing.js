/**
 * Created by takovoySuper on 12.05.2015.
 */

function EventsListing (){
    this.list   = {};
}

//проверить ?
EventsListing.prototype.append = function(property,theComparisonValue,operation){
    if(!this.list[property]){
        this.list[property] = {};
    }
    if(!this.list[property][theComparisonValue]){
        this.list[property][theComparisonValue] = [];
    }
    this.list[property][theComparisonValue].push(operation);
};
EventsListing.prototype.remove = function(property,theComparisonValue){
    if(!theComparisonValue){
        delete this.list[property];
        return
    }
    delete this.list[property][theComparisonValue];
    if(Object.keys(this.list[property]).length == 0){
        delete this.list[property];
    }
};