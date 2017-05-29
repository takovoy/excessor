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

        for(var attr in obj[key].attributes){
            elem.setAttribute(attr,obj[key].attributes[attr]);
        }

        for(var event in obj[key].events){
            elem.addEventListener(event,obj[key].events[event])
        }

        result.appendChild(parsir(obj[key].childs,elem, scene));
    }

    result.scene = scene;
    return result;
}
/**
 * Created by takovoy on 07.07.2016.
 */

var scenarioFunctions = {
    instruments: {

    },

    hello: function(){
        console.log('Hello, World!')
    }
};
/**
 * Created by takovoy on 01.03.2016.
 */

function Scene (width,height){
    Drawing.apply(this,arguments);

    this.wrap = document.createElement('div');
    parsir(scenarioTemplates,this.wrap,this);

    scenarioTemplates.drawing.dom.appendChild(this.DOMObject);
    this.wrap.className     = 'scenario-wrap';
    this.editorContext      = {
        modes: {
            pastObject  : function (event,scene) {
                scene.fps                           = 10;
                if(!scene.editorContext.checkedObject){
                    return
                }
                scene.editorContext.checkedObject.x = event.layerX;
                scene.editorContext.checkedObject.y = event.layerY;
                scene.editorContext.checkedObject.start();
            }
        }
    };

    this.editorContext.mode = this.editorContext.modes.pastObject;
    this.DOMObject.scene    = this;
    this.DOMObject.onclick  = function (event) {
        this.scene.editorContext.mode(event,this.scene);
    };
}

Scene.prototype = Object.create(Drawing.prototype);


PropertyListing.prototype.append = function (object) {
    this.list[object.id] = object;
    var result = this.up(this.parent,object);
    var list = scenarioTemplates.objectManager.childs.list.dom;
    list.innerHTML = '';
    list.appendChild(
        getSceneStructure(object.drawing)
    );
    return this.up(this.parent,object);
};
PropertyListing.prototype.remove = function (id) {
    delete this.list[id];
    this.rem(this.parent);
};
function getSceneStructure ( scene ){
    var map = arguments[1] || scene.stack.getObjectsMap();
    var template = {};
    for(var key in map){
        template[key] = {
            attributes  : {
                'data-id' : key
            },
            properties  : {
                'innerHTML' : key,
                className   : 'obj'
            },
            events      : {
                click   : function(){
                    var id = this.getAttribute('data-id');
                    this.scene.editorContext.checkedObject = this.scene.stack.getObject(id,true);
                    return false;
                }
            }
        };
        template[key].childs = getSceneStructure( scene, map[key] );
    }
    if(!arguments[1]){
        return parsir(template,false,scene);
    }
    return template
}
/**
 * Created by takovoy on 07.07.2016.
 */

var scenarioTemplates = {

    topMenu : {
        properties: {
            'className': 'scenario-topMenu'
        },
        childs: {
            fpsInput : new ParsirInput({
                placeholder:'fps',
                props:{type: 'number'},
                events: {
                    change : function(){
                        if(+this.value < 0){
                            this.value = 0
                        }
                    }
                }
            }),
            collapseInterfaceButton : new ParsirButton(
                {
                    innerHTML   : '-',
                    props       : {className: 'collapse'}
                },
                function(){
                    console.log('collapse')
                }
            )
        }
    },

    props : {
        properties: {
            'className': 'scenario-properties'
        },
        childs: {
            x : new ParsirInput({
                placeholder:'x',
                props:{type: 'number'},
                events: {
                    change : function(){
                        if(!isNotNegativeNumber(this.value)){
                            this.value = 0;
                        }
                        this.scene.editorContext.checkedObject.x = this.value;
                    }
                }
            }),
            y : new ParsirInput({
                placeholder:'y',
                props:{type: 'number'},
                events: {
                    change : function(){
                        if(!isNotNegativeNumber(this.value)){
                            this.value = 0
                        }
                        this.scene.editorContext.checkedObject.y = this.value;
                    }
                }
            }),
            radius : new ParsirInput({
                placeholder:'radius',
                props:{type: 'number'},
                events: {
                    change : function(){
                        if(!isNotNegativeNumber(this.value)){
                            this.value = 0
                        }
                        this.scene.editorContext.checkedObject.now.radius = this.value;
                    }
                }
            }),
            radian : new ParsirInput({
                placeholder:'radian',
                props:{type: 'number'},
                events: {
                    change : function(){
                        if(typeof +this.value !== "number"){
                            this.value = 0
                        }
                        this.scene.editorContext.checkedObject.radian = this.value;
                    }
                }
            }),
            fill : new ParsirInput({
                placeholder:'fill',
                props:{type: 'text'},
                events: {
                    change : function(){
                        if(!isColor(this.value)){
                            return
                        }
                        this.scene.editorContext.checkedObject.now.fill = this.value;
                    }
                }
            }),
            collapseInterfaceButton : new ParsirButton(
                {
                    innerHTML   : '-',
                    props       : {className: 'collapse'}
                },
                function(){
                    console.log('collapse')
                }
            )
        }
    },

    instruments: {
        properties: {
            'className': 'scenario-instruments'
        },
        childs: {
            arrow           : new ParsirButton({
                props       : {className   : 'button arrow',innerHTML: 'ARR'}
            },function(){
                console.log('instruments button');
            }),

            checkpoints     : new ParsirButton({
                props       : {className   : 'button points',innerHTML: 'CHCK'}
            },function(){
                console.log('instruments button');
            }),

            polygon         : new ParsirButton({
                props       : {className   : 'button polygon',innerHTML: 'POLY'}
            },function(){
                this.scene.editorContext.checkedObject  = new Polygon({
                    drawing     : this.scene,
                    sidesCount  : 6,
                    settings    : {radius: 30,fill: '#000000'}
                });
                this.scene.editorContext.mode           = this.scene.editorContext.modes.pastObject;
            }),

            circle          : new ParsirButton({
                props       : {className   : 'button circle',innerHTML: 'CLE'}
            },function(){
                this.scene.editorContext.checkedObject  = new Circle({
                    drawing : this.scene,
                    radius  : 30,
                    settings: {fill: '#000000'}
                });
                this.scene.editorContext.mode           = this.scene.editorContext.modes.pastObject;
            }),

            line            : new ParsirButton({
                props       : {className   : 'button line',innerHTML: 'LINE'}
            },function(){
                this.scene.editorContext.checkedObject  = new Line();
                this.scene.editorContext.mode           = this.scene.editorContext.modes.pastObject;
            }),

            curve           : new ParsirButton({
                props       : {className   : 'button curve',innerHTML: 'CRV'}
            },function(){
                this.scene.editorContext.checkedObject  = new Curve();
                this.scene.editorContext.mode           = this.scene.editorContext.modes.pastObject;
            }),

            fill            : new ParsirButton({
                props       : {className   : 'button fill',innerHTML: 'FILL'}
            },function(){
                console.log('instruments button');
            }),

            stroke          : new ParsirButton({
                props       : {className   : 'button stroke',innerHTML: 'STRK'}
            },function(){
                console.log('instruments button');
            })
        }
    },

    drawing: {
        properties      : {
            'className' : 'scenario-drawing'
        }
    },

    objectManager: {
        properties      : {
            'className' : 'scenario-objectManager'
        },
        childs          : {
            description : {
                properties      : {
                    className   : 'topMenu'
                },
                childs          : {
                    text        : new ParsirText({text:'objects list'}),
                    collapseButton      : new ParsirButton({
                            innerHTML   : '-',
                            props       : {className: 'collapse'}
                        },
                        function(){
                            console.log('collapse')
                        }
                    )
                }
            },
            list            : {},
            manager         : {
                childs      : {
                    append  : {},
                    clone   : {},
                    delete  : {}
                }
            }
        }
    },

    sceneManager: {
        properties: {
            'className': 'scenario-sceneManager'
        },
        childs: [
            'plaingLine',
            'managerPlane'
        ]
    }
};
/**
 * Created by Dima on 14.03.2016.
 */

function dragHor (event){
    console.log('Yep!');
    console.log(event);
}

function rDragHor (event,object){
    console.log('Wooops!');
    console.log(object);
}
/**
 * Created by Dima on 14.03.2016.
 */

/**
 * Created by takovoy on 07.07.2016.
 */

function ParsirText (options){
    this.type                   = 'span';
    this.properties             = options.props || {};
    this.properties.innerHTML   = options.text || '';
}

function ParsirInput (options){
    this.type                   = 'input';
    this.properties             = options.props || {};
    this.properties.value       = options.value || '';
    this.properties.placeholder = options.placeholder || '';
    this.events                 = options.events || {};
}

function ParsirButton (options,click){
    this.type           = 'button';
    this.properties     = options.props || {};
    this.childs         = options.childs;
    this.events         = options.events || {};
    this.events.click   = click || this.events.click || function(){};
}