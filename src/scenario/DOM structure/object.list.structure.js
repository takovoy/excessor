function getSceneStructure ( scene ){
    var map = arguments[1] || scene.stack.getObjectsMap();
    var template = {};
    for(var key in map){
        template[key] = {
            attributes : {
                'data-id' : key
            },
            properties : {
                'innerHTML' : key
            }
        };
        template[key].childs = getSceneStructure( scene, map[key] );
    }
    if(!arguments[1]){
        return parsir(template,false,scene);
    }
    return template
}