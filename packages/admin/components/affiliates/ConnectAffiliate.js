/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import { ScFormControl } from '@surecart/components-react';
import ModelSelector from '../ModelSelector';

export default ({ item, updateItem }) => {
	return (
		<ScFormControl label={__('Connect an affiliate', 'surecart')}>
			<ModelSelector
				unselect={false}
				name="affiliation"
				value={item?.affiliation?.id || item?.affiliation}
				onSelect={(affiliation) =>
					updateItem({
						affiliation,
					})
				}
				display={(affiliation) =>
					`${affiliation.first_name} ${affiliation.last_name || ''}`
				}
				placeholder={__('Select an affiliate', 'surecart')}
				help={__(
					'This will give the affiliate commissions for a specified period of time.',
					'surecart'
				)}
			></ModelSelector>
		</ScFormControl>
	);
};
