import vuexlens from '../index.js';
import Vuex from 'vuex';
import Vue from 'vue';

Vue.use(Vuex);

describe('test vuex-lens', () => {
    let store;

    // setup vuex
    beforeEach(() => {
        store = new Vuex.Store({
            state: {
                count: 1
            },
            plugins: [
                vuexlens
            ]
        });
    });

    test('vuex lens', () => {
        expect(vuexlens).toBeTruthy();
    });
});
