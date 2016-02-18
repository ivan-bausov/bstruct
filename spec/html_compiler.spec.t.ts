/**
 * Created by Ivan on 18/07/15.
 */

import fs = require('fs');
import {
    ItemData,
    Serialized
} from '../compiler.i';
import {TYPES} from '../compiler.e';
import Compiler from '../html_compiler.t';

describe('HtmlCompiler', () => {

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
        result: '<div class="block-test"></div>'
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
        result: '<custom class="block-test"></custom>'
    });

    test({
        description: 'A block',
        source: {
            data: {
                name: 'test',
                type: TYPES.BLOCK,
                tag: 'a'
            },
            children: []
        },
        result: '<a class="block-test" href="#" title=""></a>'
    });

    test({
        description: 'img block',
        source: {
            data: {
                name: 'test',
                type: TYPES.BLOCK,
                tag: 'img'
            },
            children: []
        },
        result: '<img class="block-test" src="" alt=""/>'
    });

    //#TODO: this case must throw an exception?
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
        result: '<div></div>'
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
        result: '<custom></custom>'
    });

    test({
        description: 'A element',
        source: {
            data: {
                name: null,
                type: TYPES.ELEMENT,
                tag: 'a'
            },
            children: []
        },
        result: '<a href="#" title=""></a>'
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
        result: '<a class="test" href="#" title=""></a>'
    });

    test({
        description: 'img element',
        source: {
            data: {
                name: null,
                type: TYPES.ELEMENT,
                tag: 'img'
            },
            children: []
        },
        result: '<img src="" alt=""/>'
    });

    test({
        description: 'named img element',
        source: {
            data: {
                name: 'test',
                type: TYPES.ELEMENT,
                tag: 'img'
            },
            children: []
        },
        result: '<img class="test" src="" alt=""/>'
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
        result: '<div class="test"></div>'
    });

    test({
        description: 'attributes',
        source: {
            data: {
                name: 'test',
                type: TYPES.ELEMENT,
                tag: null,
                attributes: [
                    {
                        name: 'width',
                        value: '100'
                    },
                    {
                        name: 'id',
                        value: 'test'
                    }
                ]
            },
            children: []
        },
        result: '<div class="test" width="100" id="test"></div>'
    });

    test({
        description: 'A: attributes',
        source: {
            data: {
                name: 'test',
                type: TYPES.ELEMENT,
                tag: 'a',
                attributes: [
                    {
                        name: 'width',
                        value: '100'
                    },
                    {
                        name: 'id',
                        value: 'test'
                    }
                ]
            },
            children: []
        },
        result: '<a class="test" href="#" title="" width="100" id="test"></a>'
    });

    test({
        description: 'A: attributes',
        source: {
            data: {
                name: 'test',
                type: TYPES.ELEMENT,
                tag: 'a',
                attributes: [
                    {
                        name: 'class',
                        value: 'button'
                    },
                    {
                        name: 'href',
                        value: 'http://bstruct.org/'
                    },
                    {
                        name: 'title',
                        value: 'how attributes work'
                    }
                ]
            },
            children: []
        },
        result: '<a class="test button" href="http://bstruct.org/" title="how attributes work"></a>'
    });

    test({
        description: 'IMG: attributes',
        source: {
            data: {
                name: 'test',
                type: TYPES.ELEMENT,
                tag: 'img',
                attributes: [
                    {
                        name: 'width',
                        value: '100'
                    },
                    {
                        name: 'id',
                        value: 'test'
                    }
                ]
            },
            children: []
        },
        result: '<img class="test" src="" alt="" width="100" id="test"/>'
    });

    test({
        description: 'IMG: attributes',
        source: {
            data: {
                name: 'test',
                type: TYPES.ELEMENT,
                tag: 'img',
                attributes: [
                    {
                        name: 'src',
                        value: '{{src}}'
                    },
                    {
                        name: 'alt',
                        value: '{{alt}}'
                    }
                ]
            },
            children: []
        },
        result: '<img class="test" src="{{src}}" alt="{{alt}}"/>'
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
        result: '<div class="block-header">\n' + '    <div></div>\n' + '</div>'
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
        result: '<div class="block-header">\n' + '    <div class="header_logo"></div>\n' + '</div>'
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
        result: '<div class="block-header">\n' + '    <div class="block-logo"></div>\n' + '</div>'
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
        result: '<div class="block-header">\n'
        + '    <div class="block-logo">\n'
        + '        <div class="logo_test"></div>\n'
        + '    </div>\n'
        + '</div>'
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
        result: '<div class="test"></div>\n' +
        '<div class="block-test"></div>'
    });

    test({
        description: 'count',
        source: {
            data: null,
            children: [
                {
                    data: {
                        name: 'test',
                        type: TYPES.BLOCK,
                        tag: null
                    },
                    children: [
                        {
                            data: {
                                name: 'item',
                                type: TYPES.BLOCK,
                                tag: null,
                                count: 2
                            },
                            children: [
                                {
                                    data: {
                                        name: 'name',
                                        type: TYPES.ELEMENT,
                                        tag: null
                                    },
                                    children: [
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        result:
        '<div class="block-test">\n' +
        '    <div class="block-item">\n' +
        '        <div class="item_name"></div>\n' +
        '    </div>\n' +
        '    <div class="block-item">\n' +
        '        <div class="item_name"></div>\n' +
        '    </div>\n' +
        '</div>'
    });

    test({
        description: 'placeholder',
        source: {
            data: null,
            children: [
                {
                    data: {
                        name: 'menu',
                        type: TYPES.BLOCK,
                        tag: null
                    },
                    children: [
                        {
                            data: {
                                name: 'tabs',
                                type: TYPES.PLACEHOLDER,
                                tag: null
                            },
                            children: [
                                {
                                    data: {
                                        name: 'tab',
                                        type: TYPES.BLOCK,
                                        tag: null
                                    },
                                    children: [
                                        {
                                            data: {
                                                name: 'tab',
                                                type: TYPES.PLACEHOLDER,
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
        result: '<div class="block-menu">\n' +
        '    {{#tabs}}\n' +
        '        <div class="block-tab">\n' +
        '            {{tab}}\n' +
        '        </div>\n' +
        '    {{/tabs}}\n' +
        '</div>'
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

