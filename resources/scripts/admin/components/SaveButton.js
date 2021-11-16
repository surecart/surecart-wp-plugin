const { __ } = wp.i18n;
const { Button } = wp.components;
const { useSelect } = wp.data;
import { store as uiStore } from '../store/ui';

export default ( { style, children } ) => {
	const isSaving = useSelect( ( select ) => select( uiStore ).isSaving() );

	return (
		<Button
			isPrimary
			type="submit"
			style={ style }
			className={ 'ce-save-model' }
			disabled={ isSaving }
			isBusy={ isSaving }
		>
			{ children }
		</Button>
	);
};
