/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import { useState, useEffect } from '@wordpress/element';
import { store as coreStore } from '@wordpress/core-data';
import { select } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import {
	ScButton,
	ScIcon,
	ScDropdown,
	ScMenu,
	ScMenuItem,
} from '@surecart/components-react';
import Box from '../../ui/Box';
import expand from '../checkout-query';
import AddressDisplay from '../../components/AddressDisplay';
import EditAddress from './EditAddress';

export default ({
	invoice,
	checkout,
	loading,
	busy,
	setBusy,
	onUpdateInvoiceEntityRecord,
}) => {
	const isDraftInvoice = invoice?.status === 'draft';
	const [open, setOpen] = useState(false);

	const onChange = async (shipping_address) => {
		try {
			setBusy(true);
			// get the line items endpoint.
			const { baseURL } = select(coreStore).getEntityConfig(
				'surecart',
				'draft-checkout'
			);

			const data = await apiFetch({
				method: 'PATCH',
				path: addQueryArgs(`${baseURL}/${checkout?.id}`, { expand }),
				data: {
					shipping_address,
				},
			});

			onUpdateInvoiceEntityRecord({
				...invoice,
				checkout: data,
			});

			setOpen(false);
		} catch (e) {
			console.error(e);
			setError(e);
		} finally {
			setBusy(false);
		}
	};

	return (
		<>
			<Box
				title={__('Shipping & Tax Address', 'surecart')}
				loading={loading}
				footer={
					!loading &&
					!checkout?.shipping_address?.id &&
					isDraftInvoice && (
						<ScButton onClick={() => setOpen(true)}>
							{__('Add A Shipping Address', 'surecart')}
						</ScButton>
					)
				}
			>
				{!!checkout?.shipping_address?.id && (
					<div
						css={css`
							display: flex;
							justify-content: space-between;
						`}
					>
						<AddressDisplay address={checkout?.shipping_address} />

						{isDraftInvoice && (
							<ScDropdown placement="bottom-end">
								<ScButton slot="trigger" type="text" circle>
									<ScIcon name="more-horizontal" />
								</ScButton>
								<ScMenu>
									<ScMenuItem onClick={() => setOpen(true)}>
										{__('Edit', 'surecart')}
									</ScMenuItem>
									<ScMenuItem onClick={() => onChange(null)}>
										{__('Delete', 'surecart')}
									</ScMenuItem>
								</ScMenu>
							</ScDropdown>
						)}
					</div>
				)}
			</Box>

			<EditAddress open={open} onRequestClose={() => setOpen(false)} />
		</>
	);
};
