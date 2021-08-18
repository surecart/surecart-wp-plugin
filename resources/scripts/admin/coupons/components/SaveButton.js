const { __ } = wp.i18n;
const { Button } = wp.components;
const { useSelect, dispatch, select } = wp.data;
import useSnackbar from '../../hooks/useSnackbar';
import { STORE_KEY as UI_STORE_KEY } from '../../store/ui';
import useCouponData from '../hooks/useCouponData';

export default ( { style, className, children } ) => {
	const { addSnackbarNotice } = useSnackbar();
	const { coupon, promotion, saveCoupon } = useCouponData();
	const isSaving = useSelect( ( select ) =>
		select( UI_STORE_KEY ).isSaving()
	);

	const save = async ( e ) => {
		e.preventDefault();
		await saveCoupon();
	};

	return (
		<Button
			isPrimary
			style={ style }
			className={ className }
			disabled={ isSaving }
			isBusy={ isSaving }
			onClick={ save }
		>
			{ children }
		</Button>
	);
};
