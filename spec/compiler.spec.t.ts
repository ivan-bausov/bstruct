/**
 * Created by Ivan on 15/07/15.
 */

import fs = require('fs');
import Compiler from '../compiler.t';
import {readContent} from './helpers.t';

describe('compiler.getHTML', () => {
    it('compiler.getHTML', () => {
        var compiler = new Compiler(readContent('/sources/html_compiler.compile.ctdl')),
            result = readContent('/sources/html_compiler.compile.result.html');

        expect(compiler.getHTML()).toBe(result);
    });

    it('compiler.getHTML', () => {
        var compiler = new Compiler(readContent('/sources/attributes_support.ctdl')),
            result = readContent('/sources/attributes_support.result.html');

        expect(compiler.getHTML()).toBe(result);
    });
});

describe('compiler.getSCSS', () => {

    it('compiler.getSCSS', () => {
        var compiler = new Compiler(readContent('/sources/scss_compiler.compile.ctdl')),
            result = readContent('/sources/scss_compiler.compile.result.scss');

        expect(compiler.getSCSS()).toBe(result);
    });

});

describe('compiler.getBlocks', () => {

    it('compiler.getBlocks', () => {
        var compiler = new Compiler(
                'b:header\n' +
                'b:page\n' +
                'e:test\n' +
                'b:footer\n'
            ),
            result = compiler.getBlocks();

        expect(result.length).toBe(3);
        expect(result[2].getName()).toBe('block-footer');
        expect(result[2].getSCSS()).toBe(
            '.block-footer {\n' +
            '\n' +
            '}'
        );
        expect(result[2].getHTML()).toBe('<div class="block-footer"></div>');
    });

});

