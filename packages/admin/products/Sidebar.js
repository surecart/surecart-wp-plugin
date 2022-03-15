/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { __ } from '@wordpress/i18n';
import { format } from '@wordpress/date';
import { Fragment } from '@wordpress/element';

import Box from '../ui/Box';
import Definition from '../ui/Definition';
import { CeSwitch } from '@checkout-engine/components-react';
import Image from './modules/Image';
import Upgrades from './modules/Upgrades';
import Files from './modules/Files';
import useCurrentPage from '../mixins/useCurrentPage';

export default ({ id, loading, product, updateProduct, saveProduct }) => {
	const { isSaving, setSaving } = useCurrentPage('product');

	const badge = () => {
		if (loading) {
			return null;
		}
		return product?.recurring ? (
			<ce-tag type="success">
				<div
					css={css`
						display: flex;
						align-items: center;
						gap: 0.5em;
					`}
				>
					<ce-icon name="repeat" />
					{__('Subscription Product', 'checkout_engine')}
				</div>
			</ce-tag>
		) : (
			<ce-tag type="success">
				<div
					css={css`
						display: flex;
						align-items: center;
						gap: 0.5em;
					`}
				>
					<ce-icon name="bookmark" />
					{__('One-Time Product', 'checkout_engine')}
				</div>
			</ce-tag>
		);
	};

	const onToggleArchiveProduct = async () => {
		try {
			setSaving(true);
			return await saveProduct({
				data: {
					archived: !product?.archived,
				},
			});
		} catch (e) {
			addModelErrors('product', e);
			throw e;
		} finally {
			setSaving(false);
		}
	};

	return (
		<Fragment>
			<Box
				loading={loading}
				header_action={badge()}
				title={
					<div
						css={css`
							display: flex;
							align-items: center;
							justify-content: space-between;
						`}
					>
						{__('Summary', 'checkout_engine')}
					</div>
				}
			>
				<Fragment>
					<Definition
						title={__('Available for purchase', 'checkout_engine')}
					>
						<CeSwitch
							checked={!product?.archived}
							disabled={isSaving}
							onClick={(e) => {
								e.preventDefault();
								if (isSaving) return false;
								const r = confirm(
									product?.archived
										? sprintf(
												__(
													'Un-Archive %s? This will make the product purchaseable again.',
													'checkout_engine'
												),
												product?.name || 'Product'
										  )
										: sprintf(
												__(
													'Archive %s? This product will not be purchaseable and all unsaved changes will be lost.',
													'checkout_engine'
												),
												product?.name || 'Product'
										  )
								);
								if (!r) return;
								onToggleArchiveProduct();
							}}
						/>
					</Definition>
					{!!product?.archived_at && (
						<Definition
							css={css`
								margin-bottom: 1em;
							`}
							title={__('Archived On', 'checkout_engine')}
						>
							{format(
								'F j, Y',
								new Date(product?.archived_at * 1000)
							)}
						</Definition>
					)}
					{!!product?.updated_at && (
						<Definition
							title={__('Last Updated', 'checkout_engine')}
						>
							{format(
								'F j, Y',
								new Date(product.updated_at * 1000)
							)}
						</Definition>
					)}
					{!!product?.created_at && (
						<Definition title={__('Created On', 'checkout_engine')}>
							{format(
								'F j, Y',
								new Date(product.created_at * 1000)
							)}
						</Definition>
					)}
				</Fragment>
			</Box>

			<Image
				product={product}
				updateProduct={updateProduct}
				loading={loading}
			/>

			<Files
				id={id}
				product={product}
				updateProduct={updateProduct}
				loading={loading}
			/>

			<Upgrades
				product={product}
				updateProduct={updateProduct}
				loading={loading}
			/>
			{/*
			<Box
				loading={loading}
				title={__('Automations', 'checkout_engine')}
				css={css`
					font-size: 14px;
				`}
				footer={
					!loading && (
						<CeButton>
							<svg
								slot="prefix"
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<line x1="12" y1="5" x2="12" y2="19"></line>
								<line x1="5" y1="12" x2="19" y2="12"></line>
							</svg>

							{__('Add Automation', 'checkout_engine')}
						</CeButton>
					)
				}
			>
				{__('Coming soon...', 'checkout_engine')}
			</Box> */}
		</Fragment>
	);
};
