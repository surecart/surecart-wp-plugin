/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import { ScInput } from '@surecart/components-react';

export default ({ price, updatePrice }) => {
	return (
		<ScInput
			label={__('Revoke after', 'surecart')}
			className="sc-revoke-after-days"
			css={css`
				flex: 1 1 50%;
			`}
			type="number"
			min={1}
			value={price?.revoke_after_days}
			onScInput={(e) =>
				updatePrice({
					revoke_after_days: parseInt(
						e.target.value
					),
				})
			}
		>
			<span slot="suffix">{__('Days', 'surecart')}</span>
		</ScInput>
	);
};
