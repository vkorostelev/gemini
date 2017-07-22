'use strict';

const utils = require('./utils');
const temp = require('../../temp');

module.exports = class CaptureProcessor {
    static create() {
        return new CaptureProcessor();
    }

    constructor() {
        this._onRefHandler = null;
        this._onNoRefHandler = null;
        this._onEqualHandler = null;
        this._onDiffHandler = null;
    }

    onReference(handler) {
        this._onRefHandler = handler;
        return this;
    }

    onNoReference(handler) {
        this._onNoRefHandler = handler;
        return this;
    }

    onEqual(handler) {
        this._onEqualHandler = handler;
        return this;
    }

    onDiff(handler) {
        this._onDiffHandler = handler;
        return this;
    }

    exec(capture, opts) {
        const referencePath = opts.referencePath;

        return utils.existsRef(referencePath)
            .then((isRefExists) => {
                return isRefExists
                    ? this._onRefHandler(referencePath) || this._compareImages(capture, opts)
                    : this._onNoRefHandler(referencePath, capture);
            });
    }

    _compareImages(capture, opts) {
        const referencePath = opts.referencePath;
        const currentPath = temp.path({suffix: '.png'});
        const compareOpts = {
            canHaveCaret: capture.canHaveCaret,
            tolerance: opts.tolerance,
            pixelRatio: opts.pixelRatio
        };

        return capture.image.save(currentPath)
            .then(() => capture.image.compare(currentPath, referencePath, compareOpts))
            .then((isEqual) => {
                return isEqual
                    ? this._onEqualHandler(referencePath, currentPath)
                    : this._onDiffHandler(referencePath, currentPath);
            });
    }
};
