/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';

import { useState } from '@wordpress/element';
import SelectPrice from './SelectPrice';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';

export default ({ onSelect, ad_hoc, value, open = false }) => {
	const [query, setQuery] = useState(null);

	const { products, loading } = useSelect(
		(select) => {
			const queryArgs = [
				'surecart',
				'product',
				{ search: query, expand: ['prices'] },
			];
			return {
				products: select(coreStore).getEntityRecords(...queryArgs),
				loading: select(coreStore).isResolving(
					'getEntityRecords',
					queryArgs
				),
			};
		},
		[query]
	);

	return (
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
			loading={loading}
			onSelect={onSelect}
		/>
	);
};
