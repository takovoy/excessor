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
    id      : "my wonderful circle",
    // объект холста на котором необходимо отрисовать круг
    drawing : myDrawing,
    // объект свойств для отрисовки
    now     : {
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

___

`new CanvasObject(options)`

Базовый графический класс  
может использоваться как родительский объект, в этом случае наследники
корректируют свои координаты относительно родителей по цепочке
до корневого объекта.

Так же является основой для создания других графических классов.

По сути это - всего лишь управляющая прослойка, со всеми необходимыми
методами для работы с параметрами объекта.

Список параметров объекта `options`

name    | type
--------|---------------------------------
id      | random number from 0 to 1
now     | object (настройки для отрисовки)
x       | number
y       | number
radian  | number
drawing | Drawing Object

Список параметров объекта `now`

name        | type                  | used classes
------------|-----------------------|----------------
fill        | HEX or RGB            | all
stroke      | HEX or RGB            | all
strokeWidth | number                | all
x           | number                | all
y           | number                | all
radian      | number                | all
radius      | number                | Circle, Polygon
sidesCount  | number                | Polygon
points      | object                | Curve, Line
shift       | number from 0 to 100  | Curve
step        | number from 0 to 1    | Curve, Ellipse
semiAxisX   | number                | Ellipse
semiAxisY   | number                | Ellipse

___

`new Curve(options)`

Класс графического объекта "кривая"

```js
var curve = new Curve({
    id: "my wonder curve",
    now: {
        ...
        points  : [ [x1,y1], [x2,y2] ]
        ...
    }
})
```
