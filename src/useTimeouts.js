import { ref, onBeforeUnmount, onBeforeMount } from '@vue/composition-api';

const useTimeouts = () => {
    const timerIds = ref(null);

    /**
     * Remove a timer from internal tracking
     *
     * @private
     *
     * @param {Number} timerId
     */
    const removeTimer = timerId => {
        timerIds.value = timerIds.value.filter(id => id !== timerId);
    };

    /**
     * Set a single run timer
     *
     * @param {Function} callback
     * @param {Number} timeout
     *
     * @returns {Number}
     */
    const setTimeoutInternal = (callback, timeout) => {
        if (!timerIds.value) {
            return;
        }

        const timer = setTimeout(() => {
            clearTimeoutInternal(timer);

            callback();
        }, timeout);

        timerIds.value.push(timer);

        return timer;
    };

    /**
     * Set an interval
     *
     * @param {Function} callback
     * @param {Number} timeout
     *
     * @returns {Number}
     */
    const setIntervalInternal = (callback, timeout) => {
        if (!timerIds.value) {
            return;
        }

        const timer = setInterval(callback, timeout);

        timerIds.value.push(timer);

        return timer;
    };

    /**
     * Clear a timeout
     *
     * @param {Number} timerId
     *
     * @returns {*}
     */
    const clearTimeoutInternal = timerId => {
        removeTimer(timerId);

        return clearTimeout(timerId);
    };

    /**
     * Clear an interval
     *
     * @param {Number} timerId
     *
     * @returns {*}
     */
    const clearIntervalInternal = timerId => {
        removeTimer(timerId);

        return clearInterval(timerId);
    };

    const tearDownTimers = () => {
        if (!timerIds.value) {
            return;
        }

        timerIds.value.forEach(id => {
            clearTimeout(id);
        });

        timerIds.value = null;
    };

    onBeforeMount(() => {
        timerIds.value = [];
    });

    onBeforeUnmount(tearDownTimers);

    return {
        setTimeout: setTimeoutInternal,
        setInterval: setIntervalInternal,
        clearTimeout: clearTimeoutInternal,
        clearInterval: clearIntervalInternal,
    };
};

export default useTimeouts;
