/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';

export default ({ attributes }) => {
	const { text, className } = attributes;

	return <sc-line-item-invoice-memo class={className} text={text} />;
};
