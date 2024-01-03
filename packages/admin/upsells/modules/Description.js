/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import { ScTag, ScTextarea } from '@surecart/components-react';
import Box from '../../ui/Box';

export default ({ loading, upsell, updateUpsell }) => {
	return (
		<Box
			title={
				<>
					{__('Add a description', 'surecart')}{' '}
					<ScTag>{__('Optional', 'surecart')}</ScTag>
				</>
			}
			loading={loading}
		>
			<ScTextarea
				label={__('Upsell Description', 'surecart')}
				help={__(
					'Add a description that will get your customers excited about the offer.',
					'surecart'
				)}
				onScInput={(e) =>
					updateUpsell({
						metadata: {
							...(upsell?.metadata || {}),
							description: e.target.value,
						},
					})
				}
				value={upsell?.metadata?.description}
				name="description"
			/>
		</Box>
	);
};
