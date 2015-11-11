/**
 * Created by frontime on 04.11.2015.
 */

function Transform (options){
    this.id                 = options.property;
    this.options.factor     = options.factor || 1;
    this.options.rate       = options.rate || 1;
    this.options.shift      = options.shift || 0;
    this.options.startShift = options.startShift || 100;
    this.options.endShift   = options.endShift || 100;
    this.options.time       = options.time || 1000;
}

Transform.prototype.play    = function(rate){
    this.options.rate = rate || 1;
};
Transform.prototype.pause   = function(){
    this.options.rate = 0;
};
Transform.prototype.stop    = function(){
    this.options.rate = rate || 1;
    this.options.shift= 0;
};
Transform.prototype.close   = function(){};