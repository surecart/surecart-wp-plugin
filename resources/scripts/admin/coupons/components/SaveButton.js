const { __ } = wp.i18n;
const { Button } = wp.components;
const { useSelect, dispatch, select } = wp.data;
import useSnackbar from '../../hooks/useSnackbar';
import { STORE_KEY as UI_STORE_KEY } from '../../store/ui';
import useCouponData from '../hooks/useCouponData';

export default ( { style, children } ) => {
	const isSaving = useSelect( ( select ) =>
		select( UI_STORE_KEY ).isSaving()
	);

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
