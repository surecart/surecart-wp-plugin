/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import { ScFormControl, ScText } from '@surecart/components-react';

/**
 * Phone number display component for non-draft invoices.
 *
 * @param {Object} props - Component props.
 * @param {string} props.phone - The phone number to display.
 * @return {JSX.Element} The phone display component.
 */
export default ({ phone }) => {
	return (
		<div
			css={css`
				flex: 1 1 200px;
				padding: var(--sc-card-padding, var(--sc-spacing-large));
				background: var(
					--sc-card-background-color,
					var(--sc-color-white)
				);
				border: 1px solid
					var(--sc-card-border-color, var(--sc-color-gray-300));
				border-radius: var(--sc-input-border-radius-medium);
			`}
		>
			<ScFormControl
				label={__('Phone', 'surecart')}
				css={css`
					height: 100%;
					display: flex;
				`}
			>
				{!!phone ? (
					<ScText
						style={{
							marginTop: 'var(--sc-spacing-small)',
						}}
					>
						{phone}
					</ScText>
				) : (
					<ScText
						style={{
							marginTop: 'var(--sc-spacing-small)',
						}}
					>
						{__('No phone number has been set.', 'surecart')}
					</ScText>
				)}
			</ScFormControl>
		</div>
	);
};
