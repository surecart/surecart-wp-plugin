/** @jsx jsx */
import Box from '../../ui/Box';
import { css, jsx } from '@emotion/core';
import {
	ScButton,
	ScDivider,
	ScFormatNumber,
	ScLineItem,
} from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';

export default ({ customer, loading }) => {
	return (
		<Box
			title={__('Customer', 'surecart')}
			loading={loading}
			footer={
				<div>
					<ScButton
						size="small"
						href={addQueryArgs('admin.php', {
							page: 'sc-customers',
							action: 'edit',
							id: customer?.id,
						})}
					>
						{__('Edit Customer', 'surecart')}
					</ScButton>
				</div>
			}
		>
			<div
				css={css`
					display: grid;
					gap: 1em;
				`}
			>
				<ScLineItem>
					<span slot="title">{customer?.name}</span>
					<span slot="description">{customer?.email}</span>
				</ScLineItem>

				{customer?.balances?.data?.length && (
					<>
						<ScDivider style={{ '--spacing': '0.5em' }} />
						<ScLineItem>
							<span slot="title">
								{__('Credit Balance', 'surecart')}
							</span>
							<span slot="price">
								{customer?.balances?.data.map(
									({ amount, currency }) => {
										return (
											<ScFormatNumber
												type="currency"
												currency={currency}
												value={-amount}
											/>
										);
									}
								)}
							</span>
						</ScLineItem>
					</>
				)}
			</div>
		</Box>
	);
};
