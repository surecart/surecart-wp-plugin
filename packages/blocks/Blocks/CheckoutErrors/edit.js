import { ScAlert } from '@surecart/components-react';
import { useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

export default () => {
	const blockProps = useBlockProps();
	return (
		<div {...blockProps}>
			<ScAlert type="danger" open>
				{__(
					'If there are errors in the checkout, they will display here.',
					'surecart'
				)}
			</ScAlert>
		</div>
	);
};
