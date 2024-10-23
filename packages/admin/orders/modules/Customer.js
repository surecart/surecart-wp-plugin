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
		<Box title={__('Customer', 'surecart')} loading={loading}>
			<div
				css={css`
					display: grid;
					gap: 1em;
				`}
			>
				<ScLineItem>
					<a
						href={addQueryArgs('admin.php', {
							page: 'sc-customers',
							action: 'edit',
							id: customer?.id,
						})}
						slot="title"
					>
						{customer?.name || customer?.email}
					</a>
				</ScLineItem>

				{!!customer?.balances?.data?.length && (
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
