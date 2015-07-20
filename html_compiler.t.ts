/**
 * Created by Ivan on 18/07/15.
 */

import _ = require('underscore');
import interfaces = require('./compiler.i');
import enums = require('./compiler.e');

import ICompiler = interfaces.ICompiler;
import ItemData = interfaces.ItemData;
import Attribute = interfaces.Attribute;
import Serialized = interfaces.Serialized;
import TYPES = enums.TYPES

class Compiler implements ICompiler<string> {

    constructor(data:Serialized<ItemData>) {
        this.html = Compiler.render(data).replace(/{BLOCK}_/g, '');
    }

    public compile():string {
        return this.html;
    }

    private static render(item:Serialized<ItemData>):string {
        var html:string = Compiler.renderToHTMLTemplate(item),
            children_html:string[] = Compiler.renderChildren(item.children),
            children_html_string:string = Compiler.getFormatedChildrenString(children_html, item);

        return Compiler.applyChildren(html, children_html_string);
    }

    private static applyChildren(parent_code: string, children_code:string):string {
        children_code = parent_code !== '{CHILDREN}' && children_code ? '\n' + children_code + '\n' : children_code;

        return parent_code.replace('{CHILDREN}', children_code);
    }

    private static getFormatedChildrenString(strings:string[], item: Serialized<ItemData>):string{
        var result:string;

        if (item.data) {
            result = _.map(strings.join('\n').split('\n'), (str:string) => {
                return str && ('    ' + str);
            }).join('\n');

            if (item.data.type === TYPES.BLOCK) {
                result = result.replace(/{BLOCK}/g, item.data.name);
            }
        } else {
            result = strings.join('\n');
        }

        return result;
    }

    private static renderChildren(children: Serialized<ItemData>[]):string[] {
        return _.map(children, (child) => {
            return Compiler.render(child);
        });
    }

    private static renderToHTMLTemplate(item:Serialized<ItemData>):string {
        var template:string,
            name:string,
            attributes: Attribute[],
            attributes_string: string;

        if (item.data) {
            attributes = item.data.attributes || [];
            template = Compiler.TEMPLATES[item.data.tag] || Compiler.TEMPLATES['ANY'];
            name = Compiler.compileItemName(item);
            if(name){
                attributes.unshift({
                    name: 'class',
                    value: name
                });
            }

            attributes_string = _.map(attributes, (attribute:Attribute) => {
                return attribute.name + '="' + attribute.value + '"';
            }).join(' ');

            return template
                .replace('{attributes}', attributes_string ? ' ' + attributes_string : attributes_string)
                .replace(/{tag}/g, item.data.tag || 'div');
        } else {
            return '{CHILDREN}';
        }
    }

    private static compileItemName(item:Serialized<ItemData>):string {
        var data:ItemData = item.data;

        if(data.type === TYPES.BLOCK) {
            return 'block-' + data.name;
        } else if (data.type === TYPES.ELEMENT) {
            if (data.name) {
                return '{BLOCK}_' + data.name;
            }
        }

        return null;
    }

    private html:string;
    private static TEMPLATES:_.Dictionary<string> = {
        'a': '<a{attributes} href="#" title="">{CHILDREN}</a>',
        'img': '<img{attributes} src="" alt=""/>',
        'ANY': '<{tag}{attributes}>{CHILDREN}</{tag}>'
    };
}

export = Compiler;

