import { __ } from '@wordpress/i18n';
import { ScSelect, ScSwitch } from '@surecart/components-react';

export default function ReplacementBehavior({ upsell, onUpdate }) {
	return (
		<ScSelect
			label={__('When accepted', 'surecart')}
			choices={[
				{
					label: __('Replace the entire order', 'surecart'),
					value: 'all',
				},
				{ label: __('Add to the order', 'surecart'), value: 'none' },
			]}
			value={upsell?.replacement_behavior || 'none'}
			help={__(
				'Choose the behavior of accepting this upsell',
				'surecart'
			)}
			onScChange={(e) =>
				onUpdate({
					replacement_behavior: e.target.value,
				})
			}
		/>
	);
}
