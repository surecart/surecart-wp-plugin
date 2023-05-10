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
import ShippingRateCondition from './ShippingRateCondition';
import { useState } from '@wordpress/element';
import { useDispatch } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import Error from '../../../components/Error';

export default ({ shippingZone, onEditZone, onAddRate, parentBusy }) => {
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState(null);

	const { deleteEntityRecord, invalidateResolutionForStore } =
		useDispatch(coreStore);

	const onRemoveShippingRate = async (shippingRateId) => {
		try {
			setBusy(true);
			await deleteEntityRecord(
				'surecart',
				'shipping-rate',
				shippingRateId
			);
			await invalidateResolutionForStore();
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
				<strong>{shippingZone.name}</strong>
				<ScButton type="text" onClick={onEditZone}>
					Edit Zone
				</ScButton>
			</ScFlex>
			<Error error={error} setError={setError} />
			{renderShippingRates(shippingZone?.shipping_rates)}
			<ScButton onClick={onAddRate}>
				<ScIcon name="plus" /> Add Rate
			</ScButton>
			{(busy || parentBusy) && (
				<ScBlockUi
					style={{ '--sc-block-ui-opacity': '0.75' }}
					spinner
				/>
			)}
		</ScCard>
	);
};
