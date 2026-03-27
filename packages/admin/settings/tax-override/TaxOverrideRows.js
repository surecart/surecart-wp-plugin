/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import {
	ScButton,
	ScDropdown,
	ScFlex,
	ScIcon,
	ScMenu,
	ScMenuItem,
	ScStackedListRow,
	ScText,
} from '@surecart/components-react';

// this controls the grouping of tax overrides by product collection.
export default ({ type, taxOverrides, onRemove, onEdit }) => {
	// Return if no tax overrides exist.
	if (!taxOverrides?.length) {
		return null;
	}

	// Group tax overrides by product collection.
	const groupedTaxOverrides = taxOverrides.reduce((acc, taxOverride) => {
		const productCollectionId = taxOverride?.product_collection?.id;
		acc[productCollectionId] = acc[productCollectionId] || [];
		acc[productCollectionId].push(taxOverride);
		return acc;
	}, {});

	const renderTaxOverride = (taxOverride) => (
		<ScStackedListRow key={taxOverride.id}>
			<div
				css={css`
					display: flex;
					flex-direction: column;
					gap: var(--sc-spacing-xx-small);
				`}
			>
				<ScText
					css={css`
						--font-weight: bold;
					`}
				>
					{taxOverride?.tax_zone?.state_name ||
						taxOverride?.tax_zone?.country_name}
				</ScText>
				<ScText>
					{taxOverride?.rate ?? taxOverride?.tax_zone?.default_rate}%
				</ScText>
			</div>

			<ScDropdown slot="suffix" placement="bottom-end">
				<ScButton type="text" slot="trigger" circle>
					<ScIcon name="more-horizontal" />
				</ScButton>
				<ScMenu>
					<ScMenuItem onClick={() => onEdit(taxOverride)}>
						<ScIcon slot="prefix" name="edit" />
						{__('Edit', 'surecart')}
					</ScMenuItem>
					<ScMenuItem onClick={() => onRemove(taxOverride)}>
						<ScIcon slot="prefix" name="trash" />
						{__('Delete', 'surecart')}
					</ScMenuItem>
				</ScMenu>
			</ScDropdown>
		</ScStackedListRow>
	);

	if (type === 'product') {
		return Object.keys(groupedTaxOverrides).map((taxOverrideGroupId) => {
			const taxOverride =
				groupedTaxOverrides[taxOverrideGroupId]?.[0] || {};
			return (
				<>
					<ScStackedListRow
						css={css`
							--sc-list-row-background-color: var(
								--sc-color-gray-50
							);
						`}
					>
						<ScFlex flexDirection="column">
							<ScText
								css={css`
									--font-weight: bold;
								`}
							>
								{taxOverride?.product_collection?.name}
							</ScText>
						</ScFlex>
					</ScStackedListRow>

					{groupedTaxOverrides[taxOverrideGroupId].map(
						renderTaxOverride
					)}
				</>
			);
		});
	}

	return taxOverrides.map(renderTaxOverride);
};
