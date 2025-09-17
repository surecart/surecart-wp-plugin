/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';
import Box from '../../ui/Box';
import Availability from '../components/Availability';
import Status from '../components/Status';
import Url from '../components/Url';
import { ScSwitch } from '@surecart/components-react';
import CatalogedAt from '../components/CatalogedAt';

export default ({ product, updateProduct, post, loading }) => {
	const tag = document.querySelector('#wp-admin-bar-view-product-page');
	const link = document.querySelector('#wp-admin-bar-view-product-page a');

	// keep the admin bar page link in sync with url.
	useEffect(() => {
		if (!link || !tag) {
			return;
		}
		if (product?.permalink) {
			tag.classList.remove('hidden');
			link.href = product.permalink;
		} else {
			tag.classList.add('hidden');
		}
	}, [product]);

	return (
		<Box
			loading={loading}
			title={
				<div
					css={css`
						display: flex;
						align-items: center;
						justify-content: space-between;
					`}
				>
					{__('Publishing', 'surecart')}
				</div>
			}
			header_action={
				!loading && (
					<ScSwitch
						css={css`
							min-width: initial !important;
						`}
						style={{
							'--width': '18px',
							'--height': '10px',
							'--thumb-size': '8px',
						}}
						checked={product?.featured}
						onScChange={(e) =>
							updateProduct({
								featured: e.target.checked,
							})
						}
					>
						{__('Featured', 'surecart')}
					</ScSwitch>
				)
			}
		>
			<div
				css={css`
					margin-right: -15px;
					width: auto;
				`}
			>
				<Availability product={product} updateProduct={updateProduct} />
				<Status product={product} updateProduct={updateProduct} />
				<Url product={product} updateProduct={updateProduct} />
				<CatalogedAt product={product} updateProduct={updateProduct} />
			</div>
		</Box>
	);
};
