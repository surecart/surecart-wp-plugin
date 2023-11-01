/** @jsx jsx */
import { css, jsx } from '@emotion/react';

/**
 * External dependencies.
 */
import { cleanForSlug } from '@wordpress/url';
import { __experimentalInspectorPopoverHeader as InspectorPopoverHeader } from '@wordpress/block-editor';
import { TextControl, ExternalLink } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export default ({ collection, updateCollection, onClose }) => {
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
			<InspectorPopoverHeader title={__('URL', 'surecart')} onClose={onClose} />

			<TextControl
				__nextHasNoMarginBottom
				label={__('Permalink', 'surecart')}
				value={collection?.slug}
				autoComplete="off"
				spellCheck="false"
				help={
					<>
						{__('The last part of the URL.', 'surecart')}{' '}
					</>
				}
				onChange={(slug) => updateCollection({ slug })}
				onBlur={(event) =>
					updateCollection({
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
				{__('View Product Collection', 'surecart')}
			</h3>

			<p>
				<ExternalLink
					className="editor-post-url__link"
					href={`${scData?.home_url}/${scData?.collection_page_slug}/${collection?.slug}`}
					target="_blank"
				>
					{scData?.home_url}/{scData?.collection_page_slug}/
					{collection?.slug}
				</ExternalLink>
			</p>
		</div>
	);
};
