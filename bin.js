#!/usr/bin/env node
/**
 * Created by Ivan on 20/07/15.
 */
var fs = require('fs'),
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
            html,
            scss;

        try {
            compiler = new Compiler(content);
            html = compiler.getHTML();
            scss = compiler.getSCSS();

            fs.writeFileSync(current_folder_path + target_file.replace(/\.ctdl$/, '.html'), html);
            fs.writeFileSync(current_folder_path + target_file.replace(/\.ctdl$/, '.scss'), scss);

            console.log('Change processed:');
            console.log('Files written:');
            console.log('\t' + current_folder_path + target_file.replace(/\.ctdl$/, '.html'));
            console.log('\t' + current_folder_path + target_file.replace(/\.ctdl$/, '.scss'));

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

