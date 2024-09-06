/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { useState } from '@wordpress/element';
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
	ScBlockUi,
} from '@surecart/components-react';
import Box from '../../ui/Box';
import AddressDisplay from '../../components/AddressDisplay';
import EditAddress from './EditAddress';
import { useInvoice } from '../hooks/useInvoice';

export default () => {
	const { checkout, loading, busy, isDraftInvoice, updateCheckout } =
		useInvoice();
	const [open, setOpen] = useState(false);

	const onChange = async (shipping_address) => {
		const data = await updateCheckout({
			shipping_address,
		});
		if (!!data) {
			setOpen(false);
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

			{busy && <ScBlockUi style={{ zIndex: 9 }} />}

			<EditAddress open={open} onRequestClose={() => setOpen(false)} />
		</>
	);
};
