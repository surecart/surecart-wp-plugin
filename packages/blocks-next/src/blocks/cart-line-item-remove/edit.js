import { useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

export default ({ context: { removable = true } }) => {
	const blockProps = useBlockProps();

	if (!removable) {
		return null;
	}

	return (
		<div {...blockProps}>
			<sc-icon name="x" />
			{__('Remove', 'surecart')}
		</div>
	);
};
