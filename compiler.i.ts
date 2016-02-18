/**
 * Copyright (c) 2016 Ivan Bausov <ivan.bausov@gmail.com> (MIT Licensed)
 * A part of B:STRUCT package <https://github.com/ivan-bausov/bstruct>
 */

export interface ICompiler<TOutput> {
    compile():TOutput;
}

export interface ItemData {
    type:string;
    name:string;
    tag:string;
    attributes?: Attribute[];
    count?: number;
}

export interface Attribute {
    name: string;
    value: string;
}

export interface Serialized<T> {
    data: T;
    children: Serialized<T>[];
}

export interface IItem<T> {
    getParent():IItem<T>;
    getChildren():IItem<T>[];
    addChild(item_data:T):IItem<T>;
    getInfo():T;
}

