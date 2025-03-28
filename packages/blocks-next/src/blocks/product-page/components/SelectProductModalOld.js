import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { Button } from '@wordpress/components';

/**
 * Internal dependencies.
 */
import SelectProduct from './SelectProduct';
import { Icon } from '@wordpress/components';
import { arrowRight } from '@wordpress/icons';

export default ({
	defaultProduct,
	onChoose,
	onSelectProduct,
	showSelectButtons = true,
}) => {
	const [product, setProduct] = useState(defaultProduct || {});
	const [busy, setBusy] = useState(false);

	// add the product to the choices.
	const addProduct = () => {
		if (!product?.id) {
			return;
		}

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
				onSelect={(product) => {
					setProduct(product);

					if (onSelectProduct) {
						onSelectProduct(product);
					}
				}}
				busy={busy}
				setBusy={setBusy}
			/>

			{showSelectButtons && (
				<div
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						gap: '0.5em',
					}}
				>
					<Button
						variant="primary"
						isBusy={busy}
						onClick={addProduct}
						style={{
							marginTop: '1em',
						}}
						disabled={!product?.id}
					>
						{__('Select Product', 'surecart')}

						{!!product?.id && (
							<Icon
								icon={arrowRight}
								style={{ marginLeft: '0.5em' }}
							/>
						)}
					</Button>
				</div>
			)}
		</div>
	);
};
