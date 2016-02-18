/**
 * Copyright (c) 2016 Ivan Bausov <ivan.bausov@gmail.com> (MIT Licensed)
 * A part of B:STRUCT package <https://github.com/ivan-bausov/bstruct>
 */

import _ = require('underscore');
import {ItemData, Serialized} from './compiler.i';
import {TYPES} from './compiler.e';
import StructCompiler from './struct_compiler.t';
import ScssCompiler from './scss_compiler.t';
import HtmlCompiler from './html_compiler.t';

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

export default class Compiler {

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
