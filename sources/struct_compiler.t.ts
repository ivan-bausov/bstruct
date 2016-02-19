/**
 * Copyright (c) 2016 Ivan Bausov <ivan.bausov@gmail.com> (MIT Licensed)
 * A part of B:STRUCT package <https://github.com/ivan-bausov/bstruct>
 */

import _ = require('underscore');
import {
    ICompiler,
    ItemData,
    Attribute,
    Serialized
} from './compiler.i';
import {TYPES} from './compiler.e';
import Tree from './tree.t';

interface Declaration {
    type:string;
    pattern:RegExp;
    parser:(line_data:string, line_number:number) => any
}

export default class StructCompiler implements ICompiler<Serialized<ItemData>> {
    static Errors = {
        BLOCK_DECLARATION_SYNTAX_ERROR: "BLOCK declaration syntax error",
        ELEMENT_DECLARATION_SYNTAX_ERROR: "ELEMENT declaration syntax error",
        ATTRIBUTE_DECLARATION_SYNTAX_ERROR: "ATTRIBUTE declaration syntax error",
        PLACEHOLDER_DECLARATION_SYNTAX_ERROR: "PLACEHOLDER declaration syntax error"
    };

    constructor(data:string) {
        this.source_strings = data.split('\n');
        this.buildTree();
    }

    public compile():Serialized<ItemData> {
        return this.tree.serialize();
    }

    private buildTree():void {
        _.each(this.source_strings, (line:string, index:number) => {
            var declaration_selected:Declaration = null,
                declaration:Declaration,
                max:number,
                i:number;

            if (!line.trim()) {
                return;
            }

            for (i = 0, max = StructCompiler.declarations.length; i < max; i++) {
                declaration = StructCompiler.declarations[i];
                if (declaration.pattern.test(line)) {
                    declaration_selected = declaration;
                    break;
                }
            }

            if (declaration_selected) {
                this.tree.upTo(StructCompiler.parseLevel(line));
                if (declaration_selected.type === TYPES.ATTRIBUTE) {
                    var info:ItemData = this.tree.get().getInfo();
                    if (!info.attributes) {
                        info.attributes = [];
                    }
                    info.attributes.push(declaration_selected.parser(line, index));
                } else {
                    this.tree.add(declaration_selected.parser(line, index));
                }
            } else {
                throw new Error('Unnable to parse code at line: ' + index + ':' + line);
            }
        });
    }

    public getSourceStrings():string[] {
        return this.source_strings;
    }

    public static parseLevel(str:string):number {
        var matches = str.match(/^(\s*)/),
            space_length = matches ? matches[1] && matches[1].length : 0,
            delta = space_length % 4,
            count = Math.floor(space_length / 4);

        return delta ? count + 1 : count;
    }

    public static parseBlockDeclaration(line:string, index:number):ItemData {
        return StructCompiler.parseDeclaration(
            line,
            /^\s*b\:\s*([^>^\*\s]+)(:?\s*>\s*([^\*\s]+))?\s*(:?\s*\*\s*(\d+))?\s*$/,
            TYPES.BLOCK,
            StructCompiler.Errors.BLOCK_DECLARATION_SYNTAX_ERROR,
            index
        );
    }

    public static parseElementDeclaration(line:string, index:number):ItemData {
        return StructCompiler.parseDeclaration(
            line,
            /^\s*e\:\s*([^>^\*\s]+)?(:?\s*>\s*([^\*\s]+))?\s*(:?\s*\*\s*(\d+))?\s*$/,
            TYPES.ELEMENT,
            StructCompiler.Errors.ELEMENT_DECLARATION_SYNTAX_ERROR,
            index
        );
    }

    public static parsePlaceholderDeclaration(line:string, index:number):ItemData {
        return StructCompiler.parseDeclaration(
            line,
            /^\s*p\:\s*(\S+)?\s*$/,
            TYPES.PLACEHOLDER,
            StructCompiler.Errors.PLACEHOLDER_DECLARATION_SYNTAX_ERROR,
            index
        );
    }

    public static parseAttributeDeclaration(line:string, index:number):Attribute {
        var matches:string[] = line.match(/^\s*(\S+)\s*\:\s*(\S+)\s*$/);

        if (matches) {
            return {
                name: matches[1],
                value: matches[2]
            };
        } else {
            throw StructCompiler.createError(
                StructCompiler.Errors.ATTRIBUTE_DECLARATION_SYNTAX_ERROR,
                line,
                index
            );
        }
    }

    public static parseDeclaration(line:string, pattern:RegExp, item_type:string, error_message:string, index):ItemData {
        var matches = line.match(pattern),
            item_data:ItemData = null;

        if (matches) {
            item_data = {
                type: item_type,
                name: matches[1] || null,
                tag: matches[3] || null
            };

            matches[5] && (item_data.count = parseInt(matches[5]));
        } else {
            throw StructCompiler.createError(
                error_message,
                line,
                index
            );
        }

        return item_data;
    }

    private static createError(message:string, line:string, line_number:number) {
        return new Error(message + ' at line:' + line_number + ':' + line);
    }

    private source_strings:string[] = [];
    private tree:Tree<ItemData> = new Tree<ItemData>();
    private static declarations:Declaration[] = [
        {
            type: TYPES.BLOCK,
            pattern: /^(:?\s)*b\:.+$/,
            parser: StructCompiler.parseBlockDeclaration
        },
        {
            type: TYPES.ELEMENT,
            pattern: /^(:?\s)*e\:.*$/,
            parser: StructCompiler.parseElementDeclaration
        },
        {
            type: TYPES.PLACEHOLDER,
            pattern: /^(:?\s)*p\:.+$/,
            parser: StructCompiler.parsePlaceholderDeclaration
        },
        {
            type: TYPES.ATTRIBUTE,
            pattern: /^\s*(\S+)\s*\:\s*(\S+)\s*$/,
            parser: StructCompiler.parseAttributeDeclaration
        }
    ];
}
