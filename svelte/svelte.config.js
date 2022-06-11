import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';
//import { sequence } from '@sveltejs/kit/dist/hooks.js';
import { searchForWorkspaceRoot } from 'vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),

	kit: {
		adapter: adapter(),

		// Override http methods in the Todo forms
		methodOverride: {
			allowed: ['PATCH', 'DELETE']
		},
		vite: {
			server: {
				fs: {
					allow: ['..', searchForWorkspaceRoot(process.cwd()), 'local'],
					deny: []
				},
				fsServe: {
					root: '../'
				}
			}
		}
	}
};

export default config;
