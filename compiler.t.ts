/**
 * Copyright (c) 2016 Ivan Bausov <ivan.bausov@gmail.com> (MIT Licensed)
 * A part of B:STRUCT package <https://github.com/ivan-bausov/bstruct>
 */

/// <reference path="./definitions/node-0.10.d.ts" />
/// <reference path="./definitions/node-0.10.d.ts" />
/// <reference path="./definitions/underscore.d.ts" />

import _ = require('underscore');
import interfaces = require('./compiler.i');
import enums = require('./compiler.e');
import StructCompiler = require('./struct_compiler.t');
import ScssCompiler = require('./scss_compiler.t');
import HtmlCompiler = require('./html_compiler.t');

import ItemData = interfaces.ItemData;
import Serialized = interfaces.Serialized;
import TYPES = enums.TYPES;

class Block {
    constructor(private source_object: Serialized<ItemData>) {
    }

    public getSCSS():string {
        return new ScssCompiler(this.source_object).compile();
    }

    public getHTML():string {
        return new HtmlCompiler(this.source_object).compile();
    }

    public getName():string {
        return 'block-' + this.source_object.data.name;
    }
}

class Compiler {

    static ITEM_TYPE = TYPES;

    constructor(private source_code:string) {
        this.source_object = new StructCompiler(source_code).compile();
    }

    public getSCSS():string {
        return new ScssCompiler(this.source_object).compile();
    }

    public getHTML():string {
        return new HtmlCompiler(this.source_object).compile();
    }

    public getBlocks():Block[] {
        return _.compact(_.map(this.source_object.children, (item:Serialized<ItemData>) => {
            if(item.data.type === TYPES.BLOCK) {
                return new Block(item);
            } else {
                return null;
            }
        }));
    }

    private source_object: Serialized<ItemData>;
}

export = Compiler;
