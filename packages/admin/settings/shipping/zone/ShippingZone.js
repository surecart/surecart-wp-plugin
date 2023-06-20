/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import {
	ScButton,
	ScCard,
	ScFlex,
	ScFormatNumber,
	ScIcon,
	ScTable,
	ScTableCell,
	ScTableRow,
	ScDropdown,
	ScMenu,
	ScMenuItem,
	ScBlockUi,
	ScAlert,
	ScDialog,
} from '@surecart/components-react';
import ShippingRateCondition from '../rate/ShippingRateCondition';
import { useState } from '@wordpress/element';
import { useDispatch } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { store as noticeStore } from '@wordpress/notices';
import Error from '../../../components/Error';
import AddShippingRate from '../rate/AddShippingRate';
import EditShippingRate from '../rate/EditShippingRate';

const modals = {
	ADD_RATE: 'add_shipping_rate',
	EDIT_RATE: 'edit_shipping_rate',
	CONFIRM_DELETE_ZONE: 'confirm_delete_zone',
};

export default ({ shippingZone, onEditZone, parentBusy, isFallback }) => {
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState(null);
	const [currentModal, setCurrentModal] = useState('');
	const [selectedShippingRate, setSelectedShippingRate] = useState(null);

	const { deleteEntityRecord, invalidateResolutionForStore } =
		useDispatch(coreStore);
	const { createSuccessNotice } = useDispatch(noticeStore);

	const onDeleteShippingZone = async () => {
		setCurrentModal(false);
		setBusy(true);
		try {
			await deleteEntityRecord(
				'surecart',
				'shipping-zone',
				shippingZone.id,
				{
					throwOnError: true,
				}
			);
			createSuccessNotice(__('Shipping zone deleted', 'surecart'), {
				type: 'snackbar',
			});
		} catch (error) {
			console.error(error);
			setError(error);
		} finally {
			setBusy(false);
		}
	};

	const onRemoveShippingRate = async (shippingRateId) => {
		try {
			setBusy(true);
			await deleteEntityRecord(
				'surecart',
				'shipping-rate',
				shippingRateId,
				{ throwOnError: true }
			);
			await invalidateResolutionForStore();
			createSuccessNotice(__('Shipping rate deleted', 'surecart'), {
				type: 'snackbar',
			});
		} catch (error) {
			setError(error);
		} finally {
			setBusy(false);
		}
	};

	const renderShippingRates = (shippingRates) => {
		if (!shippingRates?.data?.length) {
			return (
				<ScAlert
					type="warning"
					open
					title={__('No shipping rates', 'surecart')}
				>
					{__(
						"Customers won't be able to complete checkout for products in this zone.",
						'surecart'
					)}
				</ScAlert>
			);
		}

		return (
			<ScTable
				css={css`
					border: 1px solid
						var(--sc-card-border-color, var(--sc-color-gray-300));
				`}
			>
				<ScTableCell slot="head">{__('Name', 'surecart')}</ScTableCell>
				<ScTableCell slot="head">
					{__('Condition', 'surecart')}
				</ScTableCell>
				<ScTableCell slot="head">{__('Price', 'surecart')}</ScTableCell>
				<ScTableCell slot="head"></ScTableCell>
				{shippingRates?.data?.map((shippingRate) => (
					<ScTableRow href="#" key={shippingRate.id}>
						<ScTableCell>
							{shippingRate.shipping_method?.name}
						</ScTableCell>
						<ScTableCell>
							<ShippingRateCondition
								shippingRate={shippingRate}
							/>
						</ScTableCell>
						<ScTableCell>
							<ScFormatNumber
								value={shippingRate.amount}
								type="currency"
								currency={shippingRate.currency}
							/>
						</ScTableCell>
						<ScTableCell>
							<ScDropdown placement="bottom-end">
								<ScButton type="text" slot="trigger" circle>
									<ScIcon name="more-horizontal" />
								</ScButton>
								<ScMenu>
									<ScMenuItem
										onClick={() => {
											setSelectedShippingRate(
												shippingRate
											);
											setCurrentModal(modals.EDIT_RATE);
										}}
									>
										<ScIcon
											slot="prefix"
											name="edit"
											css={css`
												opacity: 0.5;
											`}
										/>
										{__('Edit', 'surecart')}
									</ScMenuItem>
									<ScMenuItem
										onClick={() =>
											onRemoveShippingRate(
												shippingRate.id
											)
										}
									>
										<ScIcon
											slot="prefix"
											name="trash"
											css={css`
												opacity: 0.5;
											`}
										/>
										{__('Remove', 'surecart')}
									</ScMenuItem>
								</ScMenu>
							</ScDropdown>
						</ScTableCell>
					</ScTableRow>
				))}
			</ScTable>
		);
	};

	return (
		<>
			<ScCard
				css={css`
					position: relative;
				`}
			>
				<ScFlex justifyContent="space-between">
					<div>
						<strong
							css={css`
								margin-right: var(--sc-spacing-small);
							`}
						>
							{shippingZone.name}
						</strong>
						{isFallback && (
							<sc-tag type="success" size="medium">
								{__('Fallback', 'surecart')}
							</sc-tag>
						)}
					</div>
					<ScDropdown placement="bottom-end">
						<ScButton
							type="text"
							slot="trigger"
							size="small"
							circle
						>
							<ScIcon name="more-horizontal" />
						</ScButton>
						<ScMenu>
							<ScMenuItem onClick={onEditZone}>
								<ScIcon
									slot="prefix"
									name="edit"
									css={css`
										opacity: 0.5;
									`}
								/>
								{__('Edit', 'surecart')}
							</ScMenuItem>
							<ScMenuItem
								onClick={() =>
									setCurrentModal(modals.CONFIRM_DELETE_ZONE)
								}
							>
								<ScIcon
									slot="prefix"
									name="trash"
									css={css`
										opacity: 0.5;
									`}
								/>
								{__('Delete', 'surecart')}
							</ScMenuItem>
						</ScMenu>
					</ScDropdown>
				</ScFlex>
				<Error error={error} setError={setError} />
				{renderShippingRates(shippingZone?.shipping_rates)}
				<ScButton onClick={() => setCurrentModal(modals.ADD_RATE)}>
					<ScIcon name="plus" slot="prefix" />
					{__('Add Rate', 'surecart')}
				</ScButton>
				{(busy || parentBusy) && (
					<ScBlockUi
						style={{ '--sc-block-ui-opacity': '0.75' }}
						spinner
					/>
				)}
			</ScCard>

			<AddShippingRate
				open={currentModal === modals.ADD_RATE}
				shippingZoneId={shippingZone?.id}
				onRequestClose={() => {
					setCurrentModal('');
					setSelectedShippingRate();
				}}
			/>

			<EditShippingRate
				open={currentModal === modals.EDIT_RATE}
				onRequestClose={() => {
					setCurrentModal('');
					setSelectedShippingRate();
				}}
				shippingZoneId={shippingZone?.id}
				selectedShippingRate={selectedShippingRate}
			/>

			<ScDialog
				label={__('Are you sure?', 'surecart')}
				open={currentModal === modals.CONFIRM_DELETE_ZONE}
			>
				{__('This action cannot be undone.', 'surecart')}
				<ScButton
					type="text"
					slot="footer"
					onClick={() => setCurrentModal(false)}
				>
					{__('Cancel', 'surecart')}
				</ScButton>
				<ScButton
					type="primary"
					slot="footer"
					onClick={onDeleteShippingZone}
				>
					{__('Delete', 'surecart')}
				</ScButton>
			</ScDialog>
		</>
	);
};
