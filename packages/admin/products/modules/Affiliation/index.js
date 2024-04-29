/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { store as noticesStore } from '@wordpress/notices';

import { ScButton, ScIcon } from '@surecart/components-react';
import Box from '../../../ui/Box';
import EmptyCommissions from '../../../affiliations/modules/affiliation-products/EmptyCommissions';
import useSave from '../../../settings/UseSave';
import Definition from '../../../ui/Definition';
import CommissionForm from '../../../components/affiliates/commission/CommissionForm';

export default ({ productId, loading }) => {
	const [modal, setModal] = useState(false);
	const [error, setError] = useState(null);
	const page = 1;
	const perPage = 1;

	const { save } = useSave();
	const { editEntityRecord, saveEntityRecord } = useDispatch(coreStore);
	const { createSuccessNotice } = useDispatch(noticesStore);
	const [saving, setSaving] = useState(false);
	const [data, setData] = useState(null);

	const { affiliationProduct, fetching } = useSelect(
		(select) => {
			const queryArgs = [
				'surecart',
				'affiliation-product',
				{
					context: 'edit',
					product_ids: [productId],
					page,
					per_page: perPage,
					expand: ['commission_structure'],
				},
			];
			const affiliationProducts =
				select(coreStore).getEntityRecords(...queryArgs) || [];
			const fetching = select(coreStore).isResolving(
				'getEntityRecords',
				queryArgs
			);

			return {
				affiliationProduct: affiliationProducts?.[0],
				fetching,
			};
		},
		[productId, page]
	);

	// Run a selector to get the affiliation product data for edit.
	// So that we can use editEntityRecord to save the data.
	useSelect(
		(select) => {
			if (!affiliationProduct?.id) {
				return {};
			}

			const entityData = [
				'surecart',
				'affiliation-product',
				affiliationProduct?.id,
			];
			return {
				affiliationProductEdited: select(coreStore).getEntityRecord(
					...entityData
				),
			};
		},
		[affiliationProduct?.id]
	);

	const onCreate = async () => {
		try {
			setError(null);
			setSaving(true);

			await saveEntityRecord('surecart', 'affiliation-product', data, {
				throwOnError: true,
			});

			createSuccessNotice(
				__('Affiliate product commission created.', 'surecart'),
				{
					type: 'snackbar',
				}
			);

			setModal(false);
		} catch (error) {
			console.error('error', error);
			setError(error);
		} finally {
			setSaving(false);
		}
	};

	const onEdit = async () => {
		try {
			setError(null);
			setSaving(true);

			await editEntityRecord(
				'surecart',
				'affiliation-product',
				affiliationProduct?.id,
				data
			);

			await save({
				successMessage: __(
					'Affiliate product commission updated.',
					'surecart'
				),
			});

			setModal(false);
		} catch (error) {
			console.error('error', error);
			setError(error);
		} finally {
			setSaving(false);
		}
	};

	const onSubmit = async (e) => {
		e.preventDefault();
		e.stopImmediatePropagation();
		affiliationProduct?.id ? await onEdit() : await onCreate();
	};

	const onChange = (data) => setData(data);

	const { commission_structure: commissionStructure } =
		data || affiliationProduct || {};

	return (
		<>
			<Box
				title={__('Custom Affiliate Commission', 'surecart')}
				loading={loading || fetching}
				header_action={
					affiliationProduct ? (
						<ScButton
							type="text"
							onClick={() => setModal('create')}
						>
							<ScIcon
								name="edit"
								title={__('Edit', 'surecart')}
							/>
						</ScButton>
					) : null
				}
			>
				{affiliationProduct ? (
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
					<EmptyCommissions openModal={() => setModal(true)} />
				)}
			</Box>

			{modal && (
				<CommissionForm
					title={
						affiliationProduct?.id
							? __('Edit Commission', 'surecart')
							: __('Add Commission', 'surecart')
					}
					error={error}
					open={modal === 'create' || modal === 'edit'}
					id={affiliationProduct?.id}
					onRequestClose={() => setModal(false)}
					onSubmit={onSubmit}
					onChange={onChange}
					affiliationItem={affiliationProduct}
					loading={saving || loading}
				/>
			)}
		</>
	);
};
