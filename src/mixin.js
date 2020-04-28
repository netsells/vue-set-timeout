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
            if (!this.$data._timerIds) {
                return null;
            }

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
            if (!this.$data._timerIds) {
                return null;
            }

            const timer = setInterval(callback, timeout);

            this.$data._timerIds.push(timer);

            return timer;
        },

        /**
         * Remove a timer from internal tracking
         *
         * @private
         *
         * @param {Number} timerId
         */
        _removeTimer(timerId) {
            this.$data._timerIds = this.$data._timerIds.filter(id => id !== timerId);
        },

        /**
         * Clear a timeout
         *
         * @param {Number} timerId
         *
         * @returns {*}
         */
        clearTimeout(timerId) {
            this._removeTimer(timerId);

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
            this._removeTimer(timerId);

            return clearInterval(timerId);
        },
    },

    beforeDestroy() {
        if (this.$data._timerIds) {
            this.$data._timerIds.forEach(id => {
                this.clearTimeout(id);
            });

            this.$data._timerIds = null;
        }
    },
};
