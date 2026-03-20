/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import Code from './Code';
import { ScEmpty } from '@surecart/components-react';

export default ({ promotions, onUpdate, emptyIcon, emptyMessage, loading }) => {
	if (!promotions?.length && !loading) {
		return (
			<ScEmpty icon={emptyIcon || 'tag'}>
				{emptyMessage || __('No promotion codes found.', 'surecart')}
			</ScEmpty>
		);
	}

	return (
		<div
			css={css`
				display: flex;
				flex-direction: column;
				gap: var(--sc-spacing-medium);
			`}
		>
			{promotions.map((promotion) => (
				<Code
					promotion={promotion}
					key={promotion?.id}
					onUpdate={onUpdate}
				/>
			))}
		</div>
	);
};
