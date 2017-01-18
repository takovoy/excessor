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
            arrow           : new ParsirButton({
                props       : {className   : 'button arrow'}
            },function(){
                console.log('instruments button');
            }),

            checkpoints     : new ParsirButton({
                props       : {className   : 'button points'}
            },function(){
                console.log('instruments button');
            }),

            polygon         : new ParsirButton({
                props       : {className   : 'button polygon'}
            },function(){
                //this.scene = {};
                console.log('instruments polygon');
                this.scene.editorContext.checkedObject  = new Polygon({});
                this.scene.editorContext.mode           = sceneModes.pastObject;
            }),

            circle          : new ParsirButton({
                props       : {className   : 'button circle'}
            },function(){
                console.log('instruments circle');
                this.scene.editorContext.checkedObject = new Circle({});
                this.scene.editorContext.mode           = sceneModes.pastObject;
            }),

            line            : new ParsirButton({
                props       : {className   : 'button line'}
            },function(){
                console.log('instruments line');
                this.scene.editorContext.checkedObject = new Line({});
                this.scene.editorContext.mode           = sceneModes.pastObject;
            }),

            curve           : new ParsirButton({
                props       : {className   : 'button curve'}
            },function(){
                console.log('instruments curve');
                this.scene.editorContext.checkedObject = new Curve({});
                this.scene.editorContext.mode           = sceneModes.pastObject;
            }),

            fill            : new ParsirButton({
                props       : {className   : 'button fill'}
            },function(){
                console.log('instruments button');
            }),

            stroke          : new ParsirButton({
                props       : {className   : 'button stroke'}
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