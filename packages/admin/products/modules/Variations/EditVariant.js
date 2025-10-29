/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { __ } from '@wordpress/i18n';
import {
	ScButton,
	ScIcon,
	ScDrawer,
	ScForm,
	ScInput,
} from '@surecart/components-react';
import { useState } from '@wordpress/element';
import useVariantValue from '../../hooks/useVariantValue';

import DrawerSection from '../../../ui/DrawerSection';
import Image from './Image';
import Inventory from './Inventory';
import Purchases from './Purchases';
import Licensing from './Licensing';
import Shipping from './Shipping';

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
						<Image
							variant={variant}
							onAdd={onLinkMedia}
							onRemove={onUnlinkMedia}
							size={'98px'}
						/>
						<DrawerSection title={__('Options', 'surecart')}>
							<div
								css={css`
									display: grid;
									gap: var(--sc-spacing-small);
								`}
							>
								{variantOptions?.map((option, index) => (
									<ScInput
										key={index}
										css={css`
											margin-bottom: var(
												--sc-spacing-small
											);
										`}
										value={
											variant?.[`option_${index + 1}`] ??
											''
										}
										label={option?.name}
										required
										tabindex="0"
										onScInput={(e) =>
											updateVariant({
												[`option_${index + 1}`]:
													e.target.value,
											})
										}
									/>
								))}
							</div>
						</DrawerSection>

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

						<DrawerSection title={__('Tax', 'surecart')}>
							sdafsdf
						</DrawerSection>
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
					<div
						css={css`
							align-content: center;
						`}
					>
						{getValue('tax_enabled') &&
							scData?.tax_protocol?.tax_enabled &&
							scData?.tax_protocol?.tax_behavior ===
								'inclusive' && (
								<span
									css={css`
										text-align: right;
									`}
								>
									<ScButton
										size="small"
										type="text"
										target="_blank"
										href="admin.php?page=sc-settings&tab=tax_protocol"
									>
										{__('Tax is included', 'surecart')}
										<ScIcon
											name="external-link"
											slot="suffix"
										/>
									</ScButton>
								</span>
							)}
					</div>
				</div>
			</ScDrawer>
		</ScForm>
	);
};
