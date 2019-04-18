[![npm version](https://badge.fury.io/js/%40netsells%2Fvue-set-timeout.svg)](https://badge.fury.io/js/%40netsells%2Fvue-set-timeout)
[![Build Status](https://travis-ci.com/netsells/vue-set-timeout.svg?branch=master)](https://travis-ci.com/netsells/vue-set-timeout)
[![codecov](https://codecov.io/gh/netsells/vue-set-timeout/branch/master/graph/badge.svg)](https://codecov.io/gh/netsells/vue-set-timeout)
[![Mutation testing badge](https://badge.stryker-mutator.io/github.com/netsells/vue-set-timeout/master)](https://stryker-mutator.github.io)

# Vue Set Timeout

A mixin to make it easy to safely use setTimeout, setInterval and clearTimeout
in your Vue components without memory leaks

## Usage

This mixin adds setTimeout, setInterval and clearInterval to the components
class instance. They take the same arguments as the native JS functions.

```javascript
import VueSetTimeout from '@netsells/vue-set-timeout';

export default {
    mixins: [VueSetTimeout],

    mounted() {
        this.setTimeout(() => {}, 10);
        const timer = this.setInterval(() => {}, 10);
        this.clearTimeout(timer);
    },
}
```
