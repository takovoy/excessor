/**
 * Created by takovoy on 01.03.2016.
 */

function Scene (width,height){
    Drawing.apply(this,arguments);

    this.wrap = document.createElement('div');
    parsir(scenarioTemplates,this.wrap);

    scenarioTemplates.drawing.dom.appendChild(this.DOMObject);
    this.wrap.className = 'scenario-wrap';
}

Scene.prototype = Object.create(Drawing.prototype);