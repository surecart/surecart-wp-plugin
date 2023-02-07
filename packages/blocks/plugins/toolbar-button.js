/** @jsx jsx */
import { registerPlugin } from '@wordpress/plugins';
import { render } from '@wordpress/element';
import { useDispatch, useSelect } from '@wordpress/data';
import { getQueryArg } from '@wordpress/url';
import { store as coreStore } from '@wordpress/core-data';
import { store as blockEditorStore } from '@wordpress/block-editor';
import { store as editorStore } from '@wordpress/editor';
import { __ } from '@wordpress/i18n';
import { css, jsx } from '@emotion/core';
import {
	ScBlockUi,
	ScButton,
	ScCard,
	ScFlex,
	ScFormControl,
} from '@surecart/components-react';
import { useEffect, useState } from 'react';
import ModelSelector from '../../admin/components/ModelSelector';

/**
 * Add Prebuilt Library button to Gutenberg toolbar
 */
function ProductPreview() {
	const { getCurrentPost } = useSelect(editorStore);
	const [productId, setProductId] = useState(
		getQueryArg(window.location.href, 'product')
	);

	const { product, loading } = useSelect(
		(select) => {
			if (!productId) {
				const queryArgs = [
					'root',
					'product',
					{
						expand: ['prices'],
						per_page: 1,
					},
				];
				return {
					product: select(coreStore).getEntityRecords(
						...queryArgs
					)?.[0],
					loading: select(coreStore).isResolving(
						'getEntityRecords',
						queryArgs
					),
				};
			}

			const queryArgs = [
				'root',
				'product',
				productId,
				{
					expand: ['prices'],
				},
			];
			return {
				product: select(coreStore).getEntityRecord(...queryArgs),
				loading: select(coreStore).isResolving(
					'getEntityRecord',
					queryArgs
				),
			};
		},
		[productId]
	);

	useEffect(() => {
		const surecart = window?.surecart || window.parent?.surecart;
		if (product && surecart.product?.state?.product) {
			surecart.product.state.product = product;
			surecart.product.state.prices = product.prices?.data || [];
			surecart.product.state.selectedPrice = product?.prices?.data?.[0];
		}
	}, [product]);

	const LibraryButton = () => {
		const { is_surecart_template } = getCurrentPost();
		console.log({ is_surecart_template });
		return (
			<div
				css={css`
					position: relative;
				`}
			>
				<ScFlex
					css={css`
						margin-left: 10px;
						border-left: 1px solid #ccc;
						padding-left: 15px;
					`}
					alignItems="center"
				>
					<span>{__('Previewing', 'surecart')}</span>
					<ModelSelector
						css={css`
							width: 200px;
						`}
						value={productId}
						name="product"
						requestQuery={{ published: true, archived: false }}
						onSelect={(id) => setProductId(id)}
					/>
				</ScFlex>
				{loading && <ScBlockUi spinner />}
			</div>
		);
	};

	const checkElement = async (selector) => {
		while (document.querySelector(selector) === null) {
			await new Promise((resolve) => requestAnimationFrame(resolve));
		}
		return document.querySelector(selector);
	};

	checkElement('.edit-post-header-toolbar').then((selector) => {
		if (!selector.querySelector('.surecart-product-preview')) {
			const toolbarButton = document.createElement('div');
			toolbarButton.classList.add('surecart-product-preview');

			selector.appendChild(toolbarButton);
			render(<LibraryButton />, toolbarButton);
		}
	});

	return null;
}
registerPlugin('surecart-product-preview', {
	render: ProductPreview,
});
