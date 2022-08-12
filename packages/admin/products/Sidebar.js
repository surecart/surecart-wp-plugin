/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { ScSwitch } from '@surecart/components-react';
import { format } from '@wordpress/date';
import { Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import Box from '../ui/Box';
import Definition from '../ui/Definition';
import Downloads from './modules/Downloads';
import Image from './modules/Image';
import Integrations from './modules/integrations/Integrations';
import Taxes from './modules/Tax';

export default ({
	id,
	loading,
	product,
	updateProduct,
	isSaving,
	onToggleArchiveProduct,
}) => {
	return (
		<Fragment>
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

			<Downloads
				id={id}
				product={product}
				updateProduct={updateProduct}
				loading={loading}
			/>

			<Integrations id={id} />

			{/* <Upgrades
				product={product}
				updateProduct={updateProduct}
				loading={loading}
			/> */}
		</Fragment>
	);
};
