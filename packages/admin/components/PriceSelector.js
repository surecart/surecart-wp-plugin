/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';

import { useState, useEffect, Fragment } from '@wordpress/element';
import SelectPrice from './SelectPrice';
import useEntities from '../mixins/useEntities';

export default ({ onSelect, ad_hoc, value, open = false, requestQuery }) => {
	const [query, setQuery] = useState(null);

	const { products, fetchProducts, isLoading } = useEntities('product');

	useEffect(() => {
		fetchProducts({
			query: {
				query,
				expand: ['prices'],
				...requestQuery,
			},
		});
	}, [query]);

	return (
		<Fragment>
			<SelectPrice
				required
				css={css`
					flex: 0 1 50%;
				`}
				value={value}
				ad_hoc={ad_hoc}
				open={open}
				products={products}
				onQuery={setQuery}
				onFetch={() => setQuery('')}
				loading={isLoading}
				onSelect={onSelect}
			/>
		</Fragment>
	);
};
