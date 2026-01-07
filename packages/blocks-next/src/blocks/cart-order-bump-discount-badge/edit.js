/**
 * External dependencies.
 */
import { useBlockProps } from '@wordpress/block-editor';

export default () => {
	const blockProps = useBlockProps();
	return <div {...blockProps}>-10%</div>;
};
