/**
 * WordPress dependencies.
 */

import { __ } from '@wordpress/i18n';

const supports = {
	reusable: false,
	html: false,
	multiple: false,
};

/**
 * V2 deprecation - before background_color and text_color were added.
 */
const v2 = {
	attributes: {
		text: {
			type: 'string',
			default: 'Purchase',
		},
		show_secure_notice: {
			type: 'boolean',
			default: true,
		},
		secure_notice_text: {
			type: 'string',
			default: 'This is a secure, encrypted payment.',
		},
		type: {
			type: 'string',
			default: 'primary',
		},
		show_total: {
			type: 'boolean',
			default: false,
		},
		show_icon: {
			type: 'boolean',
			default: true,
		},
		full: {
			type: 'boolean',
			default: false,
		},
		size: {
			type: 'string',
			default: 'large',
		},
	},
	supports,
	migrate(attributes) {
		return {
			...attributes,
			background_color: '',
			text_color: '',
		};
	},
	save({ attributes }) {
		const {
			type,
			full,
			size,
			text,
			show_total,
			show_icon,
			secure_notice_text,
			show_secure_notice,
		} = attributes;

		return (
			<sc-order-submit
				type={type}
				full={full ? 'true' : false}
				size={size}
				icon={show_icon ? 'lock' : false}
				show-total={show_total ? 'true' : false}
				secure-notice={show_secure_notice ? 'true' : 'false'}
				secure-notice-text={secure_notice_text}
			>
				{text}
			</sc-order-submit>
		);
	},
};

/**
 * V1 deprecation - before show_secure_notice and secure_notice_text were added.
 */
const v1 = {
	attributes: {
		text: {
			type: 'string',
			default: 'Purchase',
		},
		type: {
			type: 'string',
			default: 'primary',
		},
		show_total: {
			type: 'boolean',
			default: false,
		},
		show_icon: {
			type: 'boolean',
			default: true,
		},
		full: {
			type: 'boolean',
			default: false,
		},
		size: {
			type: 'string',
			default: 'large',
		},
	},
	supports,
	migrate(attributes) {
		return {
			...attributes,
			show_secure_notice: true,
			secure_notice_text: __(
				'This is a secure, encrypted payment.',
				'surecart'
			),
			background_color: '',
			text_color: '',
		};
	},
	save({ attributes }) {
		const { type, full, size, text, show_total, show_icon } = attributes;

		return (
			<sc-order-submit
				type={type}
				full={full ? 'true' : false}
				size={size}
				icon={show_icon ? 'lock' : false}
				show-total={show_total ? 'true' : false}
			>
				{text}
			</sc-order-submit>
		);
	},
};

export default [v2, v1];
