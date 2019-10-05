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

    onBeforeMount(() => {
        timerIds.value = [];
    });

    onBeforeUnmount(() => {
        timerIds.value.forEach(id => {
            this.clearTimeout(id);
        });

        timerIds.value = null;
    });

    return {
        /**
         * Set a single run timer
         *
         * @param {Function} callback
         * @param {Number} timeout
         *
         * @returns {Number}
         */
        setTimeout(callback, timeout) {
            if (!timerIds.value) {
                return;
            }

            const timer = setTimeout(() => {
                this.clearTimeout(timer);

                callback();
            }, timeout);

            timerIds.value.push(timer);

            return timer;
        },

        /**
         * Set an interval
         *
         * @param {Function} callback
         * @param {Number} timeout
         *
         * @returns {Number}
         */
        setInterval(callback, timeout) {
            if (!timerIds.value) {
                return;
            }

            const timer = setInterval(callback, timeout);

            timerIds.value.push(timer);

            return timer;
        },

        /**
         * Clear a timeout
         *
         * @param {Number} timerId
         *
         * @returns {*}
         */
        clearTimeout(timerId) {
            removeTimer(timerId);

            return clearTimeout(timerId);
        },

        /**
         * Clear an interval
         *
         * @param {Number} timerId
         *
         * @returns {*}
         */
        clearInterval(timerId) {
            removeTimer(timerId);

            return clearInterval(timerId);
        },
    };
};

export default useTimeouts;
