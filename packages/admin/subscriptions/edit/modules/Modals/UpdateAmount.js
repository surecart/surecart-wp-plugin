import { ScButton, ScDialog, ScPriceInput } from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import { useEffect, useRef, useState } from '@wordpress/element';

export default ({ amount, onUpdateAmount, open, onRequestClose }) => {
	const [adHocAmount, setAdHocAmount] = useState(amount);
	const input = useRef();

	const submit = () => {
		onUpdateAmount(adHocAmount);
		onRequestClose();
	};

	useEffect(() => {
		setAdHocAmount(amount);
	}, [amount]);

	useEffect(() => {
		if (open) {
			setTimeout(() => {
				input.current.triggerFocus();
			}, 100);
		}
	}, [open]);

	return (
		<ScDialog
			label={__('Update Amount', 'surecart')}
			open={open}
			onScRequestClose={onRequestClose}
		>
			<ScPriceInput
				label={__('Amount', 'surecart')}
				value={adHocAmount}
				onScInput={(e) => {
					setAdHocAmount(e.target.value);
				}}
				ref={input}
			/>
			<ScButton type="text" onClick={onRequestClose} slot="footer">
				{__('Cancel', 'surecart')}
			</ScButton>
			<ScButton type="primary" onClick={submit} slot="footer">
				{__('Update', 'surecart')}
			</ScButton>
		</ScDialog>
	);
};
