/** @jsx jsx */
import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import { throttle } from 'lodash';
import { addQueryArgs } from '@wordpress/url';
import apiFetch from '@wordpress/api-fetch';

import Box from '../../ui/Box';
import { ScInput, ScSelect } from '@surecart/components-react';
import { css, jsx } from '@emotion/core';

export default ({ coupon, updateCoupon, loading }) => {
	const [fetching, setFetching] = useState(false);
	const [affiliates, setAffiliates] = useState([]);
	const [query, setQuery] = useState(null);

	useEffect(() => {
		fetchAffiliates();
	}, [query]);

	const findUser = throttle(
		(query) => {
			setQuery(query);
		},
		750,
		{ leading: false }
	);

	const fetchAffiliates = async () => {
		try {
			setFetching(true);
			const response = await apiFetch({
				url: addQueryArgs(ajaxurl, {
					action: 'affwp_search_users',
					term: query,
					status: 'active',
				}),
			});
			if (response.length) {
				setAffiliates(
					response.map((response) => {
						return {
							value: response?.user_id,
							label: response?.label,
						};
					})
				);
			}
		} catch (e) {
			console.error(e);
		} finally {
			setFetching(false);
		}
	};

	return (
		<Box title={__('AffiliateWP', 'surecart')} loading={loading}>
			<ScSelect
				label={__('Affiliate', 'surecart')}
				loading={fetching}
				placeholder={__('Select an affiliate', 'surecart')}
				searchPlaceholder={__('Search for an affiliate...', 'surecart')}
				search
				help={__(
					'If you would like to connect this discount to an affiliate, enter the name of the affiliate it belongs to.',
					'surecart'
				)}
				onScSearch={(e) => findUser(e.detail)}
				onScChange={(e) => onSelect(e.target.value)}
				choices={affiliates}
			/>
		</Box>
	);
};
