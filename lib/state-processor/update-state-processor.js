'use strict';

const StateProcessor = require('./state-processor');
const Events = require('../constants/events');

module.exports = class UpdateStateProcessor extends StateProcessor {
    constructor(opts) {
        super({
            module: require.resolve('./capture-processor/factory'),
            constructorArg: identifyUpdaterType(opts)
        });
    }

    exec(state, browserSession, page, emit) {
        return super.exec(state, browserSession, page)
            .then((result) => {
                emit(Events.CAPTURE, result);
                emit(Events.UPDATE_RESULT, result);
            });
    }
};

function identifyUpdaterType(opts) {
    if (opts.diff && !opts.new) {
        return 'diff-updater';
    }

    if (!opts.diff && opts.new) {
        return 'new-updater';
    }

    return 'meta-updater';
}
