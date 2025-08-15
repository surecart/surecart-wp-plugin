/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';

/**
 * Internal dependencies.
 */
export default () => {
	const blockProps = useBlockProps();
	return <span {...blockProps}>{scData?.currency_symbol}135.79</span>;
};
