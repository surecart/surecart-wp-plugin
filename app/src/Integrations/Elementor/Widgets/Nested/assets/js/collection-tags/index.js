elementorCommon.elements.$window.on(
	'elementor/nested-element-type-loaded',
	async () => {
		new (await import('./module.js')).default();
	}
);
