import { writable } from 'svelte/store';

import { company } from './App.svelte';

export const playerMoney = writable(0);

export const companies = writable([
    company('A', 'AAAA', 'A', 'Tech', 100),
    company('B', 'BBBB', 'B', 'Auto', 100),
    company('C', 'CCCC', 'C', 'Banking', 100),
]);
