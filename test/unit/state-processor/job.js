'use strict';

var CaptureSession = require('lib/capture-session'),
    CaptureProcessor = require('lib/state-processor/capture-processor/capture-processor'),
    temp = require('lib/temp'),
    proxyquire = require('proxyquire').noCallThru(),
    Promise = require('bluebird'),
    _ = require('lodash');

describe('state-processor/job', () => {
    var sandbox = sinon.sandbox.create(),
        captureProcessor,
        browserSession;

    function execJob_(opts) {
        var job = proxyquire('lib/state-processor/job', {
            './capture-processor': CaptureProcessor
        });

        return job(opts || {}, _.noop);
    }

    beforeEach(() => {
        captureProcessor = sinon.createStubInstance(CaptureProcessor);
        sandbox.stub(CaptureProcessor, 'create').returns(captureProcessor);
        captureProcessor.exec.returns(Promise.resolve({}));

        browserSession = sinon.createStubInstance(CaptureSession);
        browserSession.capture.returns({});

        sandbox.stub(CaptureSession, 'fromObject').returns(Promise.resolve(browserSession));

        sandbox.stub(temp, 'attach');
    });

    afterEach(() => sandbox.restore());

    it('should create capture processor', () => {
        execJob_({captureProcessorType: 'some-type'});

        assert.calledOnceWith(CaptureProcessor.create, 'some-type');
    });

    it('should capture screenshot', () => {
        var page = {captureArea: {}};

        return execJob_({page})
            .then(() => assert.calledOnceWith(browserSession.capture, page));
    });

    it('should process captured screenshot', () => {
        var capture = {some: 'capture'};
        browserSession.capture.returns(Promise.resolve(capture));

        return execJob_({})
            .then(() => assert.calledOnceWith(captureProcessor.exec, capture));
    });
});
