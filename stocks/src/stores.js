"use strict";
exports.__esModule = true;
exports.companies = exports.playerMoney = void 0;
var store_1 = require("svelte/store");
var App_svelte_1 = require("./App.svelte");
exports.playerMoney = store_1.writable(0);
exports.companies = store_1.writable([
    App_svelte_1.company('A', 'AAAA', 'A', 'Tech', 100),
    App_svelte_1.company('B', 'BBBB', 'B', 'Auto', 100),
    App_svelte_1.company('C', 'CCCC', 'C', 'Banking', 100),
]);
