/**
 * Created by takovoy on 07.05.2015.
 */

var eventer = {

    setProperties   : function(canvasObject){

        var properties = canvasObject.events.list;

        //перебор отслеживаемых свойств
        for(var propertyName in properties){
            if(!canvasObject.after.list[propertyName]) continue;

            //обработка начала анимации свойства
            if(properties[propertyName].onStart){
                for(var operationIndex = 0; properties[propertyName].onStart[operationIndex]; operationIndex++){
                    var event = properties[propertyName].onStart[operationIndex];

                    this.types[event.type](event,canvasObject);
                }

                //удаление
                canvasObject.events.remove(propertyName,'onStart');
            }

            var property    = canvasObject.after.list[propertyName],
                shift       = property.shift;

            //перебор событий относящихся к свойству
            for(var comparisonValue in properties[propertyName]){
                if (shift < +comparisonValue) continue;

                //перебор операций события
                for(
                    var operationIndex = 0;
                    properties[propertyName][comparisonValue][operationIndex];
                    operationIndex++
                ){

                    var operation = properties[propertyName][comparisonValue][operationIndex];

                    //передача операции на выполнение
                    this.types[operation.type](operation,canvasObject,propertyName);

                }

                //удаление
                canvasObject.events.remove(propertyName,comparisonValue);
            }

        }

    },

    types           : {

        cooperation : function(operation,canvasObject){

        },

        graphic     : function(operation,canvasObject,propertyName){

            if(operation.who == 'self'){
                canvasObject.after.append(propertyName,operation.data);
                return;
            }

            canvasObject = canvasObject.drawingObject.stack.getObject(operation.id);

            if(!canvasObject) return;

            canvasObject.after.append(propertyName,operation.data);

        }
    }

};