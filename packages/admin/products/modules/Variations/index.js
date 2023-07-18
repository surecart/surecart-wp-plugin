/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies.
 */
import { ScButton, ScIcon } from '@surecart/components-react';
import Box from '../../../ui/Box';
import NewVariantOption from './NewVariantOption';
import VariantOptions from './VariantOptions';

export default ({ product, updateProduct, loading }) => {
	const [modal, setModal] = useState(false);
	const [options, setOptions] = useState([]);
	const variantOptions = product.variant_options?.data || [];
	const maxVariantOptions = 3;

	return (
		<Box title={__('Variants', 'surecart')} loading={loading}>
			<div>
				{variantOptions.length === 0 ? (
					<ScButton slot="trigger" onClick={() => setModal(true)}>
						<ScIcon name="plus" slot="prefix" />
						{__('Add Options Like Size or Color', 'surecart')}
					</ScButton>
				) : (
					<VariantOptions
						onRequestClose={() => setModal(false)}
						product={product}
						updateProduct={updateProduct}
					/>
				)}

				{variantOptions.length > 0 &&
					variantOptions.length < maxVariantOptions && (
						<div
							style={{
								marginTop: '2rem',
							}}
						>
							<ScButton
								slot="trigger"
								onClick={() => setModal(true)}
							>
								<ScIcon name="plus" slot="prefix" />
								{__('Add More Options', 'surecart')}
							</ScButton>
						</div>
					)}

				{!!modal && (
					<NewVariantOption
						id={product?.id}
						product={product}
						updateProduct={updateProduct}
						onSaveOption={(variantOption) => {
							setModal(false);
							if (!variantOption) return;

							setOptions(
								[...options, variantOption].sort(
									(a, b) => a.position - b.position
								)
							);
						}}
						onRequestClose={() => setModal(false)}
					/>
				)}
			</div>
		</Box>
	);
};
