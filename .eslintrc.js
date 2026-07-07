module.exports = {
	extends: ['plugin:@wordpress/eslint-plugin/recommended'],
	rules: {
		// Prevent warnings for webpack resolve aliases.
		'import/no-unresolved': 'off',
		// Prevent warnings for webpack extension resolution.
		'import/extensions': 'off',
		// Prevent warnings for import statements with aliases.
		'import/first': 'off',
		// Enforce the plugin text domain so wrong/missing domains are caught statically.
		'@wordpress/i18n-text-domain': [
			'error',
			{ allowedTextDomain: 'surecart' },
		],
	},
	settings: {
		react: {
			version: 'latest',
		},
	},
};
