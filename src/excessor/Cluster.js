/**
 * Created by yeIAmCrasyProgrammer on 10.10.2016.
 */

function Cluster (options){
    CanvasObject.apply(this,arguments);
    this.constructor    = Cluster;
}

Curve.prototype = Object.create(CanvasObject.prototype);

Cluster.prototype.transform = function(){
    return {list:{}};
};