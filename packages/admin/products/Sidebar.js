/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { ScSwitch } from '@surecart/components-react';
import { format } from '@wordpress/date';
import { Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import useCurrentPage from '../mixins/useCurrentPage';
import Box from '../ui/Box';
import Definition from '../ui/Definition';
import Files from './modules/Files';
import Image from './modules/Image';
import Integrations from './modules/integrations/Integrations';
import Taxes from './modules/Tax';
import Upgrades from './modules/Upgrades';

export default ({ id, loading, product, updateProduct, saveProduct }) => {
	const { isSaving, setSaving } = useCurrentPage('product');

	const badge = () => {
		if (loading) {
			return null;
		}
		return product?.recurring ? (
			<sc-tag type="success">
				<div
					css={css`
						display: flex;
						align-items: center;
						gap: 0.5em;
					`}
				>
					<sc-icon name="repeat" />
					{__('Subscription Product', 'surecart')}
				</div>
			</sc-tag>
		) : (
			<sc-tag type="success">
				<div
					css={css`
						display: flex;
						align-items: center;
						gap: 0.5em;
					`}
				>
					<sc-icon name="bookmark" />
					{__('One-Time Product', 'surecart')}
				</div>
			</sc-tag>
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
						{__('Summary', 'surecart')}
					</div>
				}
			>
				<Fragment>
					<Definition
						title={__('Available for purchase', 'surecart')}
					>
						<ScSwitch
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
													'surecart'
												),
												product?.name || 'Product'
										  )
										: sprintf(
												__(
													'Archive %s? This product will not be purchaseable and all unsaved changes will be lost.',
													'surecart'
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
							title={__('Archived On', 'surecart')}
						>
							{format(
								'F j, Y',
								new Date(product?.archived_at * 1000)
							)}
						</Definition>
					)}
					{!!product?.updated_at && (
						<Definition title={__('Last Updated', 'surecart')}>
							{format(
								'F j, Y',
								new Date(product.updated_at * 1000)
							)}
						</Definition>
					)}
					{!!product?.created_at && (
						<Definition title={__('Created On', 'surecart')}>
							{format(
								'F j, Y',
								new Date(product.created_at * 1000)
							)}
						</Definition>
					)}
				</Fragment>
			</Box>

			<Taxes
				product={product}
				updateProduct={updateProduct}
				loading={loading}
			/>

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

			{!!id && <Integrations id={id} />}

			{/* <Upgrades
				product={product}
				updateProduct={updateProduct}
				loading={loading}
			/> */}
		</Fragment>
	);
};
