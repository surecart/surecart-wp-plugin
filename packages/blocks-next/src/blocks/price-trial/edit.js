import { useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

export default ({ context }) => {
	const blockProps = useBlockProps();
	const { trial_text } = context['surecart/price'];
	return (
		<div {...blockProps}>
			{trial_text || __('Starting in 15 days', 'surecart')}
		</div>
	);
};
