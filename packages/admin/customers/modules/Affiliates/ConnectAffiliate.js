/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import ModelSelector from '../../../components/ModelSelector';
import { ScFormControl } from '@surecart/components-react';

export default ({ customer, updateCustomer }) => {
	return (
		<ScFormControl label={__('Connect an affiliate', 'surecart')}>
			<ModelSelector
				unselect={false}
				name="affiliation"
				value={customer?.affiliation?.id || customer?.affiliation}
				onSelect={(affiliation) =>
					updateCustomer({
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
