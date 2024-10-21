/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';

export default ({ attributes }) => {
	const { text, className } = attributes;

	return <sc-invoice-memo class={className} text={text} />;
};
