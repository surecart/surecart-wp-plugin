import { ScInput, ScTag, ScTextarea } from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import Box from '../../ui/Box';

export default ({ loading, bump, updateBump }) => {
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
				label={__('Bump Description', 'surecart')}
				help={__(
					'Add a descirption that will get your customers excited about the offer.',
					'surecart'
				)}
				onScInput={(e) =>
					updateBump({
						metadata: {
							...(bump?.metadata || {}),
							description: e.target.value,
						},
					})
				}
				value={bump?.metadata?.description}
				name="description"
			/>
		</Box>
	);
};
