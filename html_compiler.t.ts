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

interface HtmlTemplate {
    template:string;
    attributes?: Attribute[]
}

interface HtmlTemplates extends _.Dictionary<HtmlTemplate> {
    ANY:HtmlTemplate;
    EMPTY:HtmlTemplate;
}

interface PlaceholderTemplates extends _.Dictionary<string> {
    PLACEHOLDER_WRAPPER:string;
    PLACEHOLDER:string;
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

    static isAttributeMultivalued(name:string) {
        var multivalued_attributes:_.Dictionary<boolean> = {
            'class': true
        };

        return !!multivalued_attributes[name];
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
        var attributes_string: string,
            item_template:HtmlTemplate,
            item_html:string,
            html:string;

        if (this.data) {
            item_template = HtmlItem.TEMPLATES[this.data.tag] || HtmlItem.TEMPLATES.ANY;
            attributes_string = this.getAttributesString(item_template);
            item_html = item_template.template
                .replace(Placeholders.ATTRIBUTES, attributes_string ? ' ' + attributes_string : attributes_string)
                .replace(new RegExp(Placeholders.TAG, 'g'), this.data.tag || 'div');

            if(this.data.count) {
                var items:string[] = [];
                for (var i = this.data.count; i; i--) {
                    items.push(item_html);
                }

                html = items.join('\n');
            }

            return html || item_html;
        } else {
            return HtmlItem.TEMPLATES.EMPTY.template;
        }
    }

    /**
     * Calculates item html attributes string
     * @returns {string}
     */
    public getAttributesString(template:HtmlTemplate):string {
        var attributes_string:string,
            data:ItemData = this.data,
            attributes:Attribute[] = template.attributes || [],
            attributes_value_dictionary:_.Dictionary<string> = {};

        if(data) {
            attributes = _.union(attributes, data.attributes || []);

            name = this.getName();
            if(name){
                attributes.unshift({
                    name: 'class',
                    value: name
                });
            }

            _.each(attributes, (attribute:Attribute) => {
                attributes_value_dictionary[attribute.name] = attributes_value_dictionary[attribute.name] && HtmlItem.isAttributeMultivalued(attribute.name) ?
                attributes_value_dictionary[attribute.name] + ' ' + attribute.value :
                    attribute.value;
            });

            attributes = [];

            _.each(attributes_value_dictionary, (value:string, name:string) => {
                attributes.push({
                    name: name,
                    value: value
                });
            });

        }

        attributes_string = _.map(attributes, (attribute:Attribute) => {
            return attribute.name + '="' + attribute.value + '"';
        }).join(' ') || '';

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
    public static TEMPLATES:HtmlTemplates = {
        'a': {
            template: '<a' + Placeholders.ATTRIBUTES + '>' + Placeholders.CHILDREN + '</a>',
            attributes: [
                {
                    name: 'href',
                    value: '#'
                },
                {
                    name: 'title',
                    value: ''
                }
            ]
        },
        'img': {
            template: '<img' + Placeholders.ATTRIBUTES + '/>',
            attributes: [
                {
                    name: 'src',
                    value: ''
                },
                {
                    name: 'alt',
                    value: ''
                }
            ]
        },
        ANY: {
            template: '<' + Placeholders.TAG + Placeholders.ATTRIBUTES + '>' + Placeholders.CHILDREN + '</' + Placeholders.TAG + '>'
        },
        EMPTY: {
            template: Placeholders.CHILDREN
        }
    };
}

class PlaceholderItem {
    constructor(private item:Serialized<ItemData>) {
    }

    /**
     * returns item HTML
     * @returns {string}
     */
    public getHTML():string {
        var item_html:string;

        item_html = (
            this.item.children.length ?
                PlaceholderItem.TEMPLATES.PLACEHOLDER_WRAPPER :
                PlaceholderItem.TEMPLATES.PLACEHOLDER
        )
            .replace(new RegExp(Placeholders.TAG, 'g'), this.item.data.name);

        return item_html;
    }

    /**
     * HTML tag templates
     * @type {{a: string, img: string, ANY: string, EMPTY: string}}
     */
    public static TEMPLATES:PlaceholderTemplates = {
        PLACEHOLDER_WRAPPER: '{{#' + Placeholders.TAG + '}}' + Placeholders.CHILDREN + '{{/' + Placeholders.TAG + '}}',
        PLACEHOLDER: '{{' + Placeholders.TAG + '}}'
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
        if (item.data && item.data.type === TYPES.PLACEHOLDER) {
            return new PlaceholderItem(item).getHTML();
        } else {
            return new HtmlItem(item.data).getHTML();
        }
    }

    private static applyChildren(item_code: string, children_code:string):string {
        if (children_code && item_code !== HtmlItem.TEMPLATES.EMPTY.template) {
            children_code = '\n' + children_code + '\n';
        }

        return item_code.replace(new RegExp(Placeholders.CHILDREN, 'g'), children_code);
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

