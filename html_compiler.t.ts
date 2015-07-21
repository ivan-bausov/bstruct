/**
 * Copyright (c) 2015 Ivan Bausov <ivan.bausov@gmail.com> (MIT Licensed)
 * A part of B:STRUCT package <https://github.com/ivan-bausov/bstruct>
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

interface Templates extends _.Dictionary<string> {
    ANY:string;
    EMPTY:string;
}

/**
 * Placeholders used in templates;
 */
class Placeholders {
    public static CHILDREN:string = '{CHILDREN}';//children HTML
    public static BLOCK:string = '{BLOCK}';//parent BLOCK name
    public static ATTRIBUTES:string = '{ATTRIBUTES}';//html tag attributes
    public static TAG:string = '{TAG}';//tag name
}

/**
 * Represents single item render logic
 */
class HtmlItem {
    constructor(private data:ItemData) {
    }

    /**
     * returns item name according to its type
     * @returns {string}
     */
    public getName():string {
        var data:ItemData = this.data;

        switch (data && data.type) {
            case TYPES.BLOCK:
                return HtmlItem.getBlockName(data.name);
            case TYPES.ELEMENT:
                return HtmlItem.getElementName(data.name);
            default :
                return null;
        }
    }

    /**
     * returns item HTML
     * @returns {string}
     */
    public getHTML():string {
        var attributes_string: string;

        if (this.data) {
            attributes_string = this.getAttributesString();
            return (HtmlItem.TEMPLATES[this.data.tag] || HtmlItem.TEMPLATES.ANY)
                .replace(Placeholders.ATTRIBUTES, attributes_string ? ' ' + attributes_string : attributes_string)
                .replace(new RegExp(Placeholders.TAG, 'g'), this.data.tag || 'div');
        } else {
            return HtmlItem.TEMPLATES.EMPTY;
        }
    }

    /**
     * Calculates item html attributes string
     * @returns {string}
     */
    public getAttributesString():string {
        var attributes_string:string = '',
            data:ItemData = this.data,
            attributes:Attribute[];

        if(data) {
            attributes = data.attributes || [];

            name = this.getName();
            if(name){
                attributes.unshift({
                    name: 'class',
                    value: name
                });
            }

            attributes_string = _.map(attributes, (attribute:Attribute) => {
                return attribute.name + '="' + attribute.value + '"';
            }).join(' ');
        }

        return attributes_string;
    }

    /**
     * returns appropriate CSS-class name for BLOCK name
     * @param name
     * @returns {string}
     */
    private static getBlockName(name:string):string {
        return 'block-' + name;
    }

    /**
     * returns appropriate CSS-class name for ELEMENT name
     * @param name
     * @returns {string}
     */
    private static getElementName(name:string):string {
        return name ? Placeholders.BLOCK + '_' + name : null;
    }

    /**
     * HTML tag templates
     * @type {{a: string, img: string, ANY: string, EMPTY: string}}
     */
    public static TEMPLATES:Templates = {
        'a': '<a' + Placeholders.ATTRIBUTES + ' href="#" title="">' + Placeholders.CHILDREN + '</a>',
        'img': '<img' + Placeholders.ATTRIBUTES + ' src="" alt=""/>',
        ANY: '<' + Placeholders.TAG + Placeholders.ATTRIBUTES + '>' + Placeholders.CHILDREN + '</' + Placeholders.TAG + '>',
        EMPTY: Placeholders.CHILDREN
    };
}

class Compiler implements ICompiler<string> {

    constructor(data:Item) {
        this.html = Compiler.render(data).replace(new RegExp(Placeholders.BLOCK + '_','g'), '');
    }

    public compile():string {
        return this.html;
    }

    private static render(item:Item):string {
        var item_code:string = Compiler.renderItem(item),
            children_code:string = Compiler.renderChildren(item);

        return Compiler.applyChildren(item_code, children_code);
    }

    private static renderItem(item:Item):string {
        return new HtmlItem(item.data).getHTML();
    }

    private static applyChildren(item_code: string, children_code:string):string {
        if(children_code && item_code !== HtmlItem.TEMPLATES.EMPTY) {
            children_code = '\n' + children_code + '\n';
        }

        return item_code.replace(Placeholders.CHILDREN, children_code);
    }

    private static mergeChildren(children:string[], item:Item):string {
        var result:string;

        if (item.data) {
            result = _.map(children.join('\n').split('\n'), (str:string) => {
                return str && ('    ' + str);
            }).join('\n');

            if (item.data.type === TYPES.BLOCK) {
                result = result.replace(new RegExp(Placeholders.BLOCK, 'g'), item.data.name);
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

    private html:string;
}

export = Compiler;

