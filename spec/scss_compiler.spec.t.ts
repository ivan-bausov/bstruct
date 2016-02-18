/**
 * Created by Ivan on 18/07/15.
 */
/// <reference path="../definitions/jasmine.d.ts" />
/// <reference path="../definitions/node-0.10.d.ts" />

import fs = require('fs');
import {
    ItemData,
    Serialized
} from '../compiler.i';
import {TYPES} from '../compiler.e';
import Compiler from '../scss_compiler.t';

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

    test({
        description: 'element',
        source: {
            data: {
                name: null,
                type: TYPES.ELEMENT,
                tag: null
            },
            children: []
        },
        result: '& > div {\n\n}'
    });

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
                        tag: 'a'
                    },
                    children: []
                }
            ]
        },
        result: '.block-header {\n  a.header_logo {\n\n  }\n}'
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

    test({
        description: 'placeholder',
        source: {
            data: {
                name: 'header',
                type: TYPES.BLOCK,
                tag: null
            },
            children: [
                {
                    data: {
                        name: 'placeholder',
                        type: TYPES.PLACEHOLDER,
                        tag: null
                    },
                    children: [
                        {
                            data: {
                                name: 'test',
                                type: TYPES.ELEMENT,
                                tag: null
                            },
                            children: [
                                {
                                    data: {
                                        name: 'test',
                                        type: TYPES.PLACEHOLDER,
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
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        result: '.block-header {\n' +
        '  .header_test {\n' +
        '    .header_logo {\n' +
        '\n' +
        '    }\n' +
        '  }\n' +
        '}'
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

