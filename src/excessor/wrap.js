
var excessor = {
    SVGParser: {services:{}}
};

(function () {
    var parser = excessor.SVGParser;
    var services = parser.services;

    parser.url = function(url){
        var xhr = new XMLHttpRequest();
        xhr.open('GET',url,true);

        xhr.send();

        xhr.onreadystatechange = function() {
            if (xhr.readyState != 4) return;

            if (xhr.status == 200) {
                parser.string(xhr.responseText);
            }
        }
    };

    parser.string = function (string,parent) {
        parent = parent || new CanvasObject();
        if(!string){return false;}
        var Parser = new DOMParser();
        var document;
        if(typeof string === "string"){
            document = Parser.parseFromString(string, "image/svg+xml");
        } else {
            document = string;
        }

        var levelNodes = document.childNodes;

        for(var index = 0;levelNodes[index];index++){
            parent.append(parser.initNode(levelNodes[index]));
        }

        return document;
    };

    parser.initNode = function (node) {
        var canvasObject = new parser.services.nodeCorrelation[node.nodeName]();
        for(var attr in parser.services.attrCorrelation){
            var nodeAttr = node.getAttribute(attr);
            if(!nodeAttr){continue;}
            var correlation = parser.services.attrCorrelation[attr];

            canvasObject.now[correlation.property] = correlation.init(nodeAttr);
        }
        return canvasObject;
    };

    services.nodeCorrelation = {
        g: CanvasObject,
        path: Path,
        circle: Circle,
        rect: Rect,
        ellipse: Ellipse
    };

    services.attrCorrelation = {
        fill: {
            property: 'fill',
            init: function (value) {
                return value;
            }
        },
        stroke: {
            property: 'stroke',
            init: function (value) {
                return value;
            }
        },
        'stroke-linecap': {
            property: 'lineCap',
            init: function (value) {
                return value;
            }
        },
        'stroke-linejoin': {
            property: 'lineJoin',
            init: function (value) {
                return value;
            }
        },
        'stroke-dasharray': {
            property: 'lineDash',
            init: function (value) {
                var dashArray = value.match(/\d*(\.{\d*)?/g);
                for(var i = 0;dashArray[i];i++){dashArray[i] = +dashArray[i];}
                return dashArray;
            }
        },
        'stroke-dashoffset': {
            property: 'dashOffset',
            init: function (value) {
                return +value.match(/\d*/)[0];
            }
        },
        r: {
            property: 'radius',
            init: function (value) {
                return +value.match(/\d*/)[0];
            }
        },
        cx: {
            property: 'x',
            init: function (value) {
                return +value.match(/\d*/)[0];
            }
        },
        cy: {
            property: 'y',
            init: function (value) {
                return +value.match(/\d*/)[0];
            }
        }
    }
})();