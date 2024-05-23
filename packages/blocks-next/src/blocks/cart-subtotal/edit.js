/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';

export default () => {
	const blockProps = useBlockProps();

	return <div {...blockProps}>$1,35.79</div>;
};
