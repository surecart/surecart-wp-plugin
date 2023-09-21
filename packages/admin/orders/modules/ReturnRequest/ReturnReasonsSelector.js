/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import ModelSelector from '../../../components/ModelSelector';
import { ScFormControl } from '@surecart/components-react';

export default ({ returnRequest, onSelect }) => {
	return (
		<ScFormControl label={__('Return Reason', 'surecart')}>
			<ModelSelector
				placeholder={__('Unknown', 'surecart')}
				name="return_reason"
				onSelect={onSelect}
				value={returnRequest?.return_reason}
				display={(item) => item?.description}
				style={{ width: '100%' }}
			></ModelSelector>
		</ScFormControl>
	);
};
