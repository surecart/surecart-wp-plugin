/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import ModelSelector from '../../../components/ModelSelector';

export default ({ returnRequest, onSelect }) => {
	return (
		<ModelSelector
			label={__('Return Reason', 'surecart')}
			placeholder={__('Unknown', 'surecart')}
			name="return_reason"
			onSelect={onSelect}
			value={returnRequest?.return_reason}
			display={(item) => item?.description}
			style={{ width: '100%' }}
		/>
	);
};
