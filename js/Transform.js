/**
 * Created by 1 on 11.11.2015.
 */

function Transform (options){
    this.options = options = options || {};
    this.id                 = options.property || '' + Math.random();
    this.options.rate       = options.rate || 1;
    this.options.factor     = options.factor || 1;
    this.options.endShift   = options.endShift || 100;
    this.options.startShift = +options.startShift || 0;
    this.options.shift      = options.shift || this.options.startShift;
    this.options.start      = options.start || 0;
    this.options.end        = options.end;
    this.options.time       = +options.time;
}

Transform.prototype.play = function(rate){
    this.options.rate = rate || 1;
};
Transform.prototype.pause = function(){
    this.options.rate = 0;
};
Transform.prototype.stop = function(){
    this.options.rate   = 0;
    this.options.shift  = this.options.startShift;
};