/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { Fragment, useState, useEffect } from '@wordpress/element';
import { __, _n } from '@wordpress/i18n';
import { getQueryArg } from '@wordpress/url';

import Box from '../ui/Box';
import useCustomerData from './hooks/useCustomerData';
import User from './modules/User';

export default () => {
	const { customer, error, loading, save } = useCustomerData();
	const [customerId, setCustomerId] = useState(
		getQueryArg(window.location, 'id')
	);

	useEffect(() => {
		if (customer?.id && customer?.id !== customerId) {
			setCustomerId(customer.id);
		}
	}, [customer]);

	return (
		<Fragment>
			{customerId && (
				<Box
					title={
						<div
							css={css`
								display: flex;
								align-items: center;
								justify-content: space-between;
							`}
						>
							{__('WordPress User', 'checkout_engine')}
						</div>
					}
					css={css`
						font-size: 14px;
					`}
				>
					<Fragment>
						<User customer_id={customerId} />
					</Fragment>
				</Box>
			)}
		</Fragment>
	);
};
