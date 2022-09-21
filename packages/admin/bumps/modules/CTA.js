import { ScInput, ScTag } from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import Box from '../../ui/Box';

export default ({ loading, bump, updateBump }) => {
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
					'Set a custom call to action for the bump.',
					'surecart'
				)}
				onScInput={(e) =>
					updateBump({
						metadata: {
							...(bump?.metadata || {}),
							cta: e.target.value,
						},
					})
				}
				value={bump?.metadata?.cta}
				name="name"
			/>
		</Box>
	);
};
