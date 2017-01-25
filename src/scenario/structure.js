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
            y : new ParsirInput({
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
            radius : new ParsirInput({
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
            radian : new ParsirInput({
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
            fill : new ParsirInput({
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