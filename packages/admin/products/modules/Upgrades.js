/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { __ } from '@wordpress/i18n';
import { FormTokenField } from '@wordpress/components';

import Box from '../../ui/Box';
import { useEffect, useState } from 'react';
import SelectProductGroup from '../../components/SelectProductGroup';
import useEntities from '../../mixins/useEntities';

export default ({ loading, product, updateProduct }) => {
	const onNew = () => {
		console.log('new');
	};

	const [query, setQuery] = useState(null);
	const { product_groups, fetchProductgroups, isLoading } =
		useEntities('product_group');

	useEffect(() => {
		fetchProductgroups({
			query: {
				query,
			},
		});
	}, [query]);

	const onSelect = (product_group) => {
		updateProduct({
			product_group,
		});
		console.log(product_group);
	};

	return (
		<Box title={__('Upgrade Group', 'checkout_engine')} loading={loading}>
			<SelectProductGroup
				required
				css={css`
					flex: 0 1 50%;
				`}
				help={__(
					'Add this product to a group with others you want the purchaser to switch between.',
					'checkout_engine'
				)}
				value={product?.product_group}
				groups={product_groups}
				onQuery={setQuery}
				onFetch={() => setQuery('')}
				loading={isLoading}
				onSelect={onSelect}
				onNew={onNew}
			/>
		</Box>
	);
};
