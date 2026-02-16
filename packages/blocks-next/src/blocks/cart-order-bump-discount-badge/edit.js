/**
 * External dependencies.
 */
import { useBlockProps } from '@wordpress/block-editor';

export default () => {
	const blockProps = useBlockProps({
		className: 'sc-tag sc-tag--primary',
	});

	return <div {...blockProps}>-10%</div>;
};
