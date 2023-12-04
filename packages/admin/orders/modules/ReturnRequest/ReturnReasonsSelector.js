/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import ModelSelector from '../../../components/ModelSelector';

export default ({ returnRequest, onSelect, ...props }) => {
	return (
		<ModelSelector
			label={__('Return Reason', 'surecart')}
			placeholder={__('Choose an option', 'surecart')}
			name="return_reason"
			onSelect={onSelect}
			value={returnRequest?.return_reason}
			display={(item) => item?.description}
			style={{ width: '100%' }}
			{...props}
		/>
	);
};
