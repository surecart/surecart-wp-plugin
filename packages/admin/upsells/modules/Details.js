/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import { ScInput } from '@surecart/components-react';
import Box from '../../ui/Box';
import { ScRichText } from '@surecart/components-react';

export default ({ loading, upsell, updateUpsell }) => {
	return (
		<Box title={__('Details', 'surecart')} loading={loading}>
			<ScInput
				label={__('Upsell Name', 'surecart')}
				required
				help={__(
					'A name for this upsell. This is visible to customers.',
					'surecart'
				)}
				onScInput={(e) => updateUpsell({ name: e.target.value })}
				value={upsell?.name}
				name="name"
			/>
			{/* <ScInput
				label={__('Heading', 'surecart')}
				help={__(
					'This typically appears on the top of your upsell page.',
					'surecart'
				)}
				onScInput={(e) =>
					updateUpsell({
						metadata: {
							...(upsell?.metadata || {}),
							cta: e.target.value,
						},
					})
				}
				placeholder={__(
					"Wait! Here's an exclusive offer for you.",
					'surecart'
				)}
				value={upsell?.metadata?.cta}
				name="name"
			/>
			<ScRichText
				label={__('Description', 'surecart')}
				placeholder={__('Enter a description...', 'surecart')}
				help={__(
					'Add a description that will get your customers excited about the offer.',
					'surecart'
				)}
				style={{ '--sc-rich-text-max-height': '200px' }}
				maxlength={2500}
				value={upsell?.metadata?.description}
				onScInput={(e) =>
					updateUpsell({
						metadata: {
							...(upsell?.metadata || {}),
							description: e.target.value,
						},
					})
				}
				name="description"
			/> */}
		</Box>
	);
};
