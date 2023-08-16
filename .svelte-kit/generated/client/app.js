export { matchers } from './matchers.js';

export const nodes = [
	() => import('./nodes/0'),
	() => import('./nodes/1'),
	() => import('./nodes/2'),
	() => import('./nodes/3'),
	() => import('./nodes/4'),
	() => import('./nodes/5'),
	() => import('./nodes/6'),
	() => import('./nodes/7'),
	() => import('./nodes/8'),
	() => import('./nodes/9')
];

export const server_loads = [];

export const dictionary = {
		"/": [2],
		"/auto-acronym": [3],
		"/box-game": [4],
		"/funny": [5],
		"/partition-game": [6],
		"/picture-game": [7],
		"/sort": [8],
		"/split-message-2000-chars": [9]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),
};

export { default as root } from '../root.svelte';