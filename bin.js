#!/usr/bin/env node
/**
 * Created by Ivan on 20/07/15.
 */
var _ = require('underscore'),
    fs = require('fs'),
    Compiler = require('../compiler.t.js');

function readContent(path) {
    return fs.readFileSync(path, {
        encoding: 'utf8'
    });
}

var queue = [],
    process_in_progress = false,
    current_folder_path = process.cwd() + '/',
    target_file;

function processQueue() {
    if(process_in_progress) {
        return;
    }

    var compilation_process = queue.shift();
    if(compilation_process) {
        process_in_progress = true;

        var content = readContent(current_folder_path + target_file),
            compiler,
            name,
            html,
            scss;

        try {
            compiler = new Compiler(content);

            if (process.argv[4] === "--blocks") {

                try {
                    rmdir(current_folder_path + 'templates/');
                    rmdir(current_folder_path + 'scss/');
                } catch (e) {
                    console.log(e);
                }

                try {
                    fs.mkdirSync(current_folder_path + 'templates/');
                    fs.mkdirSync(current_folder_path + 'scss/');
                } catch (e) {
                    console.log(e);
                }

                var blocks = compiler.getBlocks();

                _.each(blocks, function (block) {
                    html = block.getHTML();
                    scss = block.getSCSS();
                    name = block.getName();

                    fs.writeFileSync(current_folder_path + 'templates/' + name + '.mustache', html);
                    fs.writeFileSync(current_folder_path + 'scss/_' + name + '.scss', scss);

                    console.log('Change processed:');
                    console.log('Files written:');
                    console.log('\t' + current_folder_path + 'templates/' + name + '.mustache');
                    console.log('\t' + current_folder_path + 'templates/' + name + '.scss');
                })
            } else {
                html = compiler.getHTML();
                scss = compiler.getSCSS();

                fs.writeFileSync(current_folder_path + target_file.replace(/\.bstruct$/, '.html'), html);
                fs.writeFileSync(current_folder_path + target_file.replace(/\.bstruct$/, '.scss'), scss);

                console.log('Change processed:');
                console.log('Files written:');
                console.log('\t' + current_folder_path + target_file.replace(/\.bstruct$/, '.html'));
                console.log('\t' + current_folder_path + target_file.replace(/\.bstruct$/, '.scss'));
            }

        } catch (e) {
            console.log(e);
        }

        process_in_progress = false;
        processQueue();
    }
}

if (process.argv[2] === '--watch') {
    if (!process.argv[3]) {
        throw Error('Expect you to define source file to watch.');
    } else {
        target_file = process.argv[3];

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

