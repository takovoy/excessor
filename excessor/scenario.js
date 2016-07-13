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
/**
 * Created by takovoy on 07.07.2016.
 */

var scenarioTemplates = {

    topMenu : {
        properties: {
            'className': 'scenario-topMenu'
        },
        childs: {
            fpsInput : new ParsirInput('', 'fps', {type: 'number'}, {
                change : function(){
                    if(+this.value < 0){
                        this.value = 0
                    }
                }
            }),
            collapseInterfaceButton : new ParsirButton(
                new ParsirText('-'),
                function(){
                    console.log('collapse')
                },
                {className: 'collapse'}
            )
        }
    },

    instruments: {
        properties: {
            'className': 'scenario-instruments'
        },
        childs: {
            arrow : new ParsirButton('arr',function(){
                console.log('instruments button');
            },{className : 'button'}),

            checkpoints : new ParsirButton('points',function(){
                console.log('instruments button');
            },{className : 'button'}),

            arc : new ParsirButton('arc',function(){
                console.log('instruments button');
            },{className : 'button'}),

            circle : new ParsirButton('crcl',function(){
                console.log('instruments button');
            },{className : 'button'}),

            line : new ParsirButton('line',function(){
                console.log('instruments button');
            },{className : 'button'}),

            curve : new ParsirButton('crv',function(){
                console.log('instruments button');
            },{className : 'button'}),

            fill : new ParsirButton('fill',function(){
                console.log('instruments button');
            },{className : 'button'}),

            stroke : new ParsirButton('strk',function(){
                console.log('instruments button');
            },{className : 'button'})
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
                    text : new ParsirText('objects list'),
                    collapseButton : new ParsirButton(
                        new ParsirText('-'),
                        function(){
                            console.log('collapse')
                        },
                        {className: 'collapse'}
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

function ParsirText (text,props){
    this.type = 'span';
    this.properties = props || {};
    this.properties.innerHTML = text;
}

function ParsirInput (value,placeholder,props,events){
    this.type = 'input';
    this.properties = props || {};
    this.properties.value = value;
    this.properties.placeholder = placeholder;

    this.events = events || {};
}

function ParsirButton (value,click,props){
    this.type = 'button';
    this.properties = props || {};

    this.events = {
        click : click
    };

    this.childs = [value];
}