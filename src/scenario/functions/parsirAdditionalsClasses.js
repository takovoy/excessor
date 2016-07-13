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