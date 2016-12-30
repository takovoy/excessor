/**
 * Created by takovoy on 07.07.2016.
 */

function ParsirText (options){
    this.type                   = 'span';
    this.properties             = options.props || {};
    this.properties.innerHTML   = options.text || '';
}

function ParsirInput (options){
    this.type                   = 'input';
    this.properties             = options.props || {};
    this.properties.value       = options.value || '';
    this.properties.placeholder = options.placeholder || '';
    this.events                 = options.events || {};
}

function ParsirButton (options,click){
    this.type           = 'button';
    this.properties     = options.props || {};
    this.childs         = options.childs;
    this.events         = options.events || {};
    this.events.click   = click || this.events.click || function(){};
}