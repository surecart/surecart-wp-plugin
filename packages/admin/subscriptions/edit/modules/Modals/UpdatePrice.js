import { ScButton, ScDialog } from '@surecart/components-react';
import PriceSelector from '@admin/components/PriceSelector';
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { useEffect } from 'react';

export default ({
	price: existingPrice,
	onUpdatePrice,
	open,
	onRequestClose,
}) => {
	const [price, setPrice] = useState(existingPrice);

	const submit = () => {
		if (price) {
			onUpdatePrice(price);
		}
		onRequestClose();
	};

	useEffect(() => {
		setPrice(existingPrice);
	}, [existingPrice]);

	return (
		<ScDialog
			label={__('Update Subscription Price', 'surecart')}
			open={open}
			onScRequestClose={onRequestClose}
			style={{ '--dialog-body-overflow': 'visible' }}
		>
			<PriceSelector
				label={__('Select a price', 'surecart')}
				open={open}
				required
				value={price}
				onSelect={(price) => setPrice(price)}
				requestQuery={{
					archived: false,
					recurring: true,
				}}
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
