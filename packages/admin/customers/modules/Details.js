/** @jsx jsx */
import { __ } from '@wordpress/i18n';

import Box from '../../ui/Box';
import {
	ScColumn,
	ScColumns,
	ScInput,
	ScTag,
} from '@surecart/components-react';
import { css, jsx } from '@emotion/core';

export default ({ customer, updateCustomer, loading }) => {
	return (
		<Box
			title={__('Customer Details', 'surecart')}
			loading={loading}
			header_action={
				customer?.id &&
				!customer?.live_mode && (
					<ScTag type="warning">{__('Test Mode', 'surecart')}</ScTag>
				)
			}
		>
			<div
				css={css`
					display: grid;
					gap: var(--sc-form-row-spacing);
				`}
			>
				<ScColumns>
					<ScColumn>
						<ScInput
							label={__('Name', 'surecart')}
							className="sc-customer-name"
							help={__('Your customers name.', 'surecart')}
							attribute="name"
							value={customer?.name}
							onScInput={(e) =>
								updateCustomer({ name: e.target.value })
							}
						/>
					</ScColumn>
					<ScColumn>
						<ScInput
							label={__('Email', 'surecart')}
							className="sc-customer-email"
							help={__(
								"Your customer's email address.",
								'surecart'
							)}
							value={customer?.email}
							name="email"
							required
							onScInput={(e) =>
								updateCustomer({ email: e.target.value })
							}
						/>
					</ScColumn>
				</ScColumns>
			</div>
		</Box>
	);
};
