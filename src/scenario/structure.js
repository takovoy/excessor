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