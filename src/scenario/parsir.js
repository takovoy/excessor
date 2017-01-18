/**
 * Created by takovoy on 07.07.2016.
 */

//The Project Parsir

function parsir (obj, parent, scene){
    var result = parent || document.createElement('div');

    for(var key in obj){
        var elem = obj[key].dom = obj[key].dom || document.createElement(obj[key].type || 'div');

        for(var prop in obj[key].properties){
            elem[prop] = obj[key].properties[prop];
        }

        for(var event in obj[key].events){
            elem.addEventListener(event,obj[key].events[event])
        }

        result.appendChild(parsir(obj[key].childs,elem, scene));
    }

    result.scene = scene;
    return result;
}