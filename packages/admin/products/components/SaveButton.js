import { __ } from '@wordpress/i18n';
import { CeButton } from '@checkout-engine/components-react';
import { useSelect } from '@wordpress/data';

import { store as uiStore } from '../../store/ui';

export default ( { style, children } ) => {
	const isSaving = useSelect( ( select ) => select( uiStore ).isSaving() );

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
