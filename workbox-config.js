module.exports = {
	globDirectory: './',
	globPatterns: [
		'**/*.{html,js,ts,css,json,txt,png,md,jpg,tsv,py}'
	],
	swDest: 'sw.js',
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	]
};