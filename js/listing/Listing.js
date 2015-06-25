/**
 * Created by takovoySuper on 14.04.2015.
 */

function Listing (){
    this.list   = {};
    this.append = function(name,data){
        this.list[name] = data;
    };
    this.remove = function(name){
        delete this.list[name];
    };
}