'use strict';

const StateProcessor = require('./state-processor');
const Events = require('../constants/events');

module.exports = class UpdateStateProcessor extends StateProcessor {
    constructor(opts) {
        super(identifyUpdaterType(opts));
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
    return opts.diff && !opts.new && 'diff-updater'
        || !opts.diff && opts.new && 'new-updater'
        || 'meta-updater';
}
