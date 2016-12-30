/**
 * Created by takovoy on 07.07.2016.
 */

//The Project Parsir

function parsir (obj, parent){
    var result = parent || document.createElement('div');

    for(var key in obj){
        var elem = obj[key].dom = document.createElement(obj[key].type || 'div');

        for(var prop in obj[key].properties){
            elem[prop] = obj[key].properties[prop];
        }
        for(var event in obj[key].events){
            elem.addEventListener(event,obj[key].events[event])
        }

        result.appendChild(parsir(obj[key].childs,elem));
    }

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
    parsir(scenarioTemplates,this.wrap);

    scenarioTemplates.drawing.dom.appendChild(this.DOMObject);
    this.wrap.className = 'scenario-wrap';
}

Scene.prototype = Object.create(Drawing.prototype);
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

    instruments: {
        properties: {
            'className': 'scenario-instruments'
        },
        childs: {
            arrow : new ParsirButton({
                props       : {className   : 'button arrow'}
            },function(){
                console.log('instruments button');
            }),

            checkpoints : new ParsirButton({
                props       : {className   : 'button points'}
            },function(){
                console.log('instruments button');
            }),

            arc : new ParsirButton({
                props       : {className   : 'button arc'}
            },function(){
                console.log('instruments button');
            }),

            circle : new ParsirButton({
                props       : {className   : 'button circle'}
            },function(){
                console.log('instruments button');
            }),

            line : new ParsirButton({
                props       : {className   : 'button line'}
            },function(){
                console.log('instruments button');
            }),

            curve : new ParsirButton({
                props       : {className   : 'button curve'}
            },function(){
                console.log('instruments button');
            }),

            fill : new ParsirButton({
                props       : {className   : 'button fill'}
            },function(){
                console.log('instruments button');
            }),

            stroke : new ParsirButton({
                props       : {className   : 'button stroke'}
            },function(){
                console.log('instruments button');
            })
        }
    },

    drawing: {
        properties: {
            'className': 'scenario-drawing'
        }
    },

    objectManager: {
        properties: {
            'className': 'scenario-objectManager'
        },
        childs: {
            description: {
                properties : {
                    className : 'topMenu'
                },
                childs : {
                    text : new ParsirText({text:'objects list'}),
                    collapseButton : new ParsirButton({
                            innerHTML   : '-',
                            props       : {className: 'collapse'}
                        },
                        function(){
                            console.log('collapse')
                        }
                    )
                }
            },
            list : {},
            manager : {
                childs:{
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