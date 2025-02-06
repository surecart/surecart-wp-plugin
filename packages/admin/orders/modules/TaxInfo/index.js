import { __, _n } from '@wordpress/i18n';

/**
 * External dependencies.
 */
import { store as coreStore } from '@wordpress/core-data';
import { useState } from '@wordpress/element';
import { useDispatch } from '@wordpress/data';
import { store as noticesStore } from '@wordpress/notices';

/**
 * Internal dependencies.
 */
import {
	ScButton,
	ScDropdown,
	ScIcon,
	ScLineItem,
	ScMenu,
	ScMenuItem,
	ScTag,
} from '@surecart/components-react';
import Box from '../../../ui/Box';
import EditTaxInfo from './EditTaxInfo';
import Confirm from '../../../components/confirm';

export default ({ loading, checkout, onManuallyRefetchOrder }) => {
	const [modal, setModal] = useState(false);
	const [error, setError] = useState(false);
	const [busy, setBusy] = useState(false);
	const { saveEntityRecord } = useDispatch(coreStore);
	const { createSuccessNotice } = useDispatch(noticesStore);

	const zones = {
		ca_gst: __('CA GST', 'surecart'),
		au_abn: __('AU ABN', 'surecart'),
		gb_vat: __('UK VAT', 'surecart'),
		eu_vat: __('EU VAT', 'surecart'),
		other: __('Other', 'surecart'),
	};

	const onSubmit = async (taxIdentifier) => {
		try {
			setError(false);
			setBusy(true);

			// Update the tax on the checkout.
			await saveEntityRecord(
				'surecart',
				'checkout',
				{
					id: checkout?.id,
					tax_identifier: taxIdentifier,
				},
				{
					throwOnError: true,
				}
			);

			const message =
				taxIdentifier === null
					? __('Tax information deleted.', 'surecart')
					: __('Tax information updated.', 'surecart');

			createSuccessNotice(message, {
				type: 'snackbar',
			});
			await onManuallyRefetchOrder();
			setModal(false);
		} catch (e) {
			console.error(e);
			setError(e);
		} finally {
			setBusy(false);
		}
	};

	const renderTaxInfo = () => {
		if (!checkout?.tax_identifier) {
			return null;
		}

		return (
			<>
				<ScLineItem>
					<span slot="title">{__('Tax Number', 'surecart')}</span>
					<span slot="price">
						{checkout?.tax_identifier?.number || '-'}
					</span>
				</ScLineItem>
				<ScLineItem>
					<span slot="title">{__('Number Type', 'surecart')}</span>
					<span slot="price">
						{zones?.[checkout?.tax_identifier?.number_type] || '-'}
					</span>
				</ScLineItem>
				{checkout?.tax_identifier?.number_type === 'eu_vat' && (
					<ScLineItem>
						<span slot="title">{__('Validity', 'surecart')}</span>
						{checkout?.tax_identifier?.valid_eu_vat ? (
							<ScTag slot="price">
								{__('Valid', 'surecart')}
							</ScTag>
						) : checkout?.tax_identifier?.eu_vat_verified ? (
							<ScTag slot="price" type="danger">
								{__('Invalid', 'surecart')}
							</ScTag>
						) : (
							<ScTag slot="price" type="warning">
								{__('Unverified', 'surecart')}
							</ScTag>
						)}
					</ScLineItem>
				)}
			</>
		);
	};

	return (
		<>
			<Box
				title={__('Tax Information', 'surecart')}
				loading={loading}
				header_action={
					!!checkout?.tax_identifier && (
						<ScDropdown placement="bottom-end">
							<ScButton
								circle
								type="text"
								style={{
									'--button-color':
										'var(--sc-color-gray-600)',
									margin: '-10px',
								}}
								slot="trigger"
							>
								<ScIcon name="more-horizontal" />
							</ScButton>
							<ScMenu>
								<ScMenuItem onClick={() => setModal('edit')}>
									<ScIcon
										slot="prefix"
										name="edit"
										style={{
											opacity: 0.5,
										}}
									/>
									{__('Edit', 'surecart')}
								</ScMenuItem>
								<ScMenuItem onClick={() => setModal('delete')}>
									<ScIcon
										slot="prefix"
										name="trash"
										style={{
											opacity: 0.5,
										}}
									/>
									{__('Clear', 'surecart')}
								</ScMenuItem>
							</ScMenu>
						</ScDropdown>
					)
				}
				footer={
					!loading &&
					!checkout?.tax_identifier && (
						<ScButton onClick={() => setModal('edit')}>
							<ScIcon name="plus" slot="prefix" />
							{__('Add Tax Information', 'surecart')}
						</ScButton>
					)
				}
			>
				{renderTaxInfo()}
			</Box>
			<EditTaxInfo
				open={modal === 'edit'}
				onRequestClose={() => setModal(false)}
				checkout={checkout}
				onSubmit={onSubmit}
				busy={busy}
				error={error}
				setError={setError}
			/>
			<Confirm
				open={modal === 'delete'}
				onRequestClose={() => setModal(false)}
				onConfirm={() => onSubmit(null)}
				loading={loading || busy}
				error={error}
			>
				{__('Are you sure? This cannot be undone.', 'surecart')}
			</Confirm>
		</>
	);
};
