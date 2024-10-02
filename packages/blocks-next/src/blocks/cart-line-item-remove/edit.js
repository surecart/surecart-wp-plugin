import { useBlockProps } from '@wordpress/block-editor';
import { ScIcon } from '@surecart/components-react';
import { __ } from '@wordpress/i18n';

export default ({ context: { removable = true } }) => {
	const blockProps = useBlockProps();

	if (!removable) {
		return null;
	}

	return (
		<div {...blockProps}>
			<ScIcon name="x" />
			{__('Remove', 'surecart')}
		</div>
	);
};
