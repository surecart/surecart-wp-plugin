/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { ScButton, ScFlex, ScSelect } from '@surecart/components-react';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Placeholder } from '@wordpress/components';
import { useState } from '@wordpress/element';

export default ({ onSelectProduct, productChoices, loadingProducts }) => {
	const [showSelect, setShowSelect] = useState(false);

	if (loadingProducts) {
		return (
			<ScFlex
				flexDirection="column"
				style={{ gap: 'var(--sc-spacing-medium)' }}
			>
				<sc-skeleton
					style={{
						width: '20%',
						height: '25px',
						display: 'inline-block',
					}}
				></sc-skeleton>
				<sc-skeleton
					style={{
						width: '60%',
						height: '25px',
						display: 'inline-block',
					}}
				></sc-skeleton>
				<sc-skeleton
					style={{
						width: '40%',
						height: '25px',
						display: 'inline-block',
					}}
				></sc-skeleton>
			</ScFlex>
		);
	}

	return (
		<Placeholder
			label={__('Select a product', 'surecart')}
			instructions={__(
				'Please pick a product with available variants to use the Variant Price Selector.',
				'surecart'
			)}
		>
			{showSelect ? (
				<>
					<div
						css={css`
							width: 100%;
							display: flex;
							margin-bottom: var(--sc-spacing-medium);
						`}
					>
						<ScSelect
							placeholder={__('Choose product', 'surecart')}
							search
							choices={productChoices}
							css={css`
								width: 100%;
							`}
							onScChange={(e) => {
								onSelectProduct(e.target.value);
							}}
						/>
					</div>
				</>
			) : (
				<ScButton
					type="default"
					onClick={() => setShowSelect(true)}
					css={css`
						width: auto;
					`}
				>
					{__('Select Product', 'surecart')}
				</ScButton>
			)}
		</Placeholder>
	);
};
