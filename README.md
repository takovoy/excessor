Wooops... It is too secret.

* Создаём холст:

```js
var myDrawing = new Drawing(width,height);
```

* Для того чтобы нарисовать кружок создаём экземпляр сласса круга (Circle)

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

* Хорошо, круг создали, теперь запустим рендеринг холста и отрисуем наш кружок

```js
// запусаем рендер
myDrawing.fps = 30;

// этот метод добавляет наш круг к списку объектов, которые будет отрисовывать холст
circle.start();
```

___

--> new CanvasObject(options)

Базовый графический класс  
может использоваться как родительский объект, в этом случае наследники
корректируют свои координаты относительно родителей по цепочке
до корневого объекта.

Так же является основой для создания других графических классов.

По сути это - всего лишь управляющая прослойка, со всеми необходимыми
методами для работы с параметрами объекта.
```js
options =
    {
        id      : string or numeric,
        drawing : new Drawing(width,height),
        now     : {properties},
        ...
    };
```

___

--> new Curve(options)

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