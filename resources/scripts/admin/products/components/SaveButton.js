import { __ } from '@wordpress/i18n';
import { CeButton } from '@checkout-engine/react';
import { useSelect } from '@wordpress/data';

import { STORE_KEY as UI_STORE_KEY } from '../../store/ui';

export default ( { style, children } ) => {
	const isSaving = useSelect( ( select ) =>
		select( UI_STORE_KEY ).isSaving()
	);

	return (
		<CeButton
			type="primary"
			submit
			style={ style }
			className={ 'ce-save-model' }
			disabled={ isSaving }
			loading={ isSaving }
		>
			{ children }
		</CeButton>
	);
};
