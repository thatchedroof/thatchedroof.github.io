module.exports = {
	globDirectory: '.',
	globPatterns: [
		'**/*.{js,ts,tsv,html,css,py,json}'
	],
	swDest: 'sw.js',
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	]
};