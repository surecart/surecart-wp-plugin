/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import { ScInput, ScSwitch } from '@surecart/components-react';

export default ({ price, updatePrice }) => {
	return (
		<>
			<ScSwitch
				checked={price?.revoke_after_days}
				onScChange={(e) =>
					updatePrice({
						revoke_after_days: e.target.checked ? 30 : null,
					})
				}
			>
				{__('Expire access', 'surecart')}
			</ScSwitch>
			{!!price?.revoke_after_days && (
				<ScInput
					label={__('Expire access after', 'surecart')}
					help={__(
						'Expiring access will revoke integrations and licenses.',
						'surecart'
					)}
					className="sc-revoke-after-days"
					css={css`
						flex: 1 1 50%;
					`}
					type="number"
					min={1}
					value={price?.revoke_after_days}
					onScInput={(e) =>
						updatePrice({
							revoke_after_days: parseInt(e.target.value),
						})
					}
				>
					<span slot="suffix">{__('days', 'surecart')}</span>
				</ScInput>
			)}
		</>
	);
};
