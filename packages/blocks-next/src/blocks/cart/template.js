export const TEMPLATE = [
	[
		'surecart/slide-out-cart-header',
		{
			border: true,
			padding: {
				top: '1.25em',
				right: '1.25em',
				bottom: '1.25em',
				left: '1.25em',
			},
			lock: { move: true, remove: true },
			title: 'Review Your Cart',
		},
	],
	[
		'surecart/slide-out-cart-line-items',
		{
			border: true,
			padding: {
				top: '1.25em',
				right: '1.25em',
				bottom: '1.25em',
				left: '1.25em',
			},
			lock: { move: false, remove: true },
			removable: true,
			editable: true,
		},
	],
	[
		'surecart/slide-out-cart-coupon',
		{
			border: true,
			padding: {
				top: '1.25em',
				right: '1.25em',
				bottom: '1.25em',
				left: '1.25em',
			},
		},
	],
	[
		'surecart/slide-out-cart-items-subtotal',
		{
			border: false,
			padding: {
				top: '1.25em',
				right: '1.25em',
				bottom: 0,
				left: '1.25em',
			},
		},
	],
	[
		'surecart/slide-out-cart-bump-line-item',
		{
			border: false,
			padding: {
				top: '1.25em',
				left: '1.25em',
				bottom: 0,
				right: '1.25em',
			},
		},
	],
	[
		'surecart/slide-out-cart-items-submit',
		{
			border: true,
			padding: {
				top: '1.25em',
				right: '1.25em',
				bottom: '1.25em',
				left: '1.25em',
			},
			lock: { move: false, remove: true },
			showIcon: true,
			type: 'primary',
			size: 'medium',
			icon: 'lock',
		},
	],
];
