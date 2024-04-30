/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

import { ScButton, ScIcon } from '@surecart/components-react';
import Box from '../../../ui/Box';
import Definition from '../../../ui/Definition';
import CommissionForm from '../../../components/affiliates/commission/CommissionForm';
import EmptyCommissions from '../../../components/affiliates/commission/EmptyCommissions';

export default ({ product, updateProduct, loading, error }) => {
	const productId = product?.id;
	if (!productId) {
		return null;
	}

	const [modal, setModal] = useState(false);

	const onChange = (data) => {
		updateProduct({
			commission_structure: {
				...product?.commission_structure,
				...data?.commission_structure,
			},
		});
	};

	const { commission_structure: commissionStructure } = product || {};

	return (
		<>
			<Box
				title={__('Custom Affiliate Commission', 'surecart')}
				loading={loading}
				header_action={
					commissionStructure?.id ? (
						<ScButton type="text" onClick={() => setModal('edit')}>
							<ScIcon
								name="edit"
								title={__('Edit', 'surecart')}
							/>
						</ScButton>
					) : null
				}
			>
				{commissionStructure?.id ? (
					<>
						<Definition title={__('Commission', 'surecart')}>
							{commissionStructure.discount_amount}
						</Definition>
						<Definition
							title={__(
								'Subscription Commission Duration',
								'surecart'
							)}
						>
							{commissionStructure.subscription_commission || '-'}
						</Definition>
						<Definition
							title={__(
								'Lifetime Commission Duration',
								'surecart'
							)}
						>
							{commissionStructure.lifetime_commission || '-'}
						</Definition>
					</>
				) : (
					<EmptyCommissions openModal={() => setModal('create')} />
				)}
			</Box>

			{!!modal && (
				<CommissionForm
					title={
						commissionStructure?.id
							? __('Edit Commission', 'surecart')
							: __('Add Commission', 'surecart')
					}
					submitButtonTitle={__('Save', 'surecart')}
					error={error}
					open={modal === 'create' || modal === 'edit'}
					onRequestClose={() => setModal(false)}
					onSubmit={() => setModal(false)}
					onChange={onChange}
					affiliationItem={{
						commission_structure: commissionStructure,
					}}
					loading={loading}
				/>
			)}
		</>
	);
};
