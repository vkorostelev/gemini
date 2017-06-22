'use strict';

const CaptureProcessor = require('./');
const utils = require('./utils');

const notUpdated = (referencePath) => ({imagePath: referencePath, updated: false});

const saveRef = (referencePath, capture) => {
    return utils.saveRef(referencePath, capture)
        .then((updated) => ({imagePath: referencePath, updated}));
};

const updateRef = (referencePath, currentPath) => {
    return utils.copyImg(currentPath, referencePath)
        .then((updated) => ({imagePath: referencePath, updated}));
};

exports.create = (type) => {
    if (type === 'tester') {
        return CaptureProcessor.create()
            .onEqual((referencePath, currentPath) => ({referencePath, currentPath, equal: true}))
            .onDiff((referencePath, currentPath) => ({referencePath, currentPath, equal: false}));
    }

    if (type === 'new-updater') {
        return CaptureProcessor.create()
            .onReference(notUpdated)
            .onNoReference(saveRef);
    }

    if (type === 'diff-updater') {
        return CaptureProcessor.create()
            .onNoReference(notUpdated)
            .onEqual(notUpdated)
            .onDiff(updateRef);
    }

    if (type === 'meta-updater') {
        return CaptureProcessor.create()
            .onNoReference(saveRef)
            .onEqual(notUpdated)
            .onDiff(updateRef);
    }
};
