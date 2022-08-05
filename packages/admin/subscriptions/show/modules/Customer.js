/** @jsx jsx */
import Box from '../../../ui/Box';
import { css, jsx } from '@emotion/core';
import {
	ScButton,
	ScDivider,
	ScFormatNumber,
	ScLineItem,
	ScText,
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

				<ScDivider style={{ '--spacing': '0.5em' }} />

				<ScLineItem>
					<span slot="title">{__('Balances', 'surecart')}</span>

					<div slot="price">
						<div>
							<ScFormatNumber type="currency" value={1234} />
						</div>
						<div>
							<ScFormatNumber
								type="currency"
								currency="eur"
								value={1234}
							/>
						</div>
					</div>
				</ScLineItem>
				{customer?.balances?.data && (
					<ScLineItem>
						<span slot="title">{__('Balance', 'surecart')}</span>
						<span slot="price">
							{JSON.stringify(customer?.balances?.data)}
						</span>
					</ScLineItem>
				)}
			</div>
		</Box>
	);
};
