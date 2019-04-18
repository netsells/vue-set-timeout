export default {
    data() {
        return {
            _timerIds: [],
        };
    },

    methods: {
        /**
         * Set a single run timer
         *
         * @param {Function} callback
         * @param {Number} timeout
         *
         * @returns {Number}
         */
        setTimeout(callback, timeout) {
            const timer = setTimeout(() => {
                this.clearTimeout(timer);

                callback();
            }, timeout);

            this.$data._timerIds.push(timer);

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
            const timer = setInterval(callback, timeout);

            this.$data._timerIds.push(timer);

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
            this.$data._timerIds = this.$data._timerIds.filter(id => id !== timerId);

            return clearTimeout(timerId);
        },
    },

    beforeDestroy() {
        this.$data._timerIds.forEach(id => {
            this.clearTimeout(id);
        });
    },
};
