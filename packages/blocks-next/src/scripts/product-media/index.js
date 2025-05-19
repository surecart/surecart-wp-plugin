import { store } from '@wordpress/interactivity';

const { state } = store('surecart/product-media', {
	actions: {
		*init() {
			const { loadLightBox, loadImageSlider } = state;
			if (loadLightBox) {
				yield import(/* webpackIgnore: true */ 'surecart/lightbox');
			}
			if (loadImageSlider) {
				const { actions } = yield import(
					/* webpackIgnore: true */ '@surecart/image-slider'
				);
				actions.init();
			}
		},
	},
});
