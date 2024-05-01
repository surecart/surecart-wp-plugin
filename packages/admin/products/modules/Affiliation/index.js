/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { select, useDispatch } from '@wordpress/data';
import { store as noticesStore } from '@wordpress/notices';
import { store as coreStore } from '@wordpress/core-data';
import apiFetch from '@wordpress/api-fetch';

import {
	ScButton,
	ScDropdown,
	ScIcon,
	ScMenu,
	ScMenuItem,
} from '@surecart/components-react';
import Box from '../../../ui/Box';
import Definition from '../../../ui/Definition';
import CommissionForm from '../../../components/affiliates/commission/CommissionForm';
import EmptyCommissions from '../../../components/affiliates/commission/EmptyCommissions';
import ConfirmDelete from './ConfirmDelete';

export default ({ product, loading, error }) => {
	const productId = product?.id;
	if (!productId) {
		return null;
	}

	const [modal, setModal] = useState(false);
	const [saving, setSaving] = useState(false);
	const { createSuccessNotice } = useDispatch(noticesStore);
	const { receiveEntityRecords } = useDispatch(coreStore);
	const [commissionStructure, setCommissionStructure] = useState(
		product.commission_structure
	);

	const handleSubmit = async (e, data, message) => {
		e?.preventDefault();
		e?.stopPropagation();

		try {
			const { baseURL } = select(coreStore).getEntityConfig(
				'surecart',
				'product'
			);

			setSaving(true);
			const productData = await apiFetch({
				path: `${baseURL}/${productId}`,
				method: 'PUT',
				data: {
					commission_structure: data,
				},
			});

			receiveEntityRecords(
				'surecart',
				'product',
				{
					...productData,
					commission_structure: productData?.commission_structure,
				},
				undefined,
				false,
				{
					commission_structure: productData?.commission_structure,
				}
			);

			setCommissionStructure(productData?.commission_structure);

			createSuccessNotice(message, {
				type: 'snackbar',
			});

			setModal(false);
		} catch (error) {
			console.error(error);
			// TODO: Remove this when API fixes.
			if (data === null) {
				setCommissionStructure(null);
				setModal(false);
			}
		} finally {
			setSaving(false);
		}
	};

	const onChange = async (data) => {
		setCommissionStructure(data?.commission_structure);
	};

	const onDelete = async (e) => {
		await handleSubmit(
			e,
			null,
			__('Custom Affiliate Commission deleted.', 'surecart')
		);
	};

	return (
		<>
			<Box
				title={__('Custom Affiliate Commission', 'surecart')}
				loading={loading || saving}
				header_action={
					commissionStructure?.id ? (
						<ScDropdown
							placement="bottom-end"
							css={css`
								height: 100%;
							`}
						>
							<ScButton slot="trigger" type="text" circle>
								<ScIcon name="more-horizontal" />
							</ScButton>
							<ScMenu>
								<ScMenuItem onClick={() => setModal('edit')}>
									<ScIcon name="edit" slot="prefix" />
									{__('Edit', 'surecart')}
								</ScMenuItem>
								<ScMenuItem onClick={() => setModal('delete')}>
									<ScIcon name="trash" slot="prefix" />
									{__('Delete', 'surecart')}
								</ScMenuItem>
							</ScMenu>
						</ScDropdown>
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

			{(modal === 'create' || modal === 'edit') && (
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
					onSubmit={(e) =>
						handleSubmit(
							e,
							commissionStructure,
							__('Custom Affiliate Commission saved.', 'surecart')
						)
					}
					onChange={onChange}
					affiliationItem={{
						commission_structure: commissionStructure,
					}}
					loading={loading || saving}
				/>
			)}

			<ConfirmDelete
				open={modal === 'delete'}
				onRequestClose={() => setModal(false)}
				onDelete={onDelete}
				deleting={loading | saving}
				error={error}
			/>
		</>
	);
};
