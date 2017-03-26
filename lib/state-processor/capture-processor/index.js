'use strict';

const Promise = require('bluebird');
const utils = require('./utils');
const temp = require('../../temp');
const NoRefImageError = require('../../errors/no-ref-image-error');

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
                if (!isRefExists) {
                    return this._onNoRefHandler
                        ? this._onNoRefHandler(referencePath, capture)
                        : Promise.reject(new NoRefImageError(referencePath));
                }

                if (!this._onEqualHandler && !this._onDiffHandler) {
                    return this._onRefHandler(referencePath);
                }

                return this._compareImages(capture, opts);
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
