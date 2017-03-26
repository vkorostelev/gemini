'use strict';

const fs = require('fs-extra');
const path = require('path');

exports.copyImg = (currPath, refPath) => fs.copyAsync(currPath, refPath)
    .thenReturn(true)
    .catchReturn(false);

exports.saveRef = (refPath, capture) => {
    return fs.mkdirsAsync(path.dirname(refPath))
        .then(() => capture.image.save(refPath))
        .thenReturn(true)
        .catchReturn(false);
};

exports.existsRef = (refPath) => fs.accessAsync(refPath)
    .thenReturn(true)
    .catchReturn(false);
