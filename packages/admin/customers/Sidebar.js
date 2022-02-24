/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { Fragment } from '@wordpress/element';
import { __, _n } from '@wordpress/i18n';

import Box from '../ui/Box';
import Notifications from './modules/Notifications';
import Purchases from './modules/Purchases';
import User from './modules/User';

export default ({ id, customer, updateCustomer, loading }) => {
	return (
		<div
			css={css`
				display: grid;
				gap: var(--ce-spacing-xxx-large);
			`}
		>
			{id && (
				<Fragment>
					<Purchases />
					<Box
						title={__('WordPress User', 'checkout_engine')}
						css={css`
							font-size: 14px;
						`}
						loading={loading}
					>
						<Fragment>
							<User customer={customer} customer_id={id} />
						</Fragment>
					</Box>
					<Box
						title={__('Notifications', 'checkout_engine')}
						css={css`
							font-size: 14px;
						`}
						loading={loading}
					>
						<Notifications
							customer={customer}
							updateCustomer={updateCustomer}
							loading={loading}
						/>
					</Box>
				</Fragment>
			)}
		</div>
	);
};
