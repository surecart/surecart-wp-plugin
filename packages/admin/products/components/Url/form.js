/** @jsx jsx */
import { css, jsx } from '@emotion/react';

/**
 * WordPress dependencies
 */
import { cleanForSlug } from '@wordpress/url';
import { __experimentalInspectorPopoverHeader as InspectorPopoverHeader } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { TextControl, ExternalLink } from '@wordpress/components';

export default ({ product, updateProduct, onClose }) => {
	return (
		<div
			css={css`
				min-width: 248px;
				margin: 8px;

				.block-editor-inspector-popover-header {
					margin-bottom: 16px;
				}
				[class].block-editor-inspector-popover-header__action.has-icon {
					min-width: 24px;
					padding: 0;
				}
				[class].block-editor-inspector-popover-header__action {
					height: 24px;
				}
			`}
		>
			<InspectorPopoverHeader title={__('URL')} onClose={onClose} />

			<TextControl
				__nextHasNoMarginBottom
				label={__('Permalink')}
				value={product?.slug}
				autoComplete="off"
				spellCheck="false"
				help={
					<>
						{__('The last part of the URL.')}{' '}
						{/* <ExternalLink
							href={__(
								'https://wordpress.org/documentation/article/page-post-settings-sidebar/#permalink'
							)}
						>
							{__('Learn more.')}
						</ExternalLink> */}
					</>
				}
				onChange={(slug) => updateProduct({ slug })}
				onBlur={(event) =>
					updateProduct({
						slug: cleanForSlug(event.target.value),
					})
				}
			/>

			<h3
				css={css`
					line-height: 1.2;
					color: rgb(30, 30, 30);
					font-size: 13px;
					font-weight: 600;
					display: block;
				`}
			>
				{__('View Product')}
			</h3>

			<p>
				<ExternalLink
					className="editor-post-url__link"
					href={`${scData?.home_url}/${scData?.product_page_slug}/${product?.slug}`}
					target="_blank"
				>
					{scData?.home_url}/{scData?.product_page_slug}/
					{product?.slug}
				</ExternalLink>
			</p>
		</div>
	);
};
