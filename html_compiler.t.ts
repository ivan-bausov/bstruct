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

interface Item extends Serialized<ItemData>{}

class Compiler implements ICompiler<string> {

    constructor(data:Item) {
        this.html = Compiler.render(data).replace(/{BLOCK}_/g, '');
    }

    public compile():string {
        return this.html;
    }

    private static render(item:Item):string {
        var item_code:string = Compiler.renderItem(item),
            children_code:string = Compiler.renderChildren(item);

        return Compiler.applyChildren(item_code, children_code);
    }

    private static applyChildren(item_code: string, children_code:string):string {
        if(children_code && item_code !== '{CHILDREN}') {
            children_code = '\n' + children_code + '\n';
        }

        return item_code.replace('{CHILDREN}', children_code);
    }

    private static mergeChildren(children:string[], item:Item):string {
        var result:string;

        if (item.data) {
            result = _.map(children.join('\n').split('\n'), (str:string) => {
                return str && ('    ' + str);
            }).join('\n');

            if (item.data.type === TYPES.BLOCK) {
                result = result.replace(/{BLOCK}/g, item.data.name);
            }
        } else {
            result = children.join('\n');
        }

        return result;
    }

    private static renderChildren(item:Item):string {
        return Compiler.mergeChildren(
            _.map(item.children, (child) => {
                return Compiler.render(child);
            }),
            item
        );
    }

    private static renderItem(item:Item):string {
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

    private static compileItemName(item:Item):string {
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

