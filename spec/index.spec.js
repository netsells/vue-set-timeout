import { mount } from '@vue/test-utils';
import Vue from 'vue';
import VueCompositionApi from '@vue/composition-api';

import useTimeouts from '../src/index';

Vue.use(VueCompositionApi);

jest.useFakeTimers();

describe('useTimeouts', () => {
    const component = {
        template: '<div />',

        setup() {
            return useTimeouts();
        },
    };

    let wrapper;
    let callback;
    let timer;

    beforeEach(() => {
        jest.clearAllMocks();
        wrapper = mount(component);
        callback = jest.fn();
    });

    describe('after destroyed', () => {
        let vm;

        beforeEach(() => {
            vm = wrapper.vm;
            wrapper.destroy();
        });

        describe('when calling setTimeout', () => {
            beforeEach(() => {
                vm.setTimeout(callback, 150);
            });

            it('does not call the native setTimeout', () => {
                expect(setTimeout).not.toHaveBeenCalled();
            });
        });

        describe('when calling setInterval', () => {
            beforeEach(() => {
                vm.setInterval(callback, 150);
            });

            it('does not call the native setInterval', () => {
                expect(setInterval).not.toHaveBeenCalled();
            });
        });
    });

    describe('setTimeout', () => {
        beforeEach(() => {
            timer = wrapper.vm.setTimeout(callback, 150);
        });

        it('calls native setTimeout with the correct args', () => {
            expect(setTimeout).toHaveBeenCalledTimes(1);
            expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 150);
        });

        it('does not call callback', () => {
            expect(callback).not.toHaveBeenCalled();
        });

        describe('calling clearTimeout before timer completed', () => {
            beforeEach(() => {
                wrapper.vm.clearTimeout(timer);
                jest.runOnlyPendingTimers();
            });

            it('does not call the callback', () => {
                expect(callback).not.toHaveBeenCalled();
            });
        });

        describe('after running pending timers', () => {
            beforeEach(() => {
                jest.runOnlyPendingTimers();
            });

            it('calls the callback', () => {
                expect(callback).toHaveBeenCalledTimes(1);
            });

            it('calls clearTimeout on the timer', () => {
                expect(clearTimeout).toHaveBeenCalledTimes(1);
                expect(clearTimeout).toHaveBeenLastCalledWith(timer);
            });

            describe('after running pending timers again', () => {
                beforeEach(() => {
                    jest.runOnlyPendingTimers();
                });

                it('does not call the callback again', () => {
                    expect(callback).toHaveBeenCalledTimes(1);
                });
            });

            describe('when component destroyed', () => {
                beforeEach(() => {
                    wrapper.destroy();
                });

                it('does not call clearTimeout on the timer again', () => {
                    expect(clearTimeout).toHaveBeenCalledTimes(1);
                });
            });
        });

        describe('when component destroyed', () => {
            beforeEach(() => {
                wrapper.destroy();
                jest.runOnlyPendingTimers();
            });

            it('calls clearTimeout on the timer', () => {
                expect(clearTimeout).toHaveBeenCalledTimes(1);
                expect(clearTimeout).toHaveBeenLastCalledWith(timer);
            });

            it('stops the callback from being called', () => {
                expect(callback).not.toHaveBeenCalled();
            });
        });

        describe('when creating another timer, clearing it, then destroying component', () => {
            beforeEach(() => {
                const secondCallback = jest.fn();
                const secondTimer = wrapper.vm.setTimeout(secondCallback, 250);
                wrapper.vm.clearTimeout(secondTimer);
                wrapper.destroy();
            });

            it('calls clearInterval on the second timer', () => {
                expect(clearTimeout).toHaveBeenCalledTimes(2);
                expect(clearTimeout).toHaveBeenLastCalledWith(timer);
            });
        });
    });

    describe('setInterval', () => {
        beforeEach(() => {
            timer = wrapper.vm.setInterval(callback, 320);
        });

        it('calls native setInterval with the correct args', () => {
            expect(setInterval).toHaveBeenCalledTimes(1);
            expect(setInterval).toHaveBeenLastCalledWith(callback, 320);
        });

        it('does not call callback', () => {
            expect(callback).not.toHaveBeenCalled();
        });

        describe('after running pending timers', () => {
            beforeEach(() => {
                jest.runOnlyPendingTimers();
            });

            it('calls the callback', () => {
                expect(callback).toHaveBeenCalledTimes(1);
            });

            describe('after running pending timers again', () => {
                beforeEach(() => {
                    jest.runOnlyPendingTimers();
                });

                it('calls the callback again', () => {
                    expect(callback).toHaveBeenCalledTimes(2);
                });
            });

            describe('calling clearInterval', () => {
                beforeEach(() => {
                    wrapper.vm.clearInterval(timer);
                    jest.runOnlyPendingTimers();
                });

                it('does not call the callback again', () => {
                    expect(callback).toHaveBeenCalledTimes(1);
                });
            });
        });
    });
});
