import { __ } from '@wordpress/i18n';
import { CeButton } from '@checkout-engine/react';
import { useSelect } from '@wordpress/data';

import { store as uiStore } from '../../store/ui';
import { store as coreStore } from '../../store/data';

export default ( { style, children } ) => {
	const isSaving = useSelect( ( select ) => select( uiStore ).isSaving() );
	const hasDirtyModels = useSelect( ( select ) =>
		select( coreStore ).hasDirtyModels()
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
