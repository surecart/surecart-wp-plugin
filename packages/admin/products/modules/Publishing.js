/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';
import Box from '../../ui/Box';
import Availability from '../components/Availability';
import SelectTemplate from '../components/SelectTemplate';
import SelectTemplatePart from '../components/SelectTemplatePart';
import Status from '../components/Status';
import Url from '../components/Url';
import { ScSwitch } from '@surecart/components-react';

export default ({ product, updateProduct, loading }) => {
	const tag = document.querySelector('#wp-admin-bar-view-product-page');
	const link = document.querySelector('#wp-admin-bar-view-product-page a');

	// keep the admin bar page link in sync with url.
	useEffect(() => {
		if (!link || !tag) {
			return;
		}
		if (product?.slug) {
			tag.classList.remove('hidden');
			link.href = `${scData?.home_url}/${scData?.product_page_slug}/${product?.slug}`;
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
			<div>
				<Availability product={product} updateProduct={updateProduct} />
				<Status product={product} updateProduct={updateProduct} />
				{scData?.is_block_theme ? (
					<SelectTemplate
						product={product}
						updateProduct={updateProduct}
					/>
				) : (
					<SelectTemplatePart
						product={product}
						updateProduct={updateProduct}
					/>
				)}
				<Url product={product} updateProduct={updateProduct} />
			</div>
		</Box>
	);
};
