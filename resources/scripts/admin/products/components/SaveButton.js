const { __ } = wp.i18n;
import { CeButton } from '@checkout-engine/react';
const { useSelect } = wp.data;
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
