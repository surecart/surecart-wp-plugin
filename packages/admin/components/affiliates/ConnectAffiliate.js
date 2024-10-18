/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import ModelSelector from '../ModelSelector';

export default ({ item, updateItem }) => {
	return (
		<ModelSelector
			label={__('Connect an affiliate', 'surecart')}
			unselect={false}
			name="affiliation"
			value={item?.affiliation?.id || item?.affiliation}
			onSelect={(affiliation) =>
				updateItem({
					affiliation,
				})
			}
			display={(affiliation) =>
				`${affiliation.display_name} - ${affiliation.email}`
			}
			placeholder={__('Select an affiliate', 'surecart')}
			help={__(
				'This will give the affiliate commissions for a specified period of time.',
				'surecart'
			)}
		/>
	);
};
