/**
 * Copyright (c) 2016 Ivan Bausov <ivan.bausov@gmail.com> (MIT Licensed)
 * A part of B:STRUCT package <https://github.com/ivan-bausov/bstruct>
 */
import _ = require('underscore');
import {
    IItem as ILeaf,
    Serialized
} from './compiler.i';

class Item<T> implements ILeaf<T>{
    constructor(private parent: Item<T>, private data:T) {
    }

    public getParent():Item<T>{
        return this.parent;
    }

    public getInfo():T{
        return this.data;
    }

    public getChildren():Item<T>[]{
        return this.childs;
    }

    public addChild(item_data:T):Item<T>{
        var child:Item<T> = new Item<T>(this, item_data);
        this.childs.push(child);
        return child;
    }

    public serialize(): Serialized<T>{
        return {
            data: this.getInfo(),
            children: _.map(this.getChildren(), (item:Item<T>) => {
                return item.serialize();
            })
        };
    }

    private childs:Item<T>[] = [];
}

export default class Tree<T> {
    constructor() {
        this.current_leaf = this.root;
    }

    public add(leaf_data:T):void{
        this.current_leaf = this.current_leaf.addChild(leaf_data);
    }

    public get():ILeaf<T>{
        return this.current_leaf;
    }

    public up():void {
        this.current_leaf = this.current_leaf.getParent() || this.current_leaf;
    }

    public upTo(level:number):void {
        while(this.level() > level) {
            this.up();
        }
    }

    public level():number {
        var level:number = 0,
            item:Item<T> = this.current_leaf;

        while(item = item.getParent()){
            level++
        }

        return level;
    }

    public serialize(): Serialized<T>{
        return this.root.serialize();
    }

    private current_leaf: Item<T>;
    private root: Item<T> = new Item<T>(null, null);
}