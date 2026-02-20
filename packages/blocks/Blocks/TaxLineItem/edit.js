import { useBlockProps } from '@wordpress/block-editor';

export default ({ attributes }) => {
	const blockProps = useBlockProps();
	return (
		<div {...blockProps}>
			<sc-line-item-tax></sc-line-item-tax>
		</div>
	);
};
