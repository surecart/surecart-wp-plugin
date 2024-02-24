/**
 * WordPress dependencies
 */
import { store } from '@wordpress/interactivity';

// controls the product page.
const { state } = store('surecart/currency', {
	state: {
		get isZeroDecimal() {
			return [
				'BIF',
				'BYR',
				'CLP',
				'DJF',
				'GNF',
				'ISK',
				'JPY',
				'KMF',
				'KRW',
				'PYG',
				'RWF',
				'UGX',
				'VND',
				'VUV',
				'XAF',
				'XAG',
				'XAU',
				'XBA',
				'XBB',
				'XBC',
				'XBD',
				'XDR',
				'XOF',
				'XPD',
				'XPF',
				'XPT',
				'XTS',
			].includes(state.currency.toUpperCase());
		},
	},
	actions: {
		format: (amount) => {
			return new Intl.NumberFormat([], {
				style: 'currency',
				currency: state.currency.toUpperCase(),
				currencyDisplay: 'symbol',
				minimumFractionDigits: amount % 1 == 0 ? 0 : 2,
			}).format(state.isZeroDecimal ? amount : amount / 100);
		},
	},
});
