/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies.
 */
import { ScButton, ScIcon } from '@surecart/components-react';
import Definition from '../../ui/Definition';
import CommissionForm from '../../components/affiliates/commission/CommissionForm';
import EmptyCommissions from '../../components/affiliates/commission/EmptyCommissions';
import Box from '../../ui/Box';

export default ({ affiliation, updateAffiliation, loading, error }) => {
	const [modal, setModal] = useState(false);

	const onChange = (data) => {
		updateAffiliation({
			commission_structure: data?.commission_structure || {},
		});
	};

	const { commission_structure: commissionStructure } = affiliation || {};

	return (
		<>
			<Box
				title={__('Custom Commission', 'surecart')}
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
					<EmptyCommissions
						message={__(
							'Add custom commission for this affiliate.',
							'surecart'
						)}
						openModal={() => setModal('create')}
					/>
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
