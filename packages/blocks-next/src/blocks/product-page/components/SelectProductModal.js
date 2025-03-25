import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { Button } from '@wordpress/components';

/**
 * Internal dependencies.
 */
import SelectProduct from './SelectProduct';

export default ({ onRequestClose, onChoose }) => {
	const [product, setProduct] = useState({});
	const [busy, setBusy] = useState(false);

	// add the product to the choices.
	const addProduct = () => {
		console.log('come addProduct', product);
		if (!product?.id) {
			return;
		}

		setBusy(true);
		// Go to next step.
		onChoose(product);
	};

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
			}}
		>
			<SelectProduct
				product={product}
				onSelect={(product) => setProduct(product)}
			/>

			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					gap: '0.5em',
				}}
			>
				<Button
					isPrimary
					isBusy={busy}
					onClick={addProduct}
					style={{
						marginTop: '1em',
					}}
				>
					{__('Select Product', 'surecart')}
				</Button>
			</div>
		</div>
	);
};
