/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { sprintf } from '@wordpress/i18n';
import VariantThumbnail from './VariantThumbnail';

// "Red / L" from option_1..option_3, fallback "Variant #N" for drafts.
const formatLabel = (variant) => {
	const parts = [variant?.option_1, variant?.option_2, variant?.option_3]
		.filter((p) => !!p && p !== '')
		.map(String);
	if (parts.length) return parts.join(' / ');
	const pos = variant?.position;

	return pos
		? sprintf(__('Variant #%d', 'surecart'), pos)
		: __('Variant', 'surecart');
};

export default ({ item }) => {
	const isDraft = item?.status === 'draft';
	const Label = isDraft ? 'del' : 'span';
	return (
		<div
			className="sc-variant-cell sc-variant-cell--name"
			css={css`
				display: flex;
				align-items: center;
				gap: 12px;
				min-width: 0;
			`}
		>
			<VariantThumbnail variant={item} />
			<Label
				css={css`
					font-weight: 600;
					font-size: 13px;
					color: var(--sc-color-gray-900);
					word-break: break-word;
					${isDraft && 'color: var(--sc-color-gray-400);'}
				`}
			>
				{formatLabel(item)}
			</Label>
		</div>
	);
};
