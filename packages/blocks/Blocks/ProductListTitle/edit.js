import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';

export default ({ attributes }) => {
	const blockProps = useBlockProps();

	return (
		<div {...blockProps}>
			<div>{attributes?.title}</div>
		</div>
	);
};
