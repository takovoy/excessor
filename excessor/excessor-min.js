function Drawing(t,i){this.DOMObject=document.createElement("canvas"),this.DOMObject.width=t||0,this.DOMObject.height=i||0,this.context=this.DOMObject.getContext("2d"),this.stack=new PropertyListing,this._fps=0,this.core=!1}function EventsListing(){this.list={}}function Listing(){this.list={},this.append=function(t,i){this.list[t]=i},this.remove=function(t){delete this.list[t]}}function PropertyListing(t,i,n){this.list={},this.up=t||function(){},this.rem=i||function(){},this.parent=n}function CanvasObject(t){t=t||{},this.id=t.id||""+Math.random(),this.now=t.settings||{},this.now.x=this.now.x||t.x||0,this.now.y=this.now.y||t.y||0,this.now.radian=this.now.radian||t.radian||0,this.services={},this._transform=new Listing,this.childrens=new PropertyListing(function(t,i){return i.parent=t,i.drawing=t.drawing,t.operationContext=i,t},function(t){},this),this.drawing=t.drawing||void 0}function Circle(t){CanvasObject.apply(this,arguments),this.constructor=Circle,this.now.radius=this.now.radius||t.radius||0,this.now.shift=this.now.shift||t.shift||100}function Cluster(t,i){this.parameters={list:{},iteration:!1},CanvasObject.apply(this,[{}]),this.correlation=i||{},this.count=t||0,this.iteration=1,this.constructor=Cluster}function Curve(t){CanvasObject.apply(this,arguments),this.constructor=Curve,this.now.step=+this.now.step||+t.step||1,this.points=this.now.points||t.points||[],this.services.points=[]}function Ellipse(t){CanvasObject.apply(this,arguments),this.constructor=Ellipse,this.now.step=this.now.step||.1}function Line(t){CanvasObject.apply(this,arguments),this.constructor=Line,this.now.points=this.now.points||t.points||[],this.services.points=[]}function Path(t){CanvasObject.apply(this,arguments),this.constructor=Path,this.now.step=+this.now.step||+t.step||1,this.points=this.now.points||t.points||[],this.services.points=[]}function Polygon(t){CanvasObject.apply(this,arguments),this.constructor=Polygon,this.now.sidesCount=this.now.sidesCount||t.sidesCount||3,this.now.radius=this.now.radius||t.radius||0}function Polyline(t){CanvasObject.apply(this,arguments),this.constructor=Polyline,this.now.points=t.points}function Rect(t){CanvasObject.apply(this,arguments),this.constructor=Rect,this.now.width=this.now.width||t.width||0,this.now.height=this.now.height||t.height||this.now.width}function Spline(t){CanvasObject.apply(this,arguments),this.constructor=Spline,this.now.step=+this.now.step||+t.step||1,this.points=this.now.points||t.points||[],this.services.points=[]}function markControlPoints(t,i,n){n=n||{},i.moveTo(+n.x,+n.y),i.arc(+n.x,+n.y,2,0,2*Math.PI);for(var s=0;t[s];s++)"object"!=typeof t[s][0]?(i.moveTo(t[s][0]+ +n.x,t[s][1]+ +n.y),i.arc(t[s][0]+ +n.x,t[s][1]+ +n.y,2,0,2*Math.PI)):markControlPoints(t[s],i,n)}function changeContext(t,i){for(var n in i)dataContextChanges[n]&&i[n]&&dataContextChanges[n](t,i[n])}function isNotNegativeNumber(t){return"number"==typeof+t&&+t>=0}function isHEXColor(t){return 7===t.length&&0===t.search(/#[0-9a-f]{6}/i)||4===t.length&&0===t.search(/#[0-9a-f]{3}/i)}function isRGB(t){return 0===t.search(/rgb\(( ?\d{1,3},){2} ?\d{1,3}\)/i)}function isRGBA(t){return 0===t.search(/rgba\(( ?\d{1,3},){3}( ?\d(\.\d+)?)\)/i)}function isColor(t){return isHEXColor(t)||isRGB(t)||isRGBA(t)}function random(t,i){return Math.floor(Math.random()*(i-t+1))+t}function getRandomRGB(t,i){return"rgb("+random(t,i)+","+random(t,i)+","+random(t,i)+")"}function SVGParser(t){for(var i=t.match(/d="( |,|\.|\d*|[A-Z])*"/g),n=[],s=0;i[s];s++){n[s]=i[s].match(/[A-Z] ( ?\d*(.\d{1,3})+,\d*(.\d{1,3})+){1,3}/g);for(var e=1;n[s][e];e++){var o=[];1===e&&(o=n[s][0].match(/\d+(\.\d+)?( |,)\d+(\.\d+)?/g)),n[s][e-1]=o.concat(n[s][e].match(/\d+(\.\d+)?( |,)\d+(\.\d+)?/g));for(var r=0;n[s][e-1][r];r++)n[s][e-1][r]=n[s][e-1][r].split(","),n[s][e-1][r][0]=+n[s][e-1][r][0],n[s][e-1][r][1]=+n[s][e-1][r][1],r===n[s][e-1].length-1&&(n[s][e-1][r][n[s][e-1][r].length]=!0);e===n[s].length-1&&delete n[s][e]}for(var a=[],e=0;n[s][e];e++)a=a.concat(n[s][e]);n[s]=a}return n}function Transform(t){this.options=t=t||{},this.id=t.property||""+Math.random(),this.options.rate=t.rate||1,this.options.factor=t.factor||1,this.options.endShift=t.endShift||100,this.options.startShift=+t.startShift||0,this.options.shift=t.shift||this.options.startShift,this.options.start=t.start||0,this.options.end=t.end,this.options.time=+t.time,this.events=new Listing,this.options.recourse=!!t.recourse,this.reverse=!1}Drawing.prototype.render=function(t,i){t.id=i,this.context.beginPath(),this.context.fillStyle="#000000",this.context.strokeStyle="#000000",this.context.closePath(),dynamic.move(t),t.animate(this.context);for(var n in t.childrens.list)this.render(t.childrens.list[n],n)},Drawing.prototype.pause=function(){var t=this.fps;this.fps=0,this._fps=t},Drawing.prototype.play=function(t){this.fps=+t||this.fps},Object.defineProperty(Drawing.prototype,"fps",{get:function(){return this._fps},set:function(t){var i=this;this.core&&clearInterval(this.core),0!=t&&(this.core=setInterval(function(){i.context.clearRect(0,0,i.DOMObject.width,i.DOMObject.height);for(var t in i.stack.list)i.render(i.stack.list[t],t)},1e3/+t)),this._fps=t}}),EventsListing.prototype.append=function(t,i,n){this.list[t]||(this.list[t]={}),this.list[t][i]||(this.list[t][i]=[]),this.list[t][i].push(n)},EventsListing.prototype.remove=function(t,i){return i?(delete this.list[t][i],void(0==Object.keys(this.list[t]).length&&delete this.list[t])):void delete this.list[t]},PropertyListing.prototype.append=function(t){return this.list[t.id]=t,this.up(this.parent,t)},PropertyListing.prototype.remove=function(t){delete this.list[t],this.rem(this.parent)},PropertyListing.prototype.getObject=function(t,i){if(i){for(var n in this.list){if(n==t)return this.list[n];var s=this.list[n].childrens.getObject(t,!0);if(s)return s}return!1}return this.list[t]},PropertyListing.prototype.getObjectsMap=function(){var t={};for(var i in this.list)t[i]=this.list[i].childrens.getObjectsMap();return t},Object.defineProperties(CanvasObject.prototype,{x:{get:function(){return this.parent?this.now.x*Math.cos(this.parent.radian)-this.now.y*Math.sin(this.parent.radian)+this.parent.x:+this.now.x},set:function(t){this.now.x=+t}},y:{get:function(){return this.parent?this.now.x*Math.sin(this.parent.radian)+this.now.y*Math.cos(this.parent.radian)+this.parent.y:+this.now.y},set:function(t){this.now.y=+t}},radian:{get:function(){return this.parent?+this.parent.radian+ +this.now.radian:+this.now.radian},set:function(t){this.now.radian=+t}}}),CanvasObject.prototype.start=function(){return this.drawing.stack.append(this),this},CanvasObject.prototype.stop=function(){return this.drawing.stack.remove(this.id),this},CanvasObject.prototype.animate=function(){},CanvasObject.prototype.transform=function(t){return this._transform||(this._transform=new Listing),t?(this._transform.append(t.id,t),this.operationContext=t,this):this._transform},CanvasObject.prototype.move=function(t,i){return i?this.transform(new Transform({property:"trajectory",type:"line",points:[[this.x,this.y],t],time:i})):(this.x=t[0],void(this.y=t[1]))},CanvasObject.prototype.moveProperty=function(t,i,n){return n?this.transform(new Transform({property:t,start:this.now[t],end:i,time:n})):void(this.now[t]=i)},CanvasObject.prototype.append=function(t){return this.childrens.append(t)},Circle.prototype=Object.create(CanvasObject.prototype),Circle.prototype.animate=function(t){t.beginPath();var i=this.radian;t.arc(this.x,this.y,this.now.radius,i,2*Math.PI/100*this.now.shift+i),changeContext(t,this.now),t.closePath()},Cluster.prototype=Object.create(CanvasObject.prototype),Cluster.prototype.transform=function(){return this._transform||(this._transform=new Listing),this._transform},Cluster.prototype.animate=function(){return this.iteration>this.count?void(this.iteration=1):(this._animate=this.parent.animate,this._animate(this.drawing.context),this.iteration++,void this.animate())},Object.defineProperties(Cluster.prototype,{now:{get:function(){if(this.parameters.iteration!==this.iteration&&this.parent){for(var t in this.parent.now)if(this.correlation[t]){var i=+this.correlation[t];"function"==typeof this.correlation[t]&&(i=+this.correlation[t](this.iteration,this)),this.parameters.list[t]=this.parent.now[t]+i*this.iteration}else this.parameters.list[t]=this.parent.now[t];this.parameters.iteration=+this.iteration}return this.parameters.list},set:function(t){return this.parameters.list}},x:{get:function(){return this.parent.parent?this.now.x*Math.cos(this.parent.parent.radian)-this.now.y*Math.sin(this.parent.parent.radian)+this.parent.parent.x:+this.now.x},set:function(t){return+this.now.x}},y:{get:function(){return this.parent.parent?this.now.x*Math.sin(this.parent.parent.radian)+this.now.y*Math.cos(this.parent.parent.radian)+this.parent.parent.y:+this.now.y},set:function(t){return+this.now.y}},radian:{get:function(){return this.parent.parent?+this.parent.parent.radian+ +this.now.radian:+this.now.radian},set:function(t){return+this.now.radian}},services:{get:function(){return this.parent.services},set:function(t){}}}),Curve.prototype=Object.create(CanvasObject.prototype),Object.defineProperties(CanvasObject.prototype,{points:{get:function(){this.services.points||(this.services.points=[]);for(var t=this.radian-Math.PI/4,i=Math.sin(t),n=Math.cos(t),s=0;this.now.points[s];s++){var e=this.now.points[s];this.services.points[s]=[e[0]*n-e[1]*i,e[0]*i+e[1]*n,e[2]]}return this.services.points},set:function(t){this.services.length=formula.getLengthOfCurve(t,this.now.step),this.now.points=t}}}),Curve.prototype.animate=function(t){var i=this.points,n=[this.x,this.y];if(!(i.length<2)){t.beginPath(),t.moveTo(i[0][0]+n[0],i[0][1]+n[1]),this.now.shift>100&&(this.now.shift=100);for(var s=i[0],e=0;e<=this.now.shift;e+=this.now.step){var o=formula.getPointOnCurve(e,this.points);Math.abs(s[0]-o[0])<1&&Math.abs(s[1]-o[1])<1||(s=o,t.lineTo(o[0]+n[0],o[1]+n[1]))}changeContext(t,this.now),t.closePath()}},Ellipse.prototype=Object.create(CanvasObject.prototype),Ellipse.prototype.animate=function(t){t.beginPath();var i=0,n=formula.getPointOnEllipse(this.now.semiAxisX,this.now.semiAxisY,i,this.now.radian,this.x,this.y);for(t.moveTo(n[0],n[1]);i<=2*Math.PI;i+=this.now.step){var s=formula.getPointOnEllipse(this.now.semiAxisX,this.now.semiAxisY,i,this.now.radian,this.x,this.y);t.lineTo(s[0],s[1])}t.lineTo(n[0],n[1]),changeContext(t,this.now),t.closePath()},Line.prototype=Object.create(CanvasObject.prototype),Object.defineProperties(Line.prototype,{points:{get:function(){this.services.points||(this.services.points=[]);for(var t=this.radian-Math.PI/4,i=Math.sin(t),n=Math.cos(t),s=0;this.now.points[s];s++){var e=this.now.points[s];this.services.points[s]=[e[0]*n-e[1]*i,e[0]*i+e[1]*n,e[2]]}return this.services.points},set:function(t){this.now.points=t}}}),Line.prototype.animate=function(t){if(!(this.now.points.length<2)){t.beginPath(),t.moveTo(this.points[0][0]+this.x,this.points[0][1]+this.y),this.now.shift>101&&(this.now.shift=101);for(var i=0;i<=this.now.shift;i+=this.now.step){var n=formula.getPointOnLine(i,this.points);t.lineTo(n[0]+this.x,n[1]+this.y)}changeContext(t,this.now),t.closePath()}},Path.prototype=Object.create(CanvasObject.prototype),Object.defineProperties(Path.prototype,{points:{get:function(){this.services.points||(this.services.points=[]);for(var t=this.radian-Math.PI/4,i=Math.sin(t),n=Math.cos(t),s=0;this.now.points[s];s++){var e=this.now.points[s];this.services.points[s]=[e[0]*n-e[1]*i,e[0]*i+e[1]*n,e[2]]}return this.services.points},set:function(t){this.services.map=formula.getMapOfPath(t,this.now.step),this.services.length=0;for(var i in this.services.map)this.services.length+=this.services.map[i];this.now.points=t}}}),Path.prototype.animate=function(t){var i=this.points,n=[this.x,this.y];if(!(i.length<2)){t.beginPath(),t.moveTo(i[0][0]+n[0],i[0][1]+n[1]),this.now.shift>100&&(this.now.shift=100);for(var s=i[0],e=0;e<=this.now.shift;e+=this.now.step){var o=formula.getPointOnPath(e,this.points);Math.abs(s[0]-o[0])<1&&Math.abs(s[1]-o[1])<1||(s=o,t.lineTo(o[0]+n[0],o[1]+n[1]))}changeContext(t,this.now),t.closePath()}},Polygon.prototype=Object.create(CanvasObject.prototype),Polygon.prototype.animate=function(t){if(this.now.sidesCount<3)return!1;var i=formula.getPointOnCircle(this.radian,this.now.radius,this.x,this.y);t.beginPath(),t.moveTo(i[0],i[1]);for(var n=0;n<this.now.sidesCount;n++){var s=formula.getPointOnCircle(2*Math.PI/this.now.sidesCount*n+this.radian,this.now.radius,this.x,this.y);t.lineTo(s[0],s[1])}t.lineTo(i[0],i[1]),changeContext(t,this.now),t.closePath()},Polyline.prototype=Object.create(CanvasObject.prototype),Polyline.prototype.animate=function(t){if(!(this.now.points.length<2)){this.now.showBreakpoints&&(t.beginPath(),markControlPoints(this.now.points,t,this),t.fill(),t.closePath()),t.beginPath(),t.moveTo(this.now.points[0][0]+this.x,this.now.points[0][1]+this.y),this.now.shift>101&&(this.now.shift=101);for(var i=0;i<=this.now.shift;i+=this.now.step){var n=formula.getPointOnCurve(i,this.now.points);t.lineTo(n[0]+this.parent.x,n[1]+this.parent.y)}changeContext(t,this.now),t.closePath()}},Rect.prototype=Object.create(CanvasObject.prototype),Rect.prototype.animate=function(t){t.beginPath();var i=this.radian,n=[this.x,this.y];t.moveTo(n[0],n[1]),n=formula.getPointOnCircle(i,this.width,n[0],n[1]),t.lineTo(n[0],n[1]),n=formula.getPointOnCircle(i+Math.PI/2,this.height,n[0],n[1]),t.lineTo(n[0],n[1]),n=formula.getPointOnCircle(i+Math.PI/2,this.height,this.x,this.y),t.lineTo(n[0],n[1]),t.lineTo(this.x,this.y),changeContext(t,this.now),t.closePath()},Spline.prototype=Object.create(CanvasObject.prototype),Object.defineProperties(Spline.prototype,{points:{get:function(){this.services.points||(this.services.points=[]);for(var t=this.radian-Math.PI/4,i=Math.sin(t),n=Math.cos(t),s=0;this.now.points[s];s++){var e=this.now.points[s];this.services.points[s]=[e[0]*n-e[1]*i,e[0]*i+e[1]*n,e[2]]}return this.services.points},set:function(t){this.services.map=formula.getMapOfSpline(t,this.now.step),this.services.length=0;for(var i in this.services.map)this.services.length+=this.services.map[i];this.now.points=t}}}),Spline.prototype.animate=function(t){var i=this.points,n=[this.x,this.y];if(!(i.length<2)){t.beginPath(),t.moveTo(i[0][0]+n[0],i[0][1]+n[1]),this.now.shift>100&&(this.now.shift=100);for(var s=i[0],e=0;e<=this.now.shift;e+=this.now.step){var o=formula.getPointOnSpline(e,i,this.services);Math.abs(s[0]-o[0])<1&&Math.abs(s[1]-o[1])<1||(s=o,t.lineTo(o[0]+n[0],o[1]+n[1]))}changeContext(t,this.now),t.closePath()}};var dataContextChanges={fill:function(t,i){t.fillStyle=i,t.fill()},stroke:function(t,i){t.strokeStyle=i,t.stroke()},lineWidth:function(t,i){t.lineWidth=+i}},dynamic={move:function(t){var i=t.transform().list,n=t.drawing.fps,s=1e3/+n;for(var e in i){var o=i[e],r=o.options,a=o.event("start");a&&(a(a,o,t),o.events.remove("start")),r.step||(r.step=(r.endShift-r.startShift)/(r.time/s)),o.reverse?r.shift-=+r.step*r.rate:r.shift+=+r.step*r.rate,this.data[e]?this.data[e].prepareData(t):t.now[e]=r.start+(r.end-r.start)/100*o.shift;for(var h in o.events.list)if(!isNaN(+h)){if(o.reverse){if(+h>r.shift||+h<r.shift-r.step)continue}else if(+h<r.shift||+h>r.shift+r.step)continue;o.events.list[h](o.event(h),o,t)}if(o.reverse){if(r.shift>r.startShift)continue}else if(r.shift<r.endShift)continue;t.transform().remove(e),o.options.recourse&&(o.reverse?o.options.shift=o.options.endShift:o.options.shift=o.options.startShift,t.transform(o)),o.event("callback")&&(o.event("callback")(o.event("callback"),o,t),o.events.remove("callback"))}},data:{trajectory:{type:"trajectory",prepareData:function(t){var i=this.type,n=t.transform().list[i],s=this.functions[n.options.type](n.options,n.shift);t.x=s[0],t.y=s[1]},functions:{circle:function(t,i){var n=2*Math.PI/100*i;return t.reverse&&(n=2*Math.PI-2*Math.PI/100*i),formula.getPointOnCircle(n,t.radius,t.center[0],t.center[1])},polygon:function(t,i){},line:function(t,i){return formula.getPointOnLine(i,t.points)},curve:function(t,i){return formula.getPointOnCurve(i,t.points)}}},fill:{type:"fill",prepareData:function(t){var i=this.type,n=t.transform().list[i],s=n.options.start,e=n.options.end,o=n.shift;t.now.fill=formula.changeColor(s,e,o)}},stroke:{type:"stroke",prepareData:function(t){var i=this.type,n=t.transform().list[i],s=n.options.start,e=n.options.end,o=n.shift;t.now.stroke=formula.changeColor(s,e,o)}},points:{type:"points",prepareData:function(t){var i=this.type,n=t.transform().list[i],s=n.options.start,e=n.options.end,o=n.shift;t.points=this.functions.pointsRecourse(s,e,o)},functions:{pointsRecourse:function(t,i,n){for(var s=[],e=0;e<t.length||e<i.length;e++)if(typeof t[e]==typeof i[e]&&t[e]){if("object"!=typeof t[e]){s=formula.getPointOnLine(n,[t,i]);break}s[e]=this.pointsRecourse(t[e],i[e],n)}else s[e]=t[e];return s}}}}},formula={getPointOnCircle:function(t,i,n,s){n=+n||0,s=+s||0;var e=+i*Math.sin(+t),o=+i*Math.cos(+t);return[n+o,s+e]},getPointOnEllipse:function(t,i,n,s,e,o){s=s||0,s*=-1,e=e||0,o=o||0;var r=t*Math.cos(+n),a=i*Math.sin(+n),h=r*Math.cos(s)+a*Math.sin(s),p=-r*Math.sin(s)+a*Math.cos(s);return[h+e,p+o]},getPointsFromPolygon:function(t,i,n,s,e){var o=[];o.push(this.getPointOnCircle(i,n,s,e));for(var r=0;r<t;r++)o.push(this.getPointOnCircle(2*Math.PI/t*r+i,n,s,e));return o},getPointOnCurve:function(t,i){var n=[0,0],s=i.length-1;t/=100;for(var e=0;i[e];e++){var o=this.factorial(s)/(this.factorial(e)*this.factorial(s-e))*Math.pow(t,e)*Math.pow(1-t,s-e);n[0]+=i[e][0]*o,n[1]+=i[e][1]*o}return n},getPointOnLine:function(t,i){var n=(i[1][0]-i[0][0])*(t/100)+i[0][0],s=(i[1][1]-i[0][1])*(t/100)+i[0][1];return[n,s]},getCenterToPointDistance:function(t){return Math.sqrt(Math.pow(t[0],2)+Math.pow(t[1],2))},HEXtoRGBA:function(t){var i=[];return 4===t.length&&(i[0]=parseInt(t.substring(1,2)+t.substring(1,2),16),i[1]=parseInt(t.substring(2,3)+t.substring(2,3),16),i[2]=parseInt(t.substring(3)+t.substring(3),16)),7===t.length&&(i[0]=parseInt(t.substring(1,3),16),i[1]=parseInt(t.substring(3,5),16),i[2]=parseInt(t.substring(5),16)),i[3]=1,i},RGBtoRGBA:function(t){var i=t.match(/\d{1,3}(\.\d+)?/g);return"0"===i[3]?i[3]=0:i[3]=+i[3]||1,i},changeColor:function(t,i,n){var s=[];isRGBA(t)||isRGB(t)?t=formula.RGBtoRGBA(t):isHEXColor(t)&&(t=formula.HEXtoRGBA(t)),isRGBA(i)||isRGB(i)?i=formula.RGBtoRGBA(i):isHEXColor(i)&&(i=formula.HEXtoRGBA(i));for(var e=0;e<3;e++)s[e]=Math.round(+t[e]+(+i[e]-+t[e])/100*n);var o=+(+t[3]+(+i[3]-+t[3])/100*n).toFixed(4);return"rgba("+s[0]+","+s[1]+","+s[2]+","+o+")"},factorial:function(t){for(var i=1;t;)i*=t--;return i}};formula.getLengthOfCurve=function(t,i){for(var n=0,s=t[0],e=0;e<=100;e+=i){var o=formula.getPointOnCurve(e,t);n+=formula.getCenterToPointDistance([o[0]-s[0],o[1]-s[1]]),s=o}return n},formula.getMapOfSpline=function(t,i){for(var n=[[]],s=0,e=0;t[e];e++){var o=n[s].length;n[s][+o]=t[e],t[e][2]&&e!=t.length-1&&(n[s]=formula.getLengthOfCurve(n[s],i),s++,n[s]=[t[e]])}return n[s]=formula.getLengthOfCurve(n[s],i),n},formula.getPointOnSpline=function(t,i,n){var s=n.length/100*t;t>=100&&(s=n.length);for(var e=0,o=0,r=0,a=[];n.map[o]&&e+n.map[o]<s;o++)e+=n.map[o];for(var h=0;i[h]&&r<=o;h++)i[h][2]===!0&&r++,r>=o&&a.push(i[h]);return formula.getPointOnCurve((s-e)/(n.map[o]/100),a)},formula.getLengthOfEllipticArc=function(t,i,n,s,e){for(var o=0,r=this.getPointOnEllipse(t,i,n),a=n;a<=s;a+=e){var h=this.getPointOnEllipse(t,i,a);o+=this.getCenterToPointDistance([h[0]-r[0],h[1]-r[1]]),r=h}return o},formula.getMapOfPath=function(t,i){for(var n=[[]],s=0,e=0;t[e];e++){var o=t[e];if(t[e].length>3){e>1&&!n[s][0]&&s++;var r=n[s][0]||[];if(n[s]=this.getLengthOfEllipticArc(o[0],o[1],o[2],o[3],i||.01),s++,!t[e+1])continue;var a=this.getPointOnEllipse(o[0],o[1],o[2]+Math.PI,o[4],r[0]||t[e-1][0]||0,r[1]||t[e-1][1]||0),h=this.getPointOnEllipse(o[0],o[1],o[3],o[4],a[0],a[1]);n[s]=[h]}else{var p=n[s].length;n[s][+p]=o,o[2]&&e!=t.length-1&&(n[s]=formula.getLengthOfCurve(n[s],i),s++,n[s]=[o])}}return"number"!=typeof n[s]&&(n[s]=formula.getLengthOfCurve(n[s],i)),n},formula.getPointOnPath=function(t,i,n){var s=n.length/100*t;t>=100&&(s=n.length);for(var e=0,o=0,r=0,a=[];n.map[o]&&e+n.map[o]<s;o++)e+=n.map[o];for(var h=[],p=0;i[p]&&r<=o;p++){var c=i[p];if((c[2]===!0||c.length>3)&&r++,r===o&&c.length>3){var f=this.getPointOnEllipse(c[0],c[1],c[2]+Math.PI,c[4],h[0]||0,h[1]||0),u=c[3]-c[2],l=s-e,v=l/(n.map[o]/100),g=c[2]+u/100*v;return this.getPointOnEllipse(c[0],c[1],g,c[4],f[0],f[1])}r>=o&&a.push(c),h=c.length>3?this.getPointOnEllipse(c[0],c[1],c[3]+Math.PI,c[4],h[0],h[1]):c}return this.getPointOnCurve((s-e)/(n.map[o]/100),a)},Transform.prototype.play=function(t){return this.options.rate=t||1,this},Transform.prototype.pause=function(){return this.options.rate=0,this},Transform.prototype.stop=function(){return this.options.rate=0,this.reverse?this.options.shift=this.options.endShift:this.options.shift=this.options.startShift,this},Transform.prototype.repeat=function(){this.reverse?this.options.shift=this.options.endShift:this.options.shift=this.options.startShift},Transform.prototype.event=function(t,i){return i?(this.events.append(t,i),this):this.events.list[t]},Object.defineProperties(Transform.prototype,{shift:{get:function(){return this.options.timingFunction?this.options.shift*formula.getPointOnCurve(this.options.shift,this.timingFunction)[1]:this.options.shift},set:function(t){return this.shift}},timingFunction:{get:function(){var t=[[0,0]];return t=t.concat(this.options.timingFunction),t.push([1,1]),t},set:function(t){this.options.timingFunction=t}}});