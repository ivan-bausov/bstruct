#!/usr/bin/env node
/**
 * Copyright (c) 2016 Ivan Bausov <ivan.bausov@gmail.com> (MIT Licensed)
 * A part of B:STRUCT package <https://github.com/ivan-bausov/bstruct>
 */
var _ = require('underscore'),
    fs = require('fs'),
    Compiler = require('../compiler.t.js');

var queue = [],
    process_in_progress = false,
    current_folder_path = process.cwd() + '/',
    target_file,
    target_name,
    mustache_templates_path,
    scss_templates_path;

if (process.argv[2] === '--watch') {
    if (!process.argv[3]) {
        throw Error('Expect you to define source file to watch.');
    } else {
        target_file = process.argv[3];
        target_name = target_file.replace(/\.bstruct$/, '');
        mustache_templates_path = current_folder_path + 'templates/';
        scss_templates_path = current_folder_path + 'scss/';

        console.log('This script will poll for changes: ' + current_folder_path + target_file + '. Press Ctrl+C to exit polling.');

        fs.watchFile(current_folder_path + target_file, {
            interval: 2000
        }, function () {
            console.log('\n\nChange detected on ' + current_folder_path + target_file);
            queue.push({});
            processQueue();
        });

        queue.push({});
        processQueue();
    }
}

function processQueue() {
    if(process_in_progress) {
        return;
    }

    var compilation_process = queue.shift();
    if(compilation_process) {
        process_in_progress = true;

        var content = readContent(current_folder_path + target_file),
            current_mustache_templates_path,
            current_scss_templates_path,
            compiler,
            name,
            html,
            scss;

        try {
            compiler = new Compiler(content);

            if (process.argv[4] === "--blocks") {

                current_mustache_templates_path = mustache_templates_path + target_name + '/';
                current_scss_templates_path = scss_templates_path + target_name + '/';

                try {
                    rmdir(current_mustache_templates_path);
                    rmdir(current_scss_templates_path);
                } catch (e) {
                    console.log(e);
                }

                try {
                    fs.mkdirSync(mustache_templates_path);
                    fs.mkdirSync(scss_templates_path);
                } catch (e) {
                    console.log(e);
                }

                try {
                    fs.mkdirSync(current_mustache_templates_path);
                    fs.mkdirSync(current_scss_templates_path);
                } catch (e) {
                    console.log(e);
                }

                var blocks = compiler.getBlocks();

                _.each(blocks, function (block) {
                    html = block.getHTML();
                    scss = block.getSCSS();
                    name = block.getName();

                    fs.writeFileSync(current_mustache_templates_path + name + '.mustache', html);
                    fs.writeFileSync(current_scss_templates_path + '_' + name + '.scss', scss);

                    console.log('Change processed:');
                    console.log('Files written:');
                    console.log('\t' + current_mustache_templates_path + name + '.mustache');
                    console.log('\t' + current_scss_templates_path + '_' + name + '.scss');
                })
            } else {
                html = compiler.getHTML();
                scss = compiler.getSCSS();

                fs.writeFileSync(current_folder_path + target_name + '.html', html);
                fs.writeFileSync(current_folder_path + target_name + '.scss', scss);

                console.log('Change processed:');
                console.log('Files written:');
                console.log('\t' + current_folder_path + target_name + '.html');
                console.log('\t' + current_folder_path + target_name + '.scss');
            }

        } catch (e) {
            console.log(e);
        }

        process_in_progress = false;
        processQueue();
    }
}

function readContent(path) {
    return fs.readFileSync(path, {
        encoding: 'utf8'
    });
}

function rmdir (path) {
    var files = [];
    if (fs.existsSync(path)) {
        files = fs.readdirSync(path);
        files.forEach(function (file) {
            fs.unlinkSync(path + "/" + file);
        });
        fs.rmdirSync(path);
    }
};

