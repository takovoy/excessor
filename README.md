*Excessor - canvas library*
===========================

Создаём холст

```js
var myDrawing = new Drawing(width,height);
```

Добавляем DOM елемент холста в документ

```js
document.body.appendChild(myDrawing.DOMObject);
```

Для того чтобы нарисовать кружок создаём экземпляр класса круга (`Circle`)

```js
var circle = new Circle({
    // необязательное поле, но для удобства дальнейшей работы следует указать
    id      : "my wonderfull circle",
    // объект холста на котором необходимо отрисовать круг
    drawing : myDrawing,
    // объект свойств для отрисовки
    settings: {
        radius  : 40,
        fill    : "#000000"
    }
})
```

Хорошо, круг создали, теперь запустим рендеринг холста и отрисуем наш кружок

```js
// запусаем рендер
myDrawing.fps = 30;

// этот метод добавляет наш круг к списку объектов, которые будет отрисовывать холст
circle.start();
```

Список методов класса `Drawing`

name    | arguments
--------|---------------------------------
render()| canvasObject, id
pause() | none
play()  | none

Список свойств класса `Drawing`

name        | type
------------|---------------------------------
DOMObject   | DOM canvas object
context     | canvas 2d context
stack       | listObject
fps         | number

___

`new CanvasObject(options)`

Базовый графический класс.  
Может использоваться как родительский объект, в этом случае наследники
корректируют свои координаты относительно родителей по цепочке
до корневого объекта.

Так же является основой для создания других графических классов.

По сути это - всего лишь управляющая прослойка, со всеми необходимыми
методами для работы с параметрами объекта.

Список параметров объекта `options`

name    | type
--------|---------------------------------
id      | random number from 0 to 1
settings| object (настройки для отрисовки)
x       | number
y       | number
radian  | number
drawing | Drawing Object

Список параметров объекта `settings`

name        | type                  | used classes
------------|-----------------------|----------------
fill        | HEX or RGB            | all
stroke      | HEX or RGB            | all
lineWidth   | number                | all
x           | number                | all
y           | number                | all
radian      | number                | all
radius      | number                | Circle, Polygon
sidesCount  | number                | Polygon
points      | object                | Curve, Line
shift       | number from 0 to 100  | Curve, Line, Circle
step        | number from 0 to 1    | Curve, Ellipse
semiAxisX   | number                | Ellipse
semiAxisY   | number                | Ellipse

**Список свойств и методов класса `CanvasObject`**

    *methods*

Более подробное описание методов для анимации будет далее.

name                                | arguments
------------------------------------|----------
start()                             |  
stop()                              | 
transform(transform)                | Transform Object
move(coord,time)                    | numeric array ([x,y]), number (1000)
moveProperty(property,value,time)   | string ('fill'), void ('#ff0000'), number (1000)
append(object)                      | CanvasObject (идентично методу `childrens.append()` см. ниже)

    *properties*

Свойствами объекта `CanvasObject` являются свойства перечисленные выше для массива `options` который передаётся в качестве аргумента конструктору объекта. Помимо этого `CanvasObject` имеет свойство `childrens` для работы с дочерними элементами:

name                            | description
--------------------------------|------------
childrens                       |  
childrens.list                  | список объектов
childrens.append(CanvasObject)  | добавление дочернего элемента (идентично методу `append()` см. выше)
childrens.remove(id)            | удаление, необходим идентификатор

___

`new Curve(options)`

Класс графического объекта "кривая"

```js
var curve = new Curve({
    id: "my wonder curve",
    settings: {
        ...
        points  : [ [x1,y1], [x2,y2] ]
        ...
    }
})
```

___

`new Cluster( count, correlation )`

Вспомогательный класс для отрисовки большого количества объектов, 
принимает на вход количество необходимых копий и массив с коэфициентами
для изменения параметров относительно копируемого объекта для его клонов.  
В качестве коэфициента может быть либо число либо функция, 
возвращающая необходимое число, согласно передаваемым ей параметрам.  
Так же является наследником CanvasObject, но некоторые методы изменены.

___

`new Transform( options )`

Конструктор анимаций, формируется такими методами как `.move() .moveProperty()`. 
После использования данные методы возвращают графический объект на котором была применена анимация. 
Последняя использованая анимация находится в свойстве `.operationContext` графического объекта.

Пример использования:

```js
//создание объекта circle см. выше

circle.moveProperty('radius',50,1000); //move radius; 40px -> 50px; time 1s
var transform = circle.operationContext;

or

var transform = circle.moveProperty('radius',50,1000).operationContext;

transform.event(50,function(event,transform,circle){ //complete 50% of animate
    transform.pause();
    //...
    //something operations
    //...
});
```

Список методов класса `Transform`

name    | arguments
--------|---------------------------------
stop()  | none
pause() | none
play()  | none
repeat()| none
event() | state of animate, function

Список свойств класса `Transform`

name        | type
------------|---------------------------------
options     | object
id          | string
events      | listObject
reverse     | boolean

Список свойств объекта `Transform.options`

name        | type
------------|---------------------------------
endShift    | number
startShift  | number
start       | number
end         | number
time        | number
recourse    | boolean