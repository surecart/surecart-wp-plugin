/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import {
	ScButton,
	ScCard,
	ScEmpty,
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
} from '@surecart/components-react';
import ShippingRateCondition from '../rate/ShippingRateCondition';
import { useState } from '@wordpress/element';
import { useDispatch } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { store as noticeStore } from '@wordpress/notices';
import Error from '../../../components/Error';
import ShippingRateForm from '../rate/ShippingRateForm';

const modals = {
	ADD_RATE: 'add_shipping_rate',
	EDIT_RATE: 'edit_shipping_rate',
};

export default ({ shippingZone, onEditZone, parentBusy, isFallback }) => {
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState(null);
	const [currentModal, setCurrentModal] = useState('');
	const [selectedShippingRate, setSelectedShippingRate] = useState(null);

	const { deleteEntityRecord, invalidateResolutionForStore } =
		useDispatch(coreStore);
	const { createSuccessNotice } = useDispatch(noticeStore);

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
				<ScEmpty>{__('No shipping rates present', 'surecart')}</ScEmpty>
			);
		}

		return (
			<ScTable>
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
										<ScIcon slot="prefix" name="edit" />
										{__('Edit', 'surecart')}
									</ScMenuItem>
									<ScMenuItem
										onClick={() =>
											onRemoveShippingRate(
												shippingRate.id
											)
										}
									>
										<ScIcon slot="prefix" name="trash" />
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
		<ScCard
			key={shippingZone.id}
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
				<ScButton type="text" onClick={onEditZone}>
					{__('Edit Zone', 'surecart')}
				</ScButton>
			</ScFlex>
			<Error error={error} setError={setError} />
			{renderShippingRates(shippingZone?.shipping_rates)}
			<ScButton onClick={() => setCurrentModal(modals.ADD_RATE)}>
				<ScIcon name="plus" /> {__('Add Rate', 'surecart')}
			</ScButton>
			{(busy || parentBusy) && (
				<ScBlockUi
					style={{ '--sc-block-ui-opacity': '0.75' }}
					spinner
				/>
			)}

			{currentModal === modals.ADD_RATE ||
			currentModal === modals.EDIT_RATE ? (
				<ShippingRateForm
					onRequestClose={() => {
						setCurrentModal('');
						setSelectedShippingRate();
					}}
					isEdit={currentModal === modals.EDIT_RATE}
					shippingZoneId={shippingZone?.id}
					selectedShippingRate={selectedShippingRate}
				/>
			) : null}
		</ScCard>
	);
};
