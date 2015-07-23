/**
 * Created by Ivan on 18/07/15.
 */
/// <reference path="../definitions/jasmine.d.ts" />
/// <reference path="../definitions/node-0.10.d.ts" />

import fs = require('fs');
import interfaces = require('../compiler.i');
import enums = require('../compiler.e');
import Compiler = require('../scss_compiler.t');
import Helpers = require('./helpers.t');

import ItemData = interfaces.ItemData;
import IItem = interfaces.IItem;
import Serialized = interfaces.Serialized;
import TYPES = enums.TYPES;

var readContent = Helpers.readContent;

describe('ScssCompiler', () => {

    test({
        description: 'root',
        source: {
            data: null,
            children: []
        },
        result: ''
    });

    test({
        description: 'block element with empty tag renders into div',
        source: {
            data: {
                name: 'test',
                type: TYPES.BLOCK,
                tag: null
            },
            children: []
        },
        result: '.block-test {\n\n}'
    });

    test({
        description: 'custom block',
        source: {
            data: {
                name: 'test',
                type: TYPES.BLOCK,
                tag: 'custom'
            },
            children: []
        },
        result: '.block-test {\n\n}'
    });

    //#TODO: this case must throw an exception?
    //test({
    //    description: 'element',
    //    source: {
    //        data: {
    //            name: null,
    //            type: TYPES.ELEMENT,
    //            tag: null
    //        },
    //        children: []
    //    },
    //    result: ''
    //});

    test({
        description: 'custom element',
        source: {
            data: {
                name: null,
                type: TYPES.ELEMENT,
                tag: 'custom'
            },
            children: []
        },
        result: '& > custom {\n\n}'
    });

    test({
        description: 'named A element',
        source: {
            data: {
                name: 'test',
                type: TYPES.ELEMENT,
                tag: 'a'
            },
            children: []
        },
        result: 'a.test {\n\n}'
    });

    test({
        description: 'named element',
        source: {
            data: {
                name: 'test',
                type: TYPES.ELEMENT,
                tag: null
            },
            children: []
        },
        result: '.test {\n\n}'
    });

    test({
        description: 'element inside block',
        source: {
            data: {
                name: 'header',
                type: TYPES.BLOCK,
                tag: null
            },
            children: [
                {
                    data: {
                        name: null,
                        type: TYPES.ELEMENT,
                        tag: null
                    },
                    children: []
                }
            ]
        },
        result: '.block-header {\n  & > div {\n\n  }\n}'
    });

    test({
        description: 'named element inside block',
        source: {
            data: {
                name: 'header',
                type: TYPES.BLOCK,
                tag: null
            },
            children: [
                {
                    data: {
                        name: 'logo',
                        type: TYPES.ELEMENT,
                        tag: null
                    },
                    children: []
                }
            ]
        },
        result: '.block-header {\n  .header_logo {\n\n  }\n}'
    });

    test({
        description: 'block inside block',
        source: {
            data: {
                name: 'header',
                type: TYPES.BLOCK,
                tag: null
            },
            children: [
                {
                    data: {
                        name: 'logo',
                        type: TYPES.BLOCK,
                        tag: null
                    },
                    children: []
                }
            ]
        },
        result: '.block-header {\n  .block-logo {\n\n  }\n}'
    });

    test({
        description: 'element inside block inside block',
        source: {
            data: {
                name: 'header',
                type: TYPES.BLOCK,
                tag: null
            },
            children: [
                {
                    data: {
                        name: 'logo',
                        type: TYPES.BLOCK,
                        tag: null
                    },
                    children: [
                        {
                            data: {
                                name: 'test',
                                type: TYPES.ELEMENT,
                                tag: null
                            },
                            children: []
                        }
                    ]
                }
            ]
        },
        result:
        '.block-header {\n' +
        '  .block-logo {\n'+
        '    .logo_test {\n' +
        '\n' +
        '    }\n' +
        '  }\n' +
        '}'
    });

    test({
        description: 'items inside root',
        source: {
            data: null,
            children: [
                {
                    data: {
                        name: 'test',
                        type: TYPES.ELEMENT,
                        tag: null
                    },
                    children: []
                },
                {
                    data: {
                        name: 'test',
                        type: TYPES.BLOCK,
                        tag: null
                    },
                    children: []
                }
            ]
        },
        result: '.test {\n\n}\n\n.block-test {\n\n}'
    });

    function test(options:{
        source:Serialized<ItemData>;
        description: string;
        result:string;
    }) {
        it(options.description, () => {
            var compiler = new Compiler(options.source);
            expect(compiler.compile()).toBe(options.result);
        });
    }
});

