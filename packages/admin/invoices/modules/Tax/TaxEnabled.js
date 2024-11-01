/** @jsx jsx */
import { css, jsx } from '@emotion/react';

/**
 * External dependencies.
 */
import { useEffect, useState } from '@wordpress/element';
import { PanelRow } from '@wordpress/components';
import { ScIcon, ScSwitch } from '@surecart/components-react';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import { useInvoice } from '../../hooks/useInvoice';

export default ({ value, onChange, locked }) => {
	const { isDraftInvoice } = useInvoice();

	return (
		<PanelRow
			css={css`
				align-items: center;
				justify-content: space-between;
				width: 100%;
			`}
		>
			<span
				css={css`
					display: block;
					flex-shrink: 0;
					padding: 6px 0;
					width: 45%;
				`}
			>
				{__('Charge taxes', 'surecart')}
			</span>

			{!locked ? (
				<ScSwitch
					checked={value}
					onScChange={(e) => onChange(e.target.checked)}
				/>
			) : (
				<ScIcon
					name={value ? 'check' : 'x'}
					style={{ fontSize: '16px' }}
				/>
			)}
		</PanelRow>
	);
};
