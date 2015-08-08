/**
 * Created by Ivan on 17/07/15.
 */
/// <reference path="../definitions/jasmine.d.ts" />
/// <reference path="../definitions/node-0.10.d.ts" />

import fs = require('fs');
import interfaces = require('../compiler.i');
import Compiler = require('../struct_compiler.t');
import enums = require('../compiler.e');
import Helpers = require('./helpers.t');

import ItemData = interfaces.ItemData;
import IItem = interfaces.IItem;
import TYPES = enums.TYPES;

var readContent = Helpers.readContent;

describe('struct_compiler.getSourceStrings', () => {

    it('struct_compiler.getSourceStrings', () => {
        var compiler = new Compiler(readContent('/sources/struct_compiler.getSourceStrings.ctdl'));
        expect(compiler.getSourceStrings().length).toBe(2);
    });

});

describe('struct_compiler.compile', () => {

    it('struct_compiler.compile', () => {

        var compiler = new Compiler(readContent('/sources/struct_compiler.getSourceObject-01.ctdl'));

        expect(compiler.compile()).toEqual({
            data: null,
            children: [
                {
                    data: {
                        type: TYPES.BLOCK,
                        name: 'header',
                        tag: 'div'
                    },
                    children: [
                        {
                            data: {
                                type: TYPES.ELEMENT,
                                name: 'logo',
                                tag: 'img'
                            },
                            children: []
                        },
                        {
                            data: {
                                type: TYPES.ELEMENT,
                                name: null,
                                tag: 'a'
                            },
                            children: []
                        },
                        {
                            data: {
                                type: TYPES.ELEMENT,
                                name: 'info',
                                tag: null
                            },
                            children: [
                                {
                                    data: {
                                        type: TYPES.ELEMENT,
                                        name: 'cart',
                                        tag: 'a'
                                    },
                                    children: []
                                },
                                {
                                    data: {
                                        type: TYPES.ELEMENT,
                                        name: 'login',
                                        tag: 'a'
                                    },
                                    children: []
                                },
                            ]
                        },
                        {
                            data: {
                                type: TYPES.ELEMENT,
                                name: 'description',
                                tag: null
                            },
                            children: []
                        },
                    ]
                },
                {
                    data: {
                        type: TYPES.BLOCK,
                        name: 'footer',
                        tag: null
                    },
                    children: [
                        {
                            data: {
                                type: TYPES.ELEMENT,
                                name: 'copyright',
                                tag: null
                            },
                            children: []
                        }
                    ]
                }
            ]
        });

    });

    it('attributes_support', () => {
        var compiler = new Compiler(readContent('/sources/attributes_support.ctdl'));

        expect(compiler.compile()).toEqual({
            data: null,
            children: [
                {
                    data: {
                        name: 'test',
                        type: TYPES.BLOCK,
                        tag: null,
                        attributes: [
                            {
                                name: 'id',
                                value: 'main'
                            }
                        ]
                    },
                    children: [
                        {
                            data: {
                                name: 'test',
                                type: TYPES.ELEMENT,
                                tag: 'img',
                                attributes: [
                                    {
                                        name: 'id',
                                        value: 'test_id'
                                    },
                                    {
                                        name: 'width',
                                        value: '300'
                                    }
                                ]
                            },
                            children: []
                        },
                        {
                            data: {
                                name: 'test',
                                type: TYPES.ELEMENT,
                                tag: 'img'
                            },
                            children: []
                        }
                    ]
                }
            ]
        });

    });

});

describe('StructCompiler.parseBlockDeclaration', () => {

    test({
        source: 'b:test',
        result: {
            type: TYPES.BLOCK,
            name: 'test',
            tag: null
        }
    });

    test({
        source: 'b:test>a',
        result: {
            type: TYPES.BLOCK,
            name: 'test',
            tag: 'a'
        }
    });

    test({
        source: '  b:   test  > a  ',
        result: {
            type: TYPES.BLOCK,
            name: 'test',
            tag: 'a'
        }
    });

    test({
        source: 'b:test*5',
        result: {
            type: TYPES.BLOCK,
            name: 'test',
            tag: null,
            count: 5
        }
    });

    test({
        source: 'b:test>a*5',
        result: {
            type: TYPES.BLOCK,
            name: 'test',
            tag: 'a',
            count: 5
        }
    });

    test({
        source: 'b:   test > a   *  5',
        result: {
            type: TYPES.BLOCK,
            name: 'test',
            tag: 'a',
            count: 5
        }
    });

    testError({
        source: 'b>test:a',
        line_number: 5,
        error: Compiler.Errors.BLOCK_DECLARATION_SYNTAX_ERROR
    });

    testError({
        source: 'b:',
        line_number: 7,
        error: Compiler.Errors.BLOCK_DECLARATION_SYNTAX_ERROR
    });

    testError({
        source: 'b:>a',
        line_number: 5,
        error: Compiler.Errors.BLOCK_DECLARATION_SYNTAX_ERROR
    });

    function test(options:{
        source:string;
        result: ItemData;
    }) {
        it(options.source, () => {
            var parse_result:ItemData = Compiler.parseBlockDeclaration(options.source, 4);
            expect(parse_result).toEqual(options.result);
        });
    }

    function testError(options:{
        source:string;
        error: string;
        line_number: number;
    }) {
        it(options.source, () => {
            expect(() => Compiler.parseBlockDeclaration(options.source, options.line_number)).toThrowError(options.error + ' at line:' + options.line_number + ':' + options.source);
        });
    }
});

describe('struct_compiler.parseElementDeclaration', () => {

    test({
        source: 'e:',
        result: {
            type: TYPES.ELEMENT,
            name: null,
            tag: null
        }
    });

    test({
        source: 'e:test',
        result: {
            type: TYPES.ELEMENT,
            name: 'test',
            tag: null
        }
    });

    test({
        source: 'e:test>a',
        result: {
            type: TYPES.ELEMENT,
            name: 'test',
            tag: 'a'
        }
    });

    test({
        source: 'e:>a',
        result: {
            type: TYPES.ELEMENT,
            name: null,
            tag: 'a'
        }
    });

    test({
        source: '  e:   test  > a  ',
        result: {
            type: TYPES.ELEMENT,
            name: 'test',
            tag: 'a'
        }
    });

    test({
        source: 'e:*5',
        result: {
            type: TYPES.ELEMENT,
            name: null,
            tag: null,
            count: 5
        }
    });

    test({
        source: 'e:test*5',
        result: {
            type: TYPES.ELEMENT,
            name: 'test',
            tag: null,
            count: 5
        }
    });

    test({
        source: 'e:test>a*5',
        result: {
            type: TYPES.ELEMENT,
            name: 'test',
            tag: 'a',
            count: 5
        }
    });

    test({
        source: 'e:>a*5',
        result: {
            type: TYPES.ELEMENT,
            name: null,
            tag: 'a',
            count: 5
        }
    });

    test({
        source: 'e:   test > a   *  5',
        result: {
            type: TYPES.ELEMENT,
            name: 'test',
            tag: 'a',
            count: 5
        }
    });

    testError({
        source: 'e>test:a',
        line_number: 5,
        error: Compiler.Errors.ELEMENT_DECLARATION_SYNTAX_ERROR
    });

    function test(options:{
        source:string;
        result: ItemData;
    }) {
        it(options.source, () => {
            var parse_result:ItemData = Compiler.parseElementDeclaration(options.source, 4);
            expect(parse_result).toEqual(options.result);
        });
    }

    function testError(options:{
        source:string;
        error: string;
        line_number: number;
    }) {
        it(options.source, () => {
            expect(() => Compiler.parseElementDeclaration(options.source, options.line_number)).toThrowError(options.error + ' at line:' + options.line_number + ':' + options.source);
        });
    }
});

describe('Compiler.parseLevel', () => {
    it('0', () => test('3', 0));
    it('1', () => test(' 3', 1));
    it('2', () => test('  3', 1));
    it('3', () => test('   3', 1));
    it('4', () => test('    4', 1));
    it('5', () => test('     4', 2));
    it('6', () => test('      4', 2));
    it('7', () => test('       4', 2));
    it('8', () => test('        3', 2));

    function test(str:string, level:number) {
        expect(Compiler.parseLevel(str)).toBe(level);
    }
});

describe('Placeholder support', () => {

    test({
        source: 'p:test',
        result: {
            type: TYPES.PLACEHOLDER,
            name: 'test',
            tag: null
        }
    });

    function test(options:{
        source:string;
        result: ItemData;
    }) {
        it(options.source, () => {
            var parse_result:ItemData = Compiler.parsePlaceholderDeclaration(options.source, 4);
            expect(parse_result).toEqual(options.result);
        });
    }
});

