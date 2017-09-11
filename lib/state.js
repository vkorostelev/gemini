'use strict';

const _ = require('lodash');

module.exports = class State {
    constructor(suite, name) {
        this.suite = suite;
        this.name = name;
        this._ownTolerance = null;
        this._ownCaptureArea = null;
        this.actions = [];
        this.browsers = _.clone(suite.browsers);
    }

    clone() {
        const clonedState = new State(this.suite, this.name);
        ['_ownTolerance', '_ownCaptureArea', 'actions'].forEach((prop) => {
            clonedState[prop] = _.clone(this[prop]);
        });

        return clonedState;
    }

    shouldSkip(browserId) {
        return this.suite.shouldSkip(browserId);
    }

    get fullName() {
        return `${this.suite.fullName} ${this.name}`;
    }

    get skipped() {
        return this.suite.skipped;
    }

    get captureArea() {
        return this._ownCaptureArea === null ? this.suite.captureArea : this._ownCaptureArea;
    }

    set captureArea(value) {
        this._ownCaptureArea = value;
    }

    get captureSelectors() {
        return this.suite.captureSelectors;
    }

    get ignoreSelectors() {
        return this.suite.ignoreSelectors;
    }

    get tolerance() {
        return this._ownTolerance === null ? this.suite.tolerance : this._ownTolerance;
    }

    set tolerance(value) {
        this._ownTolerance = value;
    }
};
