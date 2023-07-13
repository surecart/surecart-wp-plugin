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

export default ({ product, updateProduct, loading }) => {
	const [modal, setModal] = useState(false);

	return (
		<Box title={__('Variants', 'surecart')} loading={loading}>
			<div>
				<ScButton slot="trigger" onClick={() => setModal(true)}>
					<ScIcon name="plus" slot="prefix" />
					{__('Add Options Like Size or Color', 'surecart')}
				</ScButton>

				{!!modal && (
					<NewVariantOption
						id={product?.id}
						onRequestClose={() => setModal(false)}
					/>
				)}
			</div>
		</Box>
	);
};
