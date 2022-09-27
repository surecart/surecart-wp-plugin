if (typeof window !== 'undefined') {
	const { defineCustomElements } = require('@surecart/components/loader');
	defineCustomElements();

	window.registerSureCartIconPath(
		'https://cdn.jsdelivr.net/npm/@surecart/components/dist/surecart/icon-assets'
	);
}
