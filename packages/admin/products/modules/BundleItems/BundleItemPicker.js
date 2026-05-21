/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { ScButton, ScIcon } from '@surecart/components-react';

import SelectModel from '../../../components/SelectModel';

export default ({ excludeIds, onSelect, disabled }) => {
	const [query, setQuery] = useState(null);

	const { products, loading } = useSelect(
		(select) => {
			const args = [
				'surecart',
				'product',
				{
					context: 'edit',
					bundle: false,
					per_page: 100,
					...(query ? { query } : {}),
				},
			];
			return {
				products: select(coreStore).getEntityRecords(...args) || [],
				loading: select(coreStore).isResolving(
					'getEntityRecords',
					args
				),
			};
		},
		[query]
	);

	const eligible = products.filter((p) => !excludeIds.includes(p?.id));
	const choices = eligible.map((p) => ({
		label: p.name,
		value: p.id,
	}));

	const handleSelect = (value) => {
		if (!value) return;
		const full = eligible.find((p) => p?.id === value);
		onSelect(value, full);
	};

	return (
		<div
			css={css`
				width: 22rem;
			`}
		>
			<SelectModel
				choices={choices}
				value=""
				loading={loading}
				disabled={disabled}
				onQuery={setQuery}
				onFetch={() => setQuery('')}
				onSelect={handleSelect}
				searchPlaceholder={__('Search for a product…', 'surecart')}
			>
				<ScButton slot="trigger">
					<ScIcon name="plus" slot="prefix" />
					{__('Add Product', 'surecart')}
				</ScButton>
			</SelectModel>
		</div>
	);
};
