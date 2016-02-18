/**
 * Created by Ivan on 15/07/15.
 */

import fs = require('fs');

export function readContent(path:string) {
    return fs.readFileSync(__dirname + path, {
        encoding: 'utf8'
    });
}
