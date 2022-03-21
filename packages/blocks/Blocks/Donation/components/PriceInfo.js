/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { Spinner, Button } from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { translate } from '@scripts/admin/util';

export default ({ price_id }) => {
	const [price, setPrice] = useState(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		fetchPrice();
	}, [price_id]);

	const fetchPrice = async () => {
		// fetch price from server.
		try {
			setLoading(true);
			const response = await apiFetch({
				path: `/surecart/v1/prices/${price_id}`,
			});
			setPrice(response);
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return <Spinner />;
	}

	if (!price) {
		return null;
	}

	return (
		<div>
			<h2
				css={css`
					margin-top: 0;
				`}
			>
				{price.product.name} - {price.name}
			</h2>
			<p>
				<sc-format-number
					type="currency"
					currency={price.currency}
					value={price.amount}
				></sc-format-number>{' '}
				{price?.recurring && price?.recurring_interval ? '/' : ''}{' '}
				{translate(price?.recurring_interval) || ''}
			</p>
			<Button isSecondary>Edit Product</Button>
		</div>
	);
};
