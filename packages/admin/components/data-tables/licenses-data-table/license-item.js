/** @jsx jsx */
/**
 * External dependencies.
 */
import { css, jsx } from '@emotion/core';
import { __, _n } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import { ScButton, ScTag } from '@surecart/components-react';

/**
 * Internal dependencies.
 */
import ProductLineItem from '../../../ui/ProductLineItem';

export default (license) => {
	const {
		purchase: { id, variant, price, product },
	} = license;

	return {
		item: (
			<ProductLineItem
				key={id}
				lineItem={{
					price: {
						...price,
						product,
					},
					variant,
					variant_options: [
						variant?.option_1,
						variant?.option_2,
						variant?.option_3,
					],
				}}
			>
				<div
					css={css`
						display: flex;
						align-items: center;
						gap: 0.25em;
					`}
				>
					<span>{__('Usage', 'surecart')}</span>
					<span>{'∙'}</span>
					<ScTag
						type="info"
						style={{
							minWidth: 'max-content',
							'font-size': '1.1em',
						}}
						size="small"
					>
						{parseInt(license?.activations_count || 0)}
						{' / '}
						{parseInt(license?.activation_limit) || '∞'}
					</ScTag>
				</div>
			</ProductLineItem>
		),
		actions: (
			<ScButton
				onClick={() =>
					window.location.assign(
						addQueryArgs('admin.php', {
							page: 'sc-licenses',
							action: 'edit',
							id: license?.id,
						})
					)
				}
				size="small"
			>
				{__('View', 'surecart')}
			</ScButton>
		),
	};
};
