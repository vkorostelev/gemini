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
    let type;

    if (opts.diff && !opts.new) {
        type = 'diff-updater';
    } else if (!opts.diff && opts.new) {
        type = 'new-updater';
    } else {
        type = 'meta-updater';
    }

    return type;
}
