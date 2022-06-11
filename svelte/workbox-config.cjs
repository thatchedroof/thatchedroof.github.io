module.exports = {
	globDirectory: 'src/',
	globPatterns: [
		'**/*.{css,ts,html,png,jpg,svelte,svg,json,js,txt}'
	],
	swDest: 'src/sw.js',
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	]
};