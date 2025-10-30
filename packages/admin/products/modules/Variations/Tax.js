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
	ScSwitch,
	ScSelect,
	ScButton,
	ScIcon,
} from '@surecart/components-react';
import DrawerSection from '../../../ui/DrawerSection';
import useVariantValue from '../../hooks/useVariantValue';
import ResetOverridesDropdown from './ResetOverridesDropdown';

export default ({ variant, updateVariant, product }) => {
	const { getValue, isOverridden, getUpdateValue } = useVariantValue({
		variant,
		product,
	});

	return (
		<DrawerSection
			title={__('Tax', 'surecart')}
			suffix={
				<ResetOverridesDropdown
					fields={[
						{
							key: 'tax_enabled',
							label: __('Tax enabled', 'surecart'),
						},
						{
							key: 'tax_category',
							label: __('Tax category', 'surecart'),
						},
					]}
					isOverridden={isOverridden}
					onReset={(fieldKey) => updateVariant({ [fieldKey]: null })}
				/>
			}
		>
			<div
				css={css`
					display: grid;
					gap: var(--sc-spacing-medium);
				`}
			>
				<ScSwitch
					checked={
						getValue('tax_enabled') &&
						scData?.tax_protocol?.tax_enabled
					}
					disabled={!scData?.tax_protocol?.tax_enabled}
					onScChange={(e) => {
						updateVariant(
							getUpdateValue({
								tax_enabled: e.target.checked,
							})
						);
					}}
				>
					{__('Charge tax on this variant', 'surecart')}
				</ScSwitch>

				{getValue('tax_enabled') &&
					scData?.tax_protocol?.tax_enabled && (
						<ScSelect
							label={__('Taxable Product Type', 'surecart')}
							value={getValue('tax_category')}
							onScChange={(e) => {
								updateVariant(
									getUpdateValue({
										tax_category: e.target.value,
									})
								);
							}}
							choices={[
								{
									value: 'tangible',
									label: __('Physical Product', 'surecart'),
								},
								{
									value: 'digital',
									label: __('Digital Product', 'surecart'),
								},
							]}
						/>
					)}

				{getValue('tax_enabled') &&
					scData?.tax_protocol?.tax_enabled &&
					scData?.tax_protocol?.tax_behavior === 'inclusive' && (
						<div
							css={css`
								display: flex;
								align-items: center;
								gap: var(--sc-spacing-small);
								padding: var(--sc-spacing-small);
								background: var(--sc-color-gray-100);
								border-radius: var(--sc-border-radius-small);
								font-size: var(--sc-font-size-small);
								color: var(--sc-color-gray-600);
							`}
						>
							<span>
								{__('Tax is included in prices', 'surecart')}
							</span>
							<ScButton
								size="small"
								type="link"
								target="_blank"
								href="admin.php?page=sc-settings&tab=tax_protocol"
							>
								{__('Edit Settings', 'surecart')}
								<ScIcon name="external-link" slot="suffix" />
							</ScButton>
						</div>
					)}
			</div>
		</DrawerSection>
	);
};
