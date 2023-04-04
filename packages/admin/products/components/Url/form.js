/** @jsx jsx */
import { css, jsx } from '@emotion/core';

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
						<ExternalLink
							href={__(
								'https://wordpress.org/documentation/article/page-post-settings-sidebar/#permalink'
							)}
						>
							{__('Learn more.')}
						</ExternalLink>
					</>
				}
				onChange={(slug) => updateProduct({ slug })}
				onBlur={(event) =>
					updateProduct({
						slug: cleanForSlug(event.target.value),
					})
				}
			/>

			<h3 className="editor-post-url__link-label">
				{__('View Product')}
			</h3>

			<p>
				<ExternalLink
					className="editor-post-url__link"
					href={'#'}
					target="_blank"
				>
					<>
						<span className="editor-post-url__link-prefix">
							prefix
						</span>
						<span className="editor-post-url__link-slug">
							{product?.slug}
						</span>
						<span className="editor-post-url__link-suffix">
							suffix
						</span>
					</>
				</ExternalLink>
			</p>
		</div>
	);
};
