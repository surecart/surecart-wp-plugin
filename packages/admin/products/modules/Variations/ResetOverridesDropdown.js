/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import {
	ScButton,
	ScDropdown,
	ScIcon,
	ScMenu,
	ScMenuItem,
	ScMenuLabel,
	ScTag,
} from '@surecart/components-react';

/**
 * Dropdown component to reset individual overridden fields.
 *
 * @param {Object} props
 * @param {Array} props.fields - Array of field objects with { key, label }
 * @param {Function} props.isOverridden - Function to check if a field is overridden
 * @param {Function} props.onReset - Function to reset a field
 */
export default ({ fields = [], isOverridden, onReset }) => {
	// Get list of overridden fields
	const overriddenFields = fields.filter((field) => isOverridden(field.key));

	// Don't render if no overrides
	if (overriddenFields.length === 0) {
		// prevent layout shift
		return (
			<ScButton
				size="small"
				type="text"
				style={{ visibility: 'hidden', opacity: 0 }}
			/>
		);
	}

	return (
		<ScDropdown placement="bottom-end" style={{ '--panel-width': '14rem' }}>
			<ScButton
				type="text"
				size="small"
				slot="trigger"
				css={css`
					color: var(--sc-color-gray-500);
				`}
			>
				<ScIcon name="refresh-cw" slot="prefix" />
				{__('Reset', 'surecart')}
				<ScTag type="info" slot="suffix">
					{overriddenFields.length}
				</ScTag>
			</ScButton>
			<ScMenu>
				<ScMenuLabel>{__('Reset Overrides', 'surecart')}</ScMenuLabel>
				{overriddenFields.map((field) => (
					<ScMenuItem
						key={field.key}
						onClick={() => onReset(field.key)}
					>
						<ScIcon
							name="refresh-cw"
							slot="suffix"
							css={css`
								opacity: 0.65;
								font-size: var(--sc-font-size-x-small);
							`}
						/>
						{field.label}
					</ScMenuItem>
				))}
			</ScMenu>
		</ScDropdown>
	);
};
