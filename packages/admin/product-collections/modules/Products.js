/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { select, useDispatch } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import {
	ScButton,
	ScButtonGroup,
	ScCard,
	ScIcon,
	ScStackedList,
	ScStackedListRow,
	ScTag,
} from '@surecart/components-react';
import apiFetch from '@wordpress/api-fetch';
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import { useState, useEffect } from '@wordpress/element';

import Box from '../../ui/Box';
import Product from './Product';

export default ({ collectionId }) => {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(false);
	const [total, setTotal] = useState(0);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(0);
	const { receiveEntityRecords } = useDispatch(coreStore);

	useEffect(() => {
		fetchProducts();
	}, [page]);

	const fetchProducts = async () => {
		// get the products
		const { baseURL } = select(coreStore).getEntityConfig(
			'surecart',
			'product'
		);

		const query = {
			product_collection_ids: [collectionId],
			expand: ['prices'],
			per_page: 5,
			page,
		};

		try {
			setLoading(true);
			const result = await apiFetch({
				path: addQueryArgs(baseURL, query),
				parse: false,
			});
			setTotal(result.headers.get('X-WP-Total'));
			setTotalPages(result.headers.get('X-WP-TotalPages'));
			const products = await result.json();
			setProducts(products);
			receiveEntityRecords('surecart', 'product', products, query);
		} catch (e) {
			console.error(e);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Box
			title={__('Products', 'surecart')}
			loading={loading}
			header_action={
				!loading && (
					<ScTag>{sprintf(__('%d Total', 'surecart'), total)}</ScTag>
				)
			}
			footer={
				totalPages > 1 && (
					<div
						css={css`
							display: flex;
							align-items: center;
							justify-content: center;
							width: 100%;
						`}
					>
						<ScButtonGroup>
							<ScButton
								disabled={page === 1}
								onClick={() => setPage(page - 1)}
							>
								<ScIcon name="chevron-left" />
							</ScButton>
							<ScButton
								disabled={page >= totalPages}
								onClick={() => setPage(page + 1)}
							>
								<ScIcon name="chevron-right" />
							</ScButton>
						</ScButtonGroup>
					</div>
				)
			}
		>
			<ScStackedList>
				<ScCard noPadding>
					{(products || []).map((product) => {
						return (
							<ScStackedListRow
								href={addQueryArgs('admin.php', {
									page: 'sc-products',
									action: 'edit',
									id: product?.id,
								})}
								key={product?.id}
							>
								<Product product={product} />
								<ScIcon name="chevron-right" slot="suffix" />
							</ScStackedListRow>
						);
					})}

					{!loading && !products.length && (
						<ScStackedListRow>
							<div
								css={css`
									display: flex;
									justify-content: center;
									align-items: center;
									flex-direction: column;
									padding: 0.5em;
									color: var(--sc-color-gray-500);
								`}
							>
								<ScIcon name="box" size="large" />
								<p>{__('No products added.', 'surecart')}</p>
							</div>
						</ScStackedListRow>
					)}
				</ScCard>
			</ScStackedList>
		</Box>
	);
};
