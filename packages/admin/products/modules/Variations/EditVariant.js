/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { __ } from '@wordpress/i18n';
import { ScButton, ScDrawer, ScForm } from '@surecart/components-react';
import { useState } from '@wordpress/element';
import useVariantValue from '../../hooks/useVariantValue';

import Image from './Image';
import Inventory from './Inventory';
import Purchases from './Purchases';
import Licensing from './Licensing';
import Shipping from './Shipping';
import Tax from './Tax';

export default ({
	variant,
	product,
	updateVariant,
	variantOptions,
	onRequestClose,
}) => {
	const [open, setOpen] = useState(true);
	const { getValue } = useVariantValue({ variant, product });

	/**
	 * Link media.
	 */
	const onLinkMedia = (media) =>
		updateVariant({
			metadata: { ...(variant.metadata || []), wp_media: media?.[0]?.id },
		});

	/**
	 * Unlink Media
	 */
	const onUnlinkMedia = () => {
		const confirmUnlinkMedia = confirm(
			__('Are you sure you wish to unlink this image?', 'surecart')
		);
		if (!confirmUnlinkMedia) return;
		updateVariant({
			image_id: null, // backwards compatibility.
			image_url: null, // backwards compatibility.
			image: null, // backwards compatibility.
			metadata: { ...(variant.metadata || []), wp_media: null },
		});
	};

	return (
		<ScForm
			onScSubmit={(e) => {
				e.preventDefault();
				e.stopImmediatePropagation();
			}}
			onScFormSubmit={(e) => {
				e.preventDefault();
				e.stopImmediatePropagation();
				// close the drawer maybe
				console.log('submit');
				setOpen(false);
			}}
		>
			<ScDrawer
				label={__('Edit Variant', 'surecart')}
				style={{
					'--sc-drawer-size': '38rem',
					'--sc-input-label-margin': 'var(--sc-spacing-small)',
				}}
				onScAfterHide={onRequestClose}
				open={open}
				stickyHeader
				stickyFooter
			>
				<div
					css={css`
						display: flex;
						flex-direction: column;
						height: 100%;
						background: var(--sc-color-gray-50);
					`}
				>
					<div
						css={css`
							padding: 30px;
							display: grid;
							gap: var(--sc-spacing-large);
						`}
					>
						<div
							css={css`
								background: var(--sc-color-white);
								border: 1px solid var(--sc-color-gray-200);
								border-radius: var(--sc-border-radius-medium);
								padding: var(--sc-spacing-large);
								display: flex;
								align-items: flex-start;
								gap: var(--sc-spacing-large);
							`}
						>
							<Image
								variant={variant}
								onAdd={onLinkMedia}
								onRemove={onUnlinkMedia}
								size={'98px'}
							/>
							<div
								css={css`
									flex: 1;
									display: flex;
									flex-direction: column;
									gap: var(--sc-spacing-small);
									justify-content: center;
									min-height: 98px;
								`}
							>
								{variantOptions?.map((option, index) => {
									const value =
										variant?.[`option_${index + 1}`] ?? '';
									return (
										<div
											key={index}
											css={css`
												display: flex;
												gap: var(--sc-spacing-x-small);
												font-size: var(
													--sc-font-size-medium
												);
												line-height: 1.5;
											`}
										>
											<span
												css={css`
													color: var(
														--sc-color-gray-500
													);
													font-weight: 500;
												`}
											>
												{option?.name}:
											</span>
											<span
												css={css`
													color: var(
														--sc-color-gray-900
													);
													font-weight: 600;
												`}
											>
												{value}
											</span>
										</div>
									);
								})}
							</div>
						</div>

						<Inventory
							variant={variant}
							product={product}
							updateVariant={updateVariant}
						/>

						<Purchases
							variant={variant}
							product={product}
							updateVariant={updateVariant}
						/>

						<Licensing
							variant={variant}
							product={product}
							updateVariant={updateVariant}
						/>

						<Shipping
							variant={variant}
							product={product}
							updateVariant={updateVariant}
						/>

						<Tax
							variant={variant}
							product={product}
							updateVariant={updateVariant}
						/>
					</div>
				</div>

				<div
					css={css`
						display: flex;
						justify-content: space-between;
					`}
					slot="footer"
				>
					<div>
						<ScButton type="primary" submit>
							{__('Done', 'surecart')}
						</ScButton>
						<ScButton type="text" onClick={() => setOpen(false)}>
							{__('Cancel', 'surecart')}
						</ScButton>
					</div>
				</div>
			</ScDrawer>
		</ScForm>
	);
};
