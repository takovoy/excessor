/**
 * Created by frontime on 04.11.2015.
 */

function Transform (options){
    this.type       = options.type;
    this.rate       = options.rate || 1;
    this.shift      = options.shift || 0;
    this.endShift   = options.endShift || 100;
    this.time       = options.time || 1000;
}

Transform.prototype.play    = function(rate){

};
Transform.prototype.pause   = function(){};
Transform.prototype.stop    = function(){};
Transform.prototype.close   = function(){};