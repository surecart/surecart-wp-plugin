/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import { ScInput, ScTag } from '@surecart/components-react';
import Box from '../../ui/Box';

export default ({ loading, upsell, updateUpsell }) => {
	return (
		<Box
			title={
				<>
					{__('Custom Call to action', 'surecart')}{' '}
					<ScTag>{__('Optional', 'surecart')}</ScTag>
				</>
			}
			loading={loading}
		>
			<ScInput
				label={__('Call to action', 'surecart')}
				help={__(
					'Set a custom call to action for the upsell.',
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
				value={upsell?.metadata?.cta}
				name="name"
			/>
		</Box>
	);
};
